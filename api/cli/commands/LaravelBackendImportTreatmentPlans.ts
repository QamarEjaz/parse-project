import { Option } from "commander";
import { BaseCommand } from "./BaseCommand";
import { createSpinner } from 'nanospinner'
import { ImportTrack } from "../../../core/src/models/ImportTrack";
import { postgresPoolConfig } from "../../src/config/postgresConfig";
import * as mysql from "mysql2/promise";
import * as pg from "pg";
import chalk from 'chalk';
import process from "process";
import moment from "moment";
import { IPatientV1, PatientV1 } from "../../../core/src/models/PatientV1";
import { LaravelBackendConfig } from "../../src/config/laravelBackendConfig";
import { TreatmentPlan } from "../../../core/src/models/TreatmentPlan";
import { AppointmentV1, IAppointmentV1, ILocationV1, LocationV1 } from "../../../core/src";
import * as crypto from "crypto";

export class LaravelBackendImportTreatmentPlans implements BaseCommand {
    static signature: string = "laravel-backend:import-treatment-plans";

    static description: string = "Imports treatment plans data from the Laravel " +
        "backend.";

    static options?: Option[] = [
        new Option("--reset", "Whether to delete all the existing data"),
        new Option("--resume", "Whether a previous incomplete task must resume"),
        new Option("--delete-untracked", "Whether to delete the existing data which are not covered by this track after import completes"),
    ];

