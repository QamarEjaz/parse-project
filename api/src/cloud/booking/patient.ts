import { Contact } from "../../../../core/src/models/Contact";
import { PatientV1 } from "../../../../core/src/models/PatientV1";


Parse.Cloud.define('bookingPatientsList', async request => {
    // TODO: add validation to validate for patient user

    const user = request.user!;
    const patientId = user.getUsername();
    const patientsMap: { [key: string]: PatientV1 } = {};

    // Get the patient associated to the user
    const patient = await new Parse.Query(PatientV1).get(patientId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "The patient was not found."
            );
        });

    patientsMap[patient.id] = patient;

    // Get the rekted patients
    const relatedPatients = await patient.relation("relatedPatients").query().find();
    for (const relatedPatient of relatedPatients) {
        if (!patientsMap[relatedPatient.id]) {
            patientsMap[relatedPatient.id] = relatedPatient as unknown as PatientV1;
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
    for (const contact of contacts) {
        if (contact.get("patient")) {
            const relatedPatient = contact.get("patient") as PatientV1;
            if (!patientsMap[relatedPatient.id]) {
                patientsMap[relatedPatient.id] = relatedPatient;
            }
        }
    }

    return Object.values(patientsMap);

}, {
    requireUser: true,
})