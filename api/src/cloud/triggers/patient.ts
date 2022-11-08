import { IPatientV1, PatientV1, Phone } from "../../../../core/src";
import { AscendClient } from "../../services/external/AscendClient";
import {checkAutomations} from "../checkAutomation";

const MASTER_KEY_OPTION = { useMasterKey: true }

Parse.Cloud.afterSave("PatientV1", async (request) => {
    const { object } = request;

    try {
        const patient = await object.fetch();
        const client = new AscendClient();
        const obj = new PatientV1({} as IPatientV1)

        if (!object.existed()) {
            try {
                await createContactInfo(patient);
            } catch (error) {
                console.log(`\n\n ERROR TRYING TO CREATE CONTACT ENTRY FOR PATIENT \n`)
                console.log(patient)
                console.log(error)
            }
            if (object.get("ascendSyncCompleted") === false) {
                try {
                    await obj.createInAscend(patient, client);
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            try {
                if (object.get("ascendSyncCompleted") === false) {
                    obj.createInAscend(object, client);
                } else {
                    obj.updateInAscend(object, client);
                }
                updatePatientContactAndUser(object);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(`\n\nERROR OCCURED WHILE RUNNING PatientV1 afterSave ....\n`)
        console.log(object);
        console.log(error);
    }

    checkAutomations('PatientV1',object);

});

export const updatePatientContactAndUser = async (patient: any) => {
    try {
        const isOwner = isPatientOwner(patient);
        const phones = patient.get('phones') || [];
        const phonesDict: any = {};

        for (var x = 0; x < phones?.length; x++) {
            const phone = phones[x];
            phonesDict[phone["number"]] = phone;
        }

        const emailAddress = patient.get("emailAddress");

        const Contact = Parse.Object.extend("Contact");
        const contactsQuery = new Parse.Query(Contact);
        contactsQuery.equalTo("patient", patient);
        const contacts = await contactsQuery.find(MASTER_KEY_OPTION);

        if (contacts.length !== 0) {
            // update the email address, phone numbers and the _User object email and phone/phone1 entries 

            for (var x = 0; x < contacts.length; x++) {
                const contact = contacts[x];
                const phone = phonesDict[contact.get("phone")];
                if (!!phone) {
                    // phone number already exists update the email address in case its different 
                    contact.set("sequence", phone.sequence);
                    contact.set("phoneType", phone.phoneType);
                    contact.set("email", emailAddress);
                    contact.set("isOwner", isOwner);
                    await contact.save(null, MASTER_KEY_OPTION);
                    delete phonesDict[contact.get("phone")];
                } else {
                    try {
                        await contact?.destroy();
                    } catch (error) {
                        console.log(`\n\nERROR WHILE DESTROYING CONTACT ENTRY :\n`)
                        console.log(contact);
                        console.log(error);
                    }
                }
            }

            for (var phoneNumber in phonesDict) {
                const phone = phonesDict[phoneNumber];

                const newContact = new Contact();

                newContact.set("phone", phoneNumber);
                newContact.set("sequence", phone.sequence);
                newContact.set("phoneType", phone.phoneType);
                newContact.set("email", emailAddress);
                newContact.set("isOwner", isOwner);
                newContact.set("patient", patient);

                await newContact.save()
            }

            const _User = Parse.Object.extend("_User");
            const userQuery = new Parse.Query(_User);
            userQuery.equalTo("username", patient.id);
            const user = await userQuery.find(MASTER_KEY_OPTION);

            if (user.length !== 0) {
                console.log(`_User object found for patient : ${patient.id}`, user[0]);

                try {
                    user[0].set("email", emailAddress)
                    await user[0].save(null, MASTER_KEY_OPTION);
                } catch (error) {
                    console.log(`\n\nERROR WHILE TRYING TO UPDATE PATIENT's _User email :`);
                    console.log(error)
                    console.log(`\n\n`);
                }
            } else {
                console.log(`NO user object found for patient : ${patient.id}`, user);
            }
        } else {
            await createContactInfo(patient);
        }
    } catch (error) {
        console.log(`\n\nERROR OCCURED WHILE RUNNING updatePatientContactAndUser\n`)
        console.log(patient);
        console.log(error);
    }
}

export const createNewPatient = async (
    firstName: string,
    lastName: string,
    emailAddress: string,
    phone: string | undefined,
    optionalParams: any = {}
) => {
    const { dateOfBirth, gender, contactMethod, languageType, patientStatus, preferredLocation, address1, city, state, postalCode, ssn, primaryGuarantorId, primaryContactId, isOwner, generatedBy, lastUpdatedBy } = optionalParams;

    if (!firstName || !lastName) {
        console.log("ERROR REQUIRED FIELDS MISSING : firstName, lastName");
        throw new Error("ERROR REQUIRED FIELDS MISSING : firstName, lastName");
    }

    try {
        const PatientObject = Parse.Object.extend("PatientV1");
        const patient = new PatientObject();

        patient.set("firstName", firstName);
        patient.set("lastName", lastName);
        patient.set("dateOfBirth", dateOfBirth);
        patient.set("gender", gender);
        patient.set("emailAddress", emailAddress);

        const phones: Phone[] = [];
        if (phone) {
            phones.push({
                id: undefined,
                "type": "Phone",
                "number": phone,
                "sequence": 1,
                "phoneType": "MOBILE"
            });
        }
        patient.set("phones", phones);

        // defaults
        patient.set("contactMethod", contactMethod || "CALL ME")
        patient.set("languageType", languageType || "ENGLISH")
        patient.set("patientStatus", patientStatus || "NEW")
        patient.set("address1", address1 || "123 THDC Way")
        patient.set("preferredLocation", preferredLocation)
        patient.set("city", city || "New York")
        patient.set("state", state || "NY")
        patient.set("ssn", ssn || "NOT PROVIDED")
        patient.set("postalCode", postalCode || "10018")

        patient.set("generatedBy", generatedBy || "web");
        patient.set("lastUpdatedBy", lastUpdatedBy || "web");
        patient.set("ascendSyncCompleted", false);
        patient.set("hasCompletedAppointment", false);

        try {
            if (!!primaryGuarantorId) {
                console.log("seting primaryGuarantor", primaryGuarantorId)
                let patientQuery = new Parse.Query("PatientV1");
                let primaryGuarantor = await patientQuery.get(primaryGuarantorId, MASTER_KEY_OPTION);

                patient.set("primaryGuarantor", primaryGuarantor);
                patient.set("primaryGuarantor_ascend", {
                    id: primaryGuarantor.id
                });

                patient.set("preferredLocation", primaryGuarantor.get("preferredLocation"))
                patient.set("preferredLocation_ascend", {
                    id: primaryGuarantor?.get("preferredLocation")?.id
                })
            }

            else {
                console.log("setting primaryGuarantor same as the patient")
                // patient.set("primaryGuarantor", patient);
            }

            if (!!primaryContactId) {
                console.log("seting primaryContactId", primaryContactId)
                let patientQuery = new Parse.Query("PatientV1");
                let primaryContact = await patientQuery.get(primaryContactId, MASTER_KEY_OPTION);

                patient.set("primaryContact", primaryContact);
                patient.set("primaryContact_ascend", {
                    id: primaryContact.id
                });

            } else {
                console.log("setting primaryContactId same as the patient")
            }

            await patient.save(null, MASTER_KEY_OPTION);
            
            if (!!primaryGuarantorId) {
                let patientQuery = new Parse.Query("PatientV1");
                let primaryGuarantor = await patientQuery.get(primaryGuarantorId, MASTER_KEY_OPTION);
                var relatedPatientsRelation = primaryGuarantor.get('relatedPatients');
                relatedPatientsRelation.add(patient);
                await primaryGuarantor.save(null, MASTER_KEY_OPTION);
            }

            if (!!primaryContactId) {
                let patientQuery = new Parse.Query("PatientV1");
                let primaryContact = await patientQuery.get(primaryContactId, MASTER_KEY_OPTION);
                var relatedPatientsRelation = primaryContact.get('relatedPatients');
                relatedPatientsRelation.add(patient);
                await primaryContact.save(null, MASTER_KEY_OPTION);
            }

            return patient
        } catch (error) {
            console.log(error);
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Failied adding Primary Guarantor or Primary Contact ."
             );
        }
    } catch (error) {
        console.log(error);
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "Failied Creating Patient."
         );
    }
};

export const isPatientOwner = (patient: any) => {
    try {
        const generatedBy = patient.get('generatedBy');
        const primaryGuarantor = patient.get('primaryGuarantor');
        const primaryGuarantor_ascend = patient.get('primaryGuarantor_ascend');
        return (patient?.get('ascend_id') === primaryGuarantor?.id || patient?.get('ascend_id') === primaryGuarantor_ascend?.id);
    } catch (error) {
        console.log(`\n\nERROR OCCURED WHILE RUNNING isPatientOwner\n`)
        console.log(patient);
        console.log(error);
        return true;
    }
}

export const createContactInfo = async (patient: any) => {

    try {
        const obj = new PatientV1({} as IPatientV1)

        const ascend_id = patient.get('ascend_id');
        const phones = patient.get('phones');
        const emailAddress = patient.get('emailAddress');

        const contacts: any = []

        if (phones) {
            await phones.forEach(async (phone: any) => {
                const Contact = Parse.Object.extend("Contact");
                const contact = new Contact();
                contact.set("patient", patient);
                contact.set("email", emailAddress);
                contact.set("phone", phone.number);
                contact.set("sequence", phone.sequence);
                contact.set("phoneType", "MOBILE");
                contact.set("isOwner", isPatientOwner(patient))
                await contact.save(null, MASTER_KEY_OPTION);
                if (!!ascend_id) {
                    // need to update patient relational column value to the correct id here
                    obj.sendUpdateColumnRequest("Contact", contact.id, "patient", ascend_id);
                }
                contacts.push(contact);
            });
        } else {
            const Contact = Parse.Object.extend("Contact");
            const contact = new Contact();
            contact.set("patient", patient);
            contact.set("email", emailAddress);
            await contact.save(null, MASTER_KEY_OPTION);
            if (!!ascend_id) {
                // need to update patient relational column value to the correct id here
                obj.sendUpdateColumnRequest("Contact", contact.id, "patient", ascend_id);
            }
            contacts.push(contact);
        }

        return contacts;
    } catch (error) {
        console.log(`\n\nERROR OCCURED WHILE RUNNING createContactInfo\n`)
        console.log(patient);
        console.log(error);
        return true;
    }
}