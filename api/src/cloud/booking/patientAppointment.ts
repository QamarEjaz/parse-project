import { AvailableSlotService } from "../../services/AvailableSlotService";
import { AscendReference } from "../../interfaces/AscendReference";
import { PatientV1 } from "../../../../core/src/models/PatientV1";
import { LocationV1 } from "../../../../core/src/models/LocationV1";
import { AppointmentV1 } from "../../../../core/src/models/AppointmentV1";
import { ProviderV1 } from "../../../../core/src/models/ProviderV1";
import { PracticeProcedureV1 } from "../../../../core/src/models/PracticeProcedureV1";
import { TwilioClient } from "../../services/external/TwilioClient";
import moment from "moment-timezone";
import { PatientInsuranceService } from "../../services/PatientInsuranceService";

const preparePracticeProcedures = async (
    reason: string,
    note?: string,
): Promise<PracticeProcedureV1[]> => {
    const practiceProcedures: PracticeProcedureV1[] = [];

    if (reason === "Teeth Cleaning") {
        const procedures = await new Parse.Query(PracticeProcedureV1)
            .equalTo("aliasCode", "D1110.1")
            .find();
        procedures.length && practiceProcedures.push(procedures[0]);
    } else {
        const procedures = await new Parse.Query(PracticeProcedureV1)
            .equalTo("adaCode", "D0140")
            .equalTo("active", true)
            .doesNotExist("aliasCode")
            .find();
        procedures.length && practiceProcedures.push(procedures[0]);
    }

    // Check if `note` contains 'SUMMER22'. If yes, add 
    // NPR practice procedure
    if (note && note.toLowerCase().includes("summer22")) {
        const procedures = await new Parse.Query(PracticeProcedureV1)
            .equalTo("adaCode", "NPR")
            .find();
        procedures.length && practiceProcedures.push(procedures[0]);
    }

    return practiceProcedures;
}

/**
 * Cloud function to create a new patient appointment.
 */
Parse.Cloud.define("bookingAppointmentCreate", async (request) => {
    const patient = await new Parse.Query(PatientV1)
        .get(request.params.patientId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `patientId` is invalid."
            );
        });

    const location = await new Parse.Query(LocationV1)
        .get(request.params.locationId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `locationId` is invalid."
            );
        });

    const date = moment.tz(request.params.date, location.get("timeZone"));
    if (!date.isValid()) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. The provided `date` is invalid."
        );
    }

    if (!/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(request.params.start)) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. The `start` must be a valid time string."
        );
    }

    const startDateTimeLocal = moment.tz(`${request.params.date} ${request.params.start}`, location.get("timeZone"));
    if (!startDateTimeLocal.isValid()) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. The provided `start` is invalid."
        );
    } else if (startDateTimeLocal.isBefore(moment.tz(location.get("timeZone")))) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. The `date` and `start` cannot correspond to that in the past."
        );
    }

    const note = request.params.note
        ? (request.params.note as string)
            .replaceAll(/[\s\t\n]+/g, " ")
            .trim()
        : undefined;

    const generatedBy = request.params.generatedBy;

    // @ts-ignore:  hasCompletedAppointment  does not exist on 
    // IPatientV1, but present in schema.
    const isPatientNew = !(patient.get("hasCompletedAppointment") || false)

    // @ts-ignore
    const isRemoteLocation = location.get("isRemote") ?? false;

    if (isPatientNew) {
        const doesPatientHavePendingAppointments = (
            await new Parse.Query(AppointmentV1)
                // @ts-ignore
                .equalTo("patient", patient)
                .containedIn("status", ["UNCONFIRMED"])
                .count()
        ) > 0;

        if (doesPatientHavePendingAppointments) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Being a new patient, you cannot book an appointment while you already have one pending. Please cancel the existing appointment and try again."
            );
        }

        // @ts-ignore
        const isLocationWelcomeCenter = location.id === location.get("welcomeCenterLocation").id
        if (!isLocationWelcomeCenter) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "You must book your first appointment at a welcome center."
            );
        }

        if (isRemoteLocation) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                `You are not allowed to book an appointment at ${location.get("name")} for being a new patient.`
            );
        }
    } else {
        const isBerkeleyCenter = location.get("name").toLowerCase().includes("berkeley");
        if (isBerkeleyCenter) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                `You cannot book an appointment at this center.`
            );
        }
    }

    // TODO: add card existence validation once square card data is ready
    // if (patient.cards.count == - 0) {
    //     throw new Parse.Error(
    //         Parse.Error.VALIDATION_ERROR,
    //         `You don't have a card saved on file yet. Please save a card and try again.`
    //     );
    // }

    const reason = (isPatientNew || isRemoteLocation) ? "Other" : "Teeth Cleaning";

    const slotService = new AvailableSlotService()
    const slotsByDate = await slotService.retrieveByDateTimeRange(
        location,
        reason,
        startDateTimeLocal,
        startDateTimeLocal.clone().endOf("day"),
        false,
        true,
    );
    const startDateStrig = startDateTimeLocal.format("YYYY-MM-DD");
    const startTimeString = startDateTimeLocal.format("HH:mm");
    const slot = slotsByDate[startDateStrig].find((s) => s.get("start") === startTimeString);
    if (!slot) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "This slot does not exist or no longer available to book."
        );
    }

    const slotStartDateTimeLocal = moment.tz(`${request.params.date} ${slot.get("start")}`, location.get("timeZone"));
    const slotEndDateTimeLocal = moment.tz(`${request.params.date} ${slot.get("end")}`, location.get("timeZone"));
    const durationInMinutes = Math.abs(slotStartDateTimeLocal.diff(slotEndDateTimeLocal, "minute"));

    // @ts-ignore: use of `providers_ascend` is considered an error for some reason
    // TODO: check. Cannot use slot.relation("providers").query() 
    // using which throws "You need to call Parse.initialize before using Parse."
    const providers = (slot.get("providers_ascend") as any[]).map((p) => {
        const provider = new ProviderV1(null);
        provider.id = p.id;
        return provider;
    });

    const now = moment.tz("UTC");

    const attributes: { [key: string]: any } = {
        duration: durationInMinutes,
        lastModified: now.toDate(),
        lastModified_ascend: now.toISOString(),
        patientProcedures_ascend: <AscendReference[]>[],
        practiceProcedures_ascend: <AscendReference[]>[],
        visits_ascend: <AscendReference[]>[],
        title: "Appointment",
        start: slotStartDateTimeLocal.tz("UTC").toDate(),
        start_ascend: slotStartDateTimeLocal.tz("UTC").toISOString(),
        created: now.toDate(),
        created_ascend: now.toISOString(),
        end: slotEndDateTimeLocal.tz("UTC").toDate(),
        end_ascend: slotEndDateTimeLocal.tz("UTC").toISOString(),
        needsFollowUp: false,
        needsPremedicate: false,
        status: "UNCONFIRMED",
        note: note,
        other: undefined,
        bookedOnline: true,
        patient: patient.toPointer(),
        patient_ascend: <AscendReference>{
            id: patient.id,
            type: "PatientV1",
        },
        location: location,
        location_ascend: <AscendReference>{
            id: location.id,
            type: "LocationV1",
        },
        provider: providers[0].toPointer(),
        provider_ascend: <AscendReference>{
            id: providers[0].id,
            type: "ProviderV1",
        },
        ascendSyncCompleted: false,

        // @ts-ignore: slot.get("operatory") is actually a Parse.Object,
        // but IScheduleTemplateV1 enforces the type as Parse.Pointer
        operatory: (slot.get("operatory") as Parse.Object).toPointer(),
        operatory_ascend: <AscendReference>{
            // @ts-ignore: slot.get("operatory") is actually a Parse.Object,
            // but IScheduleTemplateV1 enforces the type as Parse.Pointer
            id: (slot.get("operatory") as Parse.Object).id,
            type: "ProviderV1",
        },

        generatedBy: generatedBy,
        lastUpdatedBy: generatedBy,
        migrationStatus: "COMPLETE",
    };

    // TODO: check. Cannot use new AppointmentV1(attributs)
    // using which throws "You need to call Parse.initialize before using Parse."
    const appointment = new Parse.Object("AppointmentV1", attributes);

    // Add practice procedures
    const practiceProcedures = await preparePracticeProcedures(reason, note);
    const practiceProceduresRelation = appointment.relation("practiceProcedures");
    for (const procedure of practiceProcedures) {
        practiceProceduresRelation.add(procedure);
        (attributes.practiceProcedures_ascend as AscendReference[]).push({
            id: procedure.id,
            type: "PracticeProcedureV1",
        });
    }

    await appointment.save();

    // Send SMS prompting patient to save insurnce info
    const patientInsuranceService = new PatientInsuranceService();
    await patientInsuranceService.sendInsuranceDetailSavingLinkToPatient(patient, request.user)
        .catch(error => console.error(
            "[Error] functions/bookingAppointmentCreate: Failed sending insurance detail saving link SMS: ",
            error));

    // Notify patient about appointment creation via SMS
    const phones = patient.get("phones") || [];
    if (phones.length) {
        const firstName = patient.get("firstName");
        const time = startDateTimeLocal.format("hh:mm A");
        const date = request.params.date;
        const locationName = location.get("name").replace("Total Health Dental Care", "");
        const address = location.get("address1");
        const message = `Hi ${firstName}, thanks for scheduling` +
            `an appointment at Total Health Dental Care.\n` +
            `The following are the appointment details:\n` +
            `Time: ${time}\n` +
            `Date: ${date}\n` +
            `Location: ${locationName}\n` +
            `Address: ${address}`;

        const client = new TwilioClient();
        for (const phone of phones) {
            await client.sendMessageToPhoneNumber(phone.number, message)
                .catch(error => console.error(
                    "[Error] functions/bookingAppointmentCreate: Failed sending appointment creation SMS: ",
                    error));
        }
    }

    // TODO: Log appointment to Google Sheet

    return appointment;
}, {
    fields: {
        patientId: {
            required: true,
            type: String,
        },
        locationId: {
            required: true,
            type: String,
        },
        date: {
            required: true,
            type: String,
        },
        start: {
            required: true,
            type: String,
        },
        note: {
            required: false,
            type: String,
        },
        generatedBy: {
            required: true,
            type: String,
            options: ["mobile", "web", "crm", "ascend"],
        },
    },
    validateMasterKey: true,
    requireUser: false,
});