    async handle(options: any, command: any) {
        console.info(chalk.cyan("Importing treatment plans"));

        const schemaName = "TreatmentPlan";

        // A loop to retry if errors occur
        while (true) {
            const spinner = createSpinner();
            let postgresPool: pg.Pool;
            let postgresClient: pg.PoolClient;

            let mysqlPool: mysql.Pool;

            try {
                const shouldReset: boolean = options.reset || false;
                const shouldResume: boolean = shouldReset
                    ? false // You cannot resume with reset
                    : options.resume || false;
                const shouldDeleteUntraked: boolean = options.deleteUntracked || false;

                postgresPool = new pg.Pool(postgresPoolConfig);
                postgresClient = await postgresPool.connect();

                mysqlPool = mysql.createPool(LaravelBackendConfig.getDatabaseConfig());

                if (shouldReset) {
                    const query = `TRUNCATE TABLE public."${schemaName}"`;
                    await postgresClient.query(query);
                    console.log(`${schemaName} table is reset`);
                }

                let track: ImportTrack

                if (shouldResume) {
                    const lastTrack = await new Parse.Query(ImportTrack)
                        .equalTo("schemaName", schemaName)
                        .descending("createdAt")
                        .first();

                    if (lastTrack) {
                        track = lastTrack;
                        console.log(`Resuming previous track with ID ${lastTrack.id}.`);
                    }
                }

                if (!track) {
                    track = new ImportTrack();
                    track.schemaName = schemaName;
                }

                // To keep track of last synced data of the entire process.
                let lastImportedId: number;

                // Used to track of pagination.
                let lastId = track.lastImportedId
                    ? parseInt(track.lastImportedId)
                    : undefined;

                const pageSize = 2;
                let offset = track.lastImportedOffset || 0;

                spinner.start();

                // Determine total record.
                spinner.update({ text: "Identifying total records." });

                const totalRecordResult = await mysqlPool.query(`SELECT COUNT(*) as totalRecords from treatment_plans`);
                let totalRecords = (totalRecordResult[0] as mysql.RowDataPacket[])[0].totalRecords;

                // Update track
                track.totalOnRemote = totalRecords;
                track.lastImportedOffset = offset;
                await track.save(null, { useMasterKey: true });

                let totalPages = Math.ceil(totalRecords / pageSize);

                while (true) {
                    const currentPage = Math.ceil(offset / pageSize) + 1;
                    const exceededMaxPage = currentPage > totalPages;

                    if (!exceededMaxPage) {
                        spinner.update({ text: `Fetching page: ${currentPage} of ${totalPages}` });
                    } else {
                        spinner.update({ text: `Checking if new page exists` });
                    }

                    const dataQuery =
                        `SELECT\n` +
                        `   treatment_plans.id,\n` +
                        `   patients.uid patient_id,\n` +
                        `   appointments.uid appointment_id,\n` +
                        `   locations.uid location_id,\n` +
                        `   treatment_plans.code,\n` +
                        `   treatment_plans.note,\n` +
                        `   treatment_plans.discount_duration_minutes,\n` +
                        `   treatment_plans.discount_percent,\n` +
                        `   treatment_plans.total_amount,\n` +
                        `   treatment_plans.insurance_amount,\n` +
                        `   treatment_plans.payable_amount,\n` +
                        `   treatment_plans.status,\n` +
                        `   CASE WHEN treatments.treatment_plan_id IS NULL THEN\n` +
                        `       NULL\n` +
                        `   ELSE\n` +
                        `       CAST(CONCAT('[', GROUP_CONCAT(JSON_OBJECT('title', treatments.title, 'description', treatments.description, 'amount', treatments.amount, 'insuranceAmount', treatments.insurance_amount)), ']') AS JSON)\n` +
                        `   END treatments\n` +
                        `FROM\n` +
                        `   treatment_plans\n` +
                        `   LEFT JOIN patients ON patients.id = treatment_plans.patient_id\n` +
                        `   LEFT JOIN appointments ON appointments.id = treatment_plans.appointment_id\n` +
                        `   LEFT JOIN locations ON locations.id = treatment_plans.location_id\n` +
                        `   LEFT JOIN treatments ON treatments.treatment_plan_id = treatment_plans.id\n` +
                        (!lastId ? '' : `WHERE treatment_plans.id > ${lastId}\n`) +
                        `GROUP BY\n` +
                        `   treatment_plans.id\n` +
                        `LIMIT ${pageSize}`;

                    const dataResult = await mysqlPool.query(dataQuery);
                    const dataRows = dataResult[0] as mysql.RowDataPacket[];

                    // No more data found
                    if (!dataRows.length) {
                        break;
                    }

                    if (exceededMaxPage) {
                        // Recompute total page based onnew page data]
                        totalRecords += dataRows.length;
                        totalPages = Math.ceil(totalRecords / pageSize);
                    }

                    let itemCount = 0;
                    for await (const row of dataRows) {
                        itemCount++;
                        spinner.update({ text: `Processing page: ${currentPage} of ${totalPages} | Items ${itemCount} of ${dataRows.length}` });

                        const objectId = crypto.createHash('md5')
                            .update(row.id.toString())
                            .digest('hex')
                            .substring(0, 10);

                        // Check if the object already exists
                        let object = await new Parse.Query(TreatmentPlan)
                            .equalTo("objectId", objectId)
                            .first();

                        const isExisting = !!object;

                        if (!isExisting) {
                            object = new TreatmentPlan();
                            object.id = objectId;
                        }

                        const patient = new PatientV1({} as IPatientV1);
                        patient.id = row.patient_id;

                        const location = new LocationV1({} as ILocationV1);
                        location.id = row.location_id;

                        let appointment: AppointmentV1 | undefined;
                        if (row.appointment_id) {
                            appointment = new AppointmentV1({} as IAppointmentV1);
                            appointment.id = row.appointment_id;
                        }

                        // Populate data
                        object.createdAt = moment(row.created_at).toDate();
                        object.updatedAt = moment(row.updated_at).toDate();
                        object.patient = patient;
                        object.location = location;
                        object.appointment = appointment;
                        object.code = row.code;
                        object.note = row.note;
                        object.discountDurationInMinutes = row.discount_duration_minutes;
                        object.discountPercent = row.discount_percent;
                        object.treatments = row.treatments;
                        object.totalAmount = row.total_amount;
                        object.insuranceAmount = row.insurance_amount;
                        object.payableAmount = row.payable_amount;
                        object.status = row.status;
                        object.importTrack = track;

                        // Save the object
                        await object.save(null, { useMasterKey: true });

                        lastId = lastImportedId = row.id;

                        // Update track status after each page.
                        track.lastImportedId = lastId.toString();
                        track.lastImportedOffset = offset;
                        await track.save(null, { useMasterKey: true });

                        offset++;
                    }
                }

                if (shouldDeleteUntraked) {
                    // Delete all data upto that with ID `lastImportedId` without this track ID.
                    const deleteQuery = `DELETE FROM public."${schemaName}"
                    WHERE "objectId" < $1
                    AND (
                        "importTrack" <> $2
                        OR "importTrack" IS NULL
                    )`;
                    await postgresClient.query(deleteQuery, [lastImportedId, track.id]);
                }

                // Mark track as complete
                track.isCompleted = true;
                track.save(null, { useMasterKey: true });

                postgresClient.release()
                await postgresPool.end();

                await mysqlPool && mysqlPool.end()
                    .catch(e => console.error(chalk.red("Failed closing postgresPool.")));

                spinner.success({ text: `Synced ${offset} records` });
                break;
            } catch (error) {
                console.log();
                spinner.error({ text: chalk.red(error) });
                if (error instanceof Error) {
                    console.error(error.stack);
                }
                console.log();

                postgresClient && postgresClient.release();

                await mysqlPool && mysqlPool.end()
                    .catch(e => console.error(chalk.red("Failed closing postgresPool.")));

                // Conditions to retry
                if (
                    (error instanceof Parse.Error && error.code === 100) ||
                    (error instanceof Parse.Error && error.code === 111)
                ) {
                    // Wait for some time before retrying.
                    const retryDelayDuration = 10000;
                    console.info(chalk.yellow(`Retrying in ${retryDelayDuration / 1000} seconds...`));
                    console.log();
                    await (new Promise((resolve) => setTimeout(resolve, retryDelayDuration)));
                    continue;
                }

                process.exit(1);
            }
        }

        process.exit(0);
    }
}

// Command: thdc laravel-backend:import-treatment-plans