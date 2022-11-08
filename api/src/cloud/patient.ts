import moment from "moment";
import { PatientV1 } from "../../../core/src";
import { TwilioClient } from "../services/external/TwilioClient";
import { PatientInsuranceService } from "../services/PatientInsuranceService";
import { bookingPatientCardCreate } from "./booking/patientCard";
import { bookingPatientInsuranceCreate } from "./booking/patientInsurance";

Parse.Cloud.define("sendUpdatePatientInsuranceNotification", async (request) => {
  const patient = await new Parse.Query(PatientV1)
    .get(request.params.patientId, { useMasterKey: true })
    .catch(() => {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        "Validation failed. The provided `patientId` is invalid."
      );
    });

  const patientInsuranceService = new PatientInsuranceService();
  await patientInsuranceService.sendInsuranceDetailSavingLinkToPatient(patient, request.user)
    .catch(error => {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        "Failied sending an SMS with the link to save insurance details."
      );
    });
}, {
  fields: {
    patientId: {
      required: true,
      type: String,
    }
  },
  validateMasterKey: true,
  requireUser: true,
});

Parse.Cloud.define("sendUpdatePatientCreditCardNotification", async (request) => {
  const patient = await new Parse.Query(PatientV1)
    .get(request.params.patientId, { useMasterKey: true })
    .catch(() => {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        "Validation failed. The provided `patientId` is invalid."
      );
    });

  const phones = patient.get("phones") || [];
  if (!phones.length) return;

  const expiryDate = moment().add(120, "minutes");
  patient.set("updateCreditCardExpiry", expiryDate.toDate());
  await patient.save(null, { useMasterKey: true });

  const url = `${process.env.BASE_URL_WEB_BOOKING_APP}/chk-cc?id=${patient.id}`
  const message = `Hi ${patient.get("firstName")} please fill the credit card info using the link ${url}.`;

  const client = new TwilioClient();
  for (const phone of phones) {
    await client.sendMessageToPhoneNumber(phone.number, message)
      .catch(error => {
        throw new Parse.Error(
          Parse.Error.VALIDATION_ERROR,
          "Failied sending an SMS with the link to save card details."
        );
      });
  }

}, {
  fields: {
    patientId: {
      required: true,
      type: String,
    }
  },
  validateMasterKey: true,
  requireUser: false,
});

Parse.Cloud.define("getUpdatePatientInsuranceExpiry", async (request) => {
  const { patientId } = request.params;
  const PatientV1 = Parse.Object.extend("PatientV1");
  const patientQuery = new Parse.Query(PatientV1);
  const patient = await patientQuery.get(patientId, { useMasterKey: true });

  return patient.get("updateInsuranceExpiry");
}, {
  fields: {
    patientId: {
      required: true,
      type: String,
    }
  },
  validateMasterKey: true,
  requireUser: false,
})

Parse.Cloud.define("updatePatientInsurance", async (request) => {
  const { patientId } = request.params;

  console.log(`\n\n`)
  console.log(request.params)
  console.log(`\n\n`)

  const PatientV1 = Parse.Object.extend("PatientV1");
  const patientQuery = new Parse.Query(PatientV1);

  const patient = await patientQuery.get(patientId, { useMasterKey: true });
  request.params['locationId'] = patient.get("preferredLocation").id;

  const now = new Date();
  const expiry = patient.get("updateInsuranceExpiry");

  if (!!expiry && now < expiry) {
    const response = bookingPatientInsuranceCreate(request);
    patient.set("updateInsuranceExpiry", new Date());
    await patient.save(null, { useMasterKey: true });
    return response;
  } else {
    throw new Parse.Error(
      Parse.Error.TIMEOUT,
      "FORM EXPIRED, please call in to have this renewed",
    )
  }
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
  validateMasterKey: false,
  requireUser: false,
});

Parse.Cloud.define("updatePatientCreditCard", async (request) => {
  const { patientId } = request.params;
  const PatientV1 = Parse.Object.extend("PatientV1");
  const patientQuery = new Parse.Query(PatientV1);

  const patient = await patientQuery.get(patientId, { useMasterKey: true });

  const now = new Date();
  const expiry = patient.get("updateCreditCardExpiry");

  if (!!expiry && now < expiry) {

    request.params["cardholderName"] = patient.get("firstName") + " " + patient.get("lastName");

    patient.set("updateCreditCardExpiry", new Date());
    await patient.save(null, { useMasterKey: true });

    return bookingPatientCardCreate(request);
  } else {
    throw new Parse.Error(
      Parse.Error.TIMEOUT,
      "FORM EXPIRED, please call in to have this renewed",
    )
  }
}, {
  fields: {
    patientId: {
      required: true,
      type: String,
    },
    nonce: {
      required: true,
      type: String,
    },
    billingAddress: {
      type: Object,
    },
    bin: {
      type: String,
    },
    cardBrand: {
      type: String,
      options: [
        "OTHER_BRAND",
        "VISA",
        "MASTERCARD",
        "AMERICAN_EXPRESS",
        "DISCOVER",
        "DISCOVER_DINERS",
        "JCB",
        "CHINA_UNIONPAY",
        "SQUARE_GIFT_CARD",
        "SQUARE_CAPITAL_CARD",
        "INTERAC",
        "EFTPOS",
        "FELICA",
        "EBT",
      ],
    },
    cardType: {
      type: String,
      options: [
        "UNKNOWN_CARD_TYPE",
        "CREDIT",
        "DEBIT",
      ],
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    expMonth: {
      required: true,
      type: Number,
      options: (value: number) => value >= 1 && value <= 12
    },
    expYear: {
      required: true,
      type: Number,
    },
    fingerprint: {
      type: String,
    },
    last4: {
      required: true,
      type: String,
    },
    merchantId: {
      type: String,
    },
    prepaidType: {
      type: String,
      options: [
        'UNKNOWN_PREPAID_TYPE',
        'NOT_PREPAID',
        'PREPAID',
      ],
    },
    referenceId: {
      type: String,
    },
    version: {
      type: Number,
    },
  },
  validateMasterKey: false,
  requireUser: false
});

Parse.Cloud.define("updatePatientPreferredLocation", async (request) => {
  const { patientId, locationId } = request.params;
  const LocationV1 = Parse.Object.extend("LocationV1");
  const locationQuery = new Parse.Query(LocationV1);
  const locationResult = await locationQuery.get(locationId, { useMasterKey: true });

  const PatientV1 = Parse.Object.extend("PatientV1");
  const patientQuery = new Parse.Query(PatientV1);
  patientQuery.include("preferredLocation")
  const patientResult = await patientQuery.get(patientId, { useMasterKey: true });

  patientResult.set("preferredLocation", locationResult);
  patientResult.set("preferredLocation_ascend", {
    id: locationId
  });
  patientResult.save(null, { useMasterKey: true });

  return patientResult;
});