/**
 * Cloud function to create a new patient appointment.
 */
Parse.Cloud.define("bookingAppointmentCancel", async (request) => {
    const appointment = await new Parse.Query(AppointmentV1)
        .include("location")
        .get(request.params.appointmentId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `appointment` is invalid."
            );
        });

    const cancelReason = request.params.cancelReason;
    if (cancelReason.length < 5) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. `cancelReason` must have at lease 5 characters."
        );
    } else if (cancelReason.length > 255) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. `cancelReason` must have a maximum of 2555 characters."
        );
    }

    const time72HoursAheadFromNow = moment().add("hours", 72);
    const startTime = moment(appointment.get("start"));
    if (time72HoursAheadFromNow.isAfter(startTime)) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "You are not allowed to cancel an appointment prior to 72 hours of the scheduled time."
        );
    }

    const location = appointment.get("location") as LocationV1;
    const cancellationDate = moment.tz(location.get("timeZone"));
    const cacellationNote = `~ ${cancellationDate} ~\nAppointment cancelled.\nReason: ${cancelReason}`;

    let appointmentNote = appointment.get("note");
    appointmentNote = appointmentNote ? `${appointmentNote}\n\n${cacellationNote}` : cacellationNote;

    appointment.set("status", "BROKEN");
    appointment.set("cancelReason", cancelReason);
    appointment.set("note", appointmentNote);
    appointment.set("lastUpdatedBy", request.params.requestedBy);
    await appointment.save();

    return appointment;
}, {
    fields: {
        patientId: {
            required: true,
            type: String,
        },
        appointmentId: {
            required: true,
            type: String,
        },
        cancelReason: {
            required: true,
            type: String,
        },
        requestedBy: {
            required: true,
            type: String,
            options: ["mobile", "web", "crm", "ascend"],
        },
    },
    validateMasterKey: true,
    requireUser: true,
});