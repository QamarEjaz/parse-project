import { AppointmentV1, LocationV1, PatientV1 } from "../../../core/src";
import { Treatment, TreatmentPlan, TreatmentPlanStatus } from "../../../core/src/models/TreatmentPlan";
import ShortUniqueId from 'short-unique-id';

Parse.Cloud.define("treatmentPlanCreate", async (request) => {
    const patient = await new Parse.Query(PatientV1)
        .get(request.params.patientId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `patientId` is invalid."
            );
        });

    const appointment: AppointmentV1 | undefined = request.params.appointmentId
        ? await new Parse.Query(AppointmentV1)
            .include("location")
            .get(request.params.appointmentId)
            .catch(() => {
                throw new Parse.Error(
                    Parse.Error.VALIDATION_ERROR,
                    "Validation failed. The provided `patientId` is invalid."
                );
            })
        : undefined;

    if (appointment) {
        // Check if the appointment is of the patient
        const appointmentPatient = appointment.get("patient");
        const appointmentPatientId = appointmentPatient instanceof Parse.Object
            ? appointmentPatient.id
            : appointmentPatient.objectId;
        if (appointmentPatientId !== patient.id) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "The appointment does not belong to the patient."
            );
        }

        // Check if a treatment plan already exists for this appointment
        const treatmentPlan = await new Parse.Query(TreatmentPlan)
            .equalTo("appointment", appointment)
            .first();
        if (treatmentPlan) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "A treatment plan already exists for this appointment."
            );
        }
    }

    // Validate `locationId`. Required if no `appointmentId` is provided
    if (!request.params.appointmentId && !request.params.locationId) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. `locationId` is required when `appointmentId` is not provided."
        );
    }
    const location = appointment
        ? appointment.get("location") as LocationV1
        : await new Parse.Query(LocationV1)
            .get(request.params.locationId)
            .catch(() => {
                throw new Parse.Error(
                    Parse.Error.VALIDATION_ERROR,
                    "Validation failed. The provided `patientId` is invalid."
                );
            });

    let note: string | undefined;
    if (request.params.note) {
        if (typeof request.params.note !== "string") {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `note` must be a string."
            );
        }
        note = request.params.note;
    }

    let discountDurationInMinutes = 0;
    if (request.params.discountDurationInMinutes) {
        if (!Number.isInteger(request.params.discountDurationInMinutes)) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `discountDurationInMinutes` must be an integer."
            );
        } else if (request.params.discountDurationInMinutes < 0) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `discountDurationInMinutes` must be greater than or equal 0."
            );
        }
        discountDurationInMinutes = Math.floor(request.params.discountDurationInMinutes);
    } else if (request.params.discountPercent) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. `discountDurationInMinutes` is required when `discountPercent` is provided."
        );
    }

    let discountPercent = 0;
    if (request.params.discountPercent) {
        if (typeof request.params.discountPercent !== "number") {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `discountPercent` must be an integer."
            );
        } else if (request.params.discountPercent < 0) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `discountPercent` must be greater than or equal 0."
            );
        }
        discountPercent = Math.floor(request.params.discountPercent);
    } else if (request.params.discountDurationInMinutes) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. `discountPercent` is required when `discountDurationInMinutes` is provided."
        );
    }

    const treatments: Treatment[] = [];
    let totalAmount = 0;
    let insuranceAmount = 0;

    if (request.params.treatments) {
        const treatmentParamItems: any[] = request.params.treatments;
        for (let index = 0; index < treatmentParamItems.length; index++) {
            const treatmentParam = treatmentParamItems[index];

            // Validate title
            if (treatmentParam.title) {
                if (typeof treatmentParam.title !== "string") {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].title\ must be a string.`
                    );
                }
            } else {
                throw new Parse.Error(
                    Parse.Error.VALIDATION_ERROR,
                    `Validation failed. \`treatments[${index}].title\ is required.`
                );
            }

            // Validate description
            if (treatmentParam.description) {
                if (typeof treatmentParam.description !== "string") {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].description\ must be a string.`
                    );
                }
            }

            // Validate amount
            if (treatmentParam.amount) {
                if (!Number.isInteger(treatmentParam.amount)) {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].amount\ must be an integer.`
                    );
                } else if (treatmentParam.amount < 0) {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].amount\ must be greater than 0.`
                    );
                }
            } else {
                throw new Parse.Error(
                    Parse.Error.VALIDATION_ERROR,
                    `Validation failed. \`treatments[${index}].title\ is required.`
                );
            }

            // Validate insurance amount
            if (treatmentParam.insuranceAmount) {
                if (!Number.isInteger(treatmentParam.insuranceAmount)) {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].insuranceAmount\ must be an integer.`
                    );
                } else if (treatmentParam.insuranceAmount < 0) {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].insuranceAmount\ must be greater than 0.`
                    );
                }
            }

            const treatment: Treatment = {
                title: treatmentParam.title,
                description: treatmentParam.description,
                amount: treatmentParam.amount,
                insuranceAmount: treatmentParam.insuranceAmount,
            };
            treatments.push(treatment);

            totalAmount += treatment.amount;
            insuranceAmount += treatment.insuranceAmount;
        }
    }

    let payableAmount = totalAmount - insuranceAmount;
    (payableAmount < 0) && (payableAmount = 0);

    const uid = new ShortUniqueId({
        length: 8,
        dictionary: [
            // Digits
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",

            // Alphabets
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
            "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
            "U", "V", "W", "X", "Y", "Z"
        ]
    });
    const code = uid();

    const treatmentPlan = new TreatmentPlan();
    treatmentPlan.patient = patient;
    treatmentPlan.location = location;
    treatmentPlan.appointment = appointment;
    treatmentPlan.code = code;
    treatmentPlan.note = note;
    treatmentPlan.discountDurationInMinutes = discountDurationInMinutes;
    treatmentPlan.discountPercent = discountPercent;
    treatmentPlan.treatments = treatments;
    treatmentPlan.totalAmount = totalAmount;
    treatmentPlan.insuranceAmount = insuranceAmount;
    treatmentPlan.payableAmount = payableAmount;
    treatmentPlan.status = TreatmentPlanStatus.draft;
    await treatmentPlan.save();

    return treatmentPlan;
}, {
    fields: {
        patientId: {
            required: true,
            type: String,
        },
        appointmentId: {
            type: String,
        },
        locationId: {
            type: String,
        },
        note: {
            type: String,
        },
        discountDurationInMinutes: {
            type: Number,
        },
        discountPercent: {
            type: Number,
        },
        treatments: {
            required: true,
            type: Array,
        }
    },
    validateMasterKey: true,
    requireUser: true,
});

Parse.Cloud.define("treatmentPlanUpdate", async (request) => {
    const treatmentPlan = await new Parse.Query(TreatmentPlan)
        .include(["patient", "appointment", "location"])
        .get(request.params.treatmentPlanId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `treatmentPlanId` is invalid."
            );
        });

    let note: string | undefined;
    if (request.params.note) {
        if (typeof request.params.note !== "string") {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `note` must be a string."
            );
        }
        note = request.params.note;
    }

    let discountDurationInMinutes = 0;
    if (request.params.discountDurationInMinutes) {
        if (!Number.isInteger(request.params.discountDurationInMinutes)) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `discountDurationInMinutes` must be an integer."
            );
        } else if (request.params.discountDurationInMinutes < 0) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `discountDurationInMinutes` must be greater than or equal 0."
            );
        }
        discountDurationInMinutes = Math.floor(request.params.discountDurationInMinutes);
    } else if (request.params.discountPercent) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. `discountDurationInMinutes` is required when `discountPercent` is provided."
        );
    }

    let discountPercent = 0;
    if (request.params.discountPercent) {
        if (typeof request.params.discountPercent !== "number") {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `discountPercent` must be an integer."
            );
        } else if (request.params.discountPercent < 0) {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. `discountPercent` must be greater than or equal 0."
            );
        }
        discountPercent = Math.floor(request.params.discountPercent);
    } else if (request.params.discountDurationInMinutes) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Validation failed. `discountPercent` is required when `discountDurationInMinutes` is provided."
        );
    }

    const treatments: Treatment[] = [];
    let totalAmount = 0;
    let insuranceAmount = 0;

    if (request.params.treatments) {
        const treatmentParamItems: any[] = request.params.treatments;
        for (let index = 0; index < treatmentParamItems.length; index++) {
            const treatmentParam = treatmentParamItems[index];

            // Validate title
            if (treatmentParam.title) {
                if (typeof treatmentParam.title !== "string") {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].title\ must be a string.`
                    );
                }
            } else {
                throw new Parse.Error(
                    Parse.Error.VALIDATION_ERROR,
                    `Validation failed. \`treatments[${index}].title\ is required.`
                );
            }

            // Validate description
            if (treatmentParam.description) {
                if (typeof treatmentParam.description !== "string") {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].description\ must be a string.`
                    );
                }
            }

            // Validate amount
            if (treatmentParam.amount) {
                if (!Number.isInteger(treatmentParam.amount)) {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].amount\ must be an integer.`
                    );
                } else if (treatmentParam.amount < 0) {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].amount\ must be greater than 0.`
                    );
                }
            } else {
                throw new Parse.Error(
                    Parse.Error.VALIDATION_ERROR,
                    `Validation failed. \`treatments[${index}].title\ is required.`
                );
            }

            // Validate insurance amount
            if (treatmentParam.insuranceAmount) {
                if (!Number.isInteger(treatmentParam.insuranceAmount)) {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].insuranceAmount\ must be an integer.`
                    );
                } else if (treatmentParam.insuranceAmount < 0) {
                    throw new Parse.Error(
                        Parse.Error.VALIDATION_ERROR,
                        `Validation failed. \`treatments[${index}].insuranceAmount\ must be greater than 0.`
                    );
                }
            }

            const treatment: Treatment = {
                title: treatmentParam.title,
                description: treatmentParam.description,
                amount: treatmentParam.amount,
                insuranceAmount: treatmentParam.insuranceAmount,
            };
            treatments.push(treatment);

            totalAmount += treatment.amount;
            insuranceAmount += treatment.insuranceAmount;
        }
    }

    let payableAmount = totalAmount - insuranceAmount;
    (payableAmount < 0) && (payableAmount = 0);

    treatmentPlan.note = note;
    treatmentPlan.discountDurationInMinutes = discountDurationInMinutes;
    treatmentPlan.discountPercent = discountPercent;
    treatmentPlan.treatments = treatments;
    treatmentPlan.totalAmount = totalAmount;
    treatmentPlan.insuranceAmount = insuranceAmount;
    treatmentPlan.payableAmount = payableAmount;
    await treatmentPlan.save();

    return treatmentPlan;
}, {
    fields: {
        treatmentPlanId: {
            required: true,
            type: String,
        },
        note: {
            type: String,
        },
        discountDurationInMinutes: {
            type: Number,
        },
        discountPercent: {
            type: Number,
        },
        treatments: {
            required: true,
            type: Array,
        }
    },
    validateMasterKey: true,
    requireUser: true,
});

Parse.Cloud.define("treatmentPlanSwitchToDraft", async (request) => {
    const treatmentPlan = await new Parse.Query(TreatmentPlan)
        .include(["patient", "appointment", "location"])
        .get(request.params.treatmentPlanId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `treatmentPlanId` is invalid."
            );
        });

    if (treatmentPlan.status === TreatmentPlanStatus.completed) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "You cannot switch a treatment plan to 'draft' once it has been 'completed'."
        );
    }

    treatmentPlan.status = TreatmentPlanStatus.draft;
    await treatmentPlan.save();

    return treatmentPlan;
}, {
    fields: {
        treatmentPlanId: {
            required: true,
            type: String,
        },
    },
    validateMasterKey: true,
    requireUser: true,
});

Parse.Cloud.define("treatmentPlanSchedule", async (request) => {
    const treatmentPlan = await new Parse.Query(TreatmentPlan)
        .include(["patient", "appointment", "location"])
        .get(request.params.treatmentPlanId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `treatmentPlanId` is invalid."
            );
        });

    if (treatmentPlan.status === TreatmentPlanStatus.completed) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "You cannot switch a treatment plan to 'scheduled' once it has been 'completed'."
        );
    }

    treatmentPlan.status = TreatmentPlanStatus.scheduled;
    await treatmentPlan.save();

    // TODO: notify patient about new treatment plan

    return treatmentPlan;
}, {
    fields: {
        treatmentPlanId: {
            required: true,
            type: String,
        },
    },
    validateMasterKey: true,
    requireUser: true,
});