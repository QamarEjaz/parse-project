import { PatientV1 } from "../../../../core/src/models/PatientV1";
import { PatientNoteV1 } from "../../../../core/src/models/PatientNoteV1";
import { Insurance } from "../../../../core/src/models/Insurance";
import moment from "moment-timezone";

Parse.Cloud.define("bookingPatientInsuranceCreate", async (request) => {
    return bookingPatientInsuranceCreate(request);
}, {
  fields: {
    patientId: {
      required: true,
      type: String,
    },
    insuranceProvider: {
      required: true,
      type: String,
    },
    state: {
      type: String,
    },
    dateOfBirth: {
      required: true,
      type: String,
    },
    subscriberName: {
      required: true,
      type: String,
    },
    subscriberSsn: {
      required: true,
      type: String,
    },
    subscriberId: {
      type: String,
    },
    membershipId: {
      type: String,
    },
    generatedBy: {
      required: true,
      type: String,
      options: ["mobile", "web", "crm", "ascend"],
    },
  },
  validateMasterKey: true,
  requireUser: true,
});

export const bookingPatientInsuranceCreate = async (request: any) => {
  const patient = await new Parse.Query(PatientV1)
    .get(request.params.patientId, { useMasterKey: true })
    .catch(() => {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        "Validation failed. The provided `patientId` is invalid."
      );
    });

  const dateOfBirth = moment(request.params.dateOfBirth);
  if (!dateOfBirth.isValid()) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "The provided `dateOfBirth` is invalid."
    );
  }

  // Save information as patient notes
  const noteText = `INSURANCE DETAIL
---------------------------------------------------------------------------
Insurance Provider: ${request.params.insuranceProvider}
State: ${request.params.state ?? "--"}
Date of birth: ${dateOfBirth.format("YYYY-MM-DD")}
Subscriber name: ${request.params.subscriberName}
Subscriber SSN: ${request.params.subscriberSsn}
Subscriber ID: ${request.params.subscriberId ?? "--"}
Membership ID: ${request.params.membershipId ?? "--"}`;

  // TODO: handle and check if Patient notes are synced to Ascend via triggers
  const patientNote = new PatientNoteV1({
    ascend_id: undefined,
    patient: patient,
    text: noteText,
    noteDate: moment().format("YYYY-MM-DD"),
    lastModified: moment().toISOString(),
    migrationStatus: "COMPLETE",
    generatedBy: request.params.generatedBy,
    lastUpdatedBy: request.params.generatedBy,
  });
  await patientNote.save();

  const insurance = new Insurance();
  insurance.patient = patient;
  insurance.membershipId = request.params.membershipId;
  insurance.insuranceProvider = request.params.insuranceProvider;
  insurance.state = request.params.state;
  insurance.dateOfBirth = dateOfBirth.toDate();
  insurance.subscriberName = request.params.subscriberName;
  insurance.subscriberSsn = request.params.subscriberSsn;
  insurance.subscriberId = request.params.subscriberId;
  await insurance.save();

  // TODO: Log insurance detail to Google sheet

  return insurance;
};

Parse.Cloud.define(
  "bookingPatientInsuranceList",
  async (request) => {
    const patient = await new Parse.Query(PatientV1)
      .get(request.params.patientId, { useMasterKey: true })
      .catch(() => {
        throw new Parse.Error(
          Parse.Error.VALIDATION_ERROR,
          "Validation failed. The provided `patientId` is invalid."
        );
      });

    const insurances = await new Parse.Query(Insurance)
      .equalTo("patient", patient)
      .find({ useMasterKey: true });

    return insurances;
  },
  {
    fields: {
      patientId: {
        required: true,
        type: String,
      },
    },
    validateMasterKey: true,
  }
);
