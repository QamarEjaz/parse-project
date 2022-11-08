import { Contact, PatientV1 } from "../../../core/src";

Parse.Cloud.define("relatedPatientsList", async (request) => {
    // TODO: add validation to validate for CRM user

    // Get the patient associated to the user
    const patient = await new Parse.Query(PatientV1).get(request.params.patientId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "The patient was not found."
            );
        });

    const relatedPatientsMap: { [key: string]: PatientV1 } = {};

    // Get the rekted patients
    const relatedPatients = await patient.relation("relatedPatients").query().find();
    for (const relatedPatient of relatedPatients) {
        if (!relatedPatientsMap[relatedPatient.id]) {
            relatedPatientsMap[relatedPatient.id] = relatedPatient as unknown as PatientV1;
        }
    }

    // Get the patients with same email or phone number as the patient 
    // associated with the user.
    const email = patient.get("emailAddress");
    const phonesNumbers = (patient.get("phones") || []).map((v) => v.number);
    const subQueries: Parse.Query<Contact>[] = [];
    if (phonesNumbers.length) {
        const query = new Parse.Query(Contact).containedIn("phone", phonesNumbers);
        subQueries.push(query);
    }
    if (email) {
        const query = new Parse.Query(Contact).equalTo("email", email);
        subQueries.push(query);
    }
    const contacts = await Parse.Query.or(...subQueries)
        .include("patient")
        .find();
    const possiblyRelatedPatients: PatientV1[] = [];
    for (const contact of contacts) {
        if (contact.get("patient")) {
            const possiblyRelatedPatient = contact.get("patient") as PatientV1;
            if (!relatedPatientsMap[possiblyRelatedPatient.id]) {
                possiblyRelatedPatients.push(possiblyRelatedPatient);
            }
        }
    }

    return {
        "relatedPatients": relatedPatients,
        "possiblyRelatedPatient": possiblyRelatedPatients,
    }
}, {
    fields: {
        patientId: {
            required: true,
            type: String,
        },
    },
    requireUser: true,
});