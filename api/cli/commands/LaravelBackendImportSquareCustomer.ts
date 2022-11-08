import { Option } from "commander";
import { BaseCommand } from "./BaseCommand";
import { createSpinner } from 'nanospinner'
import { ImportTrack } from "../../../core/src/models/ImportTrack";
import { postgresPoolConfig } from "../../src/config/postgresConfig";
import { SquareCustomer } from "../../../core/src/models/SquareCustomer";
import * as mysql from "mysql2/promise";
import * as pg from "pg";
import chalk from 'chalk';
import process from "process";
import moment from "moment";
import { PatientV1 } from "../../../core/src/models/PatientV1";
import { LaravelBackendConfig } from "../../src/config/laravelBackendConfig";

export class LaravelBackendImportSquareCustomer implements BaseCommand {
    static signature: string = "laravel-backend:import-square-customers";

    static description: string = "Imports Square customer data from Laravel " +
        "backend and attaches the same to it's respective patients.";

    static options?: Option[] = [
        new Option("--reset", "Whether to delete all the existing data"),
        new Option("--resume", "Whether a previous incomplete task must resume"),
        new Option("--delete-untracked", "Whether to delete the existing data which are not covered by this track after import completes"),
    ];

    async handle(options: any, command: any) {
        console.info(chalk.cyan("Importing Square customers"));

        const schemaName = "SquareCustomer";

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

                const pageSize = 500;
                let offset = track.lastImportedOffset || 0;

                spinner.start();

                // Determine total record.
                spinner.update({ text: "Identifying total records." });

                const totalRecordResult = await mysqlPool.query(`SELECT COUNT(*) as totalRecords from square_customers`);
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

                    const dataQuery = `SELECT square_customers.*, patients.uid as patientUid FROM square_customers ` +
                        `LEFT JOIN patients ON square_customers.uid = patients.square_customer_uid ` +
                        (!lastId ? '' : `WHERE square_customers.id > ${lastId} `) +
                        `ORDER BY square_customers.id ` +
                        `LIMIT ${pageSize}`
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

                        // Check if the object already exists
                        let object = await new Parse.Query(SquareCustomer)
                            .equalTo("objectId", row.uid)
                            .first();

                        const isExisting = !!object;

                        if (!isExisting) {
                            object = new SquareCustomer();
                            object.id = row.uid;;
                        }

                        // Populate data
                        object.givenName = row.given_name;
                        object.familyName = row.family_name;
                        object.emailAddress = row.email_address;
                        object.address = row.address;
                        object.phoneNumber = row.phone_number;
                        object.referenceId = row.reference_id;
                        object.note = row.note;
                        object.preferences = row.preferences;
                        object.creationSource = row.creation_source;
                        object.segmentIds = row.segment_ids;
                        object.version = row.version;
                        object.createdAt = moment(row.created_at).toDate();
                        object.updatedAt = moment(row.updated_at).toDate();
                        object.environment = "production";
                        object.importTrack = track;

                        // Save the object
                        await object.save(null, { useMasterKey: true });

                        // Find patient if patientUid exists and attach square customer
                        if (row.patientUid) {
                            const patientObject: PatientV1 | undefined = await new Parse.Query(PatientV1)
                                .get(row.patientUid, { useMasterKey: true })
                                .catch((e) => (undefined));
                            if (patientObject) {
                                patientObject.set("squareCustomer", object);
                                await patientObject.save(null, { useMasterKey: true });
                            }
                        }

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

// Command: thdc laravel-backend:import-square-customers