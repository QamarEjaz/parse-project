import * as otpGen from "otp-generator"
import { Contact, PatientV1 } from "../../../core/src"
import { PhoneAuthConfig } from "../config/phoneAuthConfig"
import { TwilioClient } from "../services/external/TwilioClient"
import { createNewPatient } from "./triggers/patient"
import { sendEmail } from "./email"

const MASTER_KEY_OPTION = { useMasterKey: true };

Parse.Cloud.define('addNewFamilyMember', async request => {
    const currentUser = request.user;
    let { firstName, lastName, emailAddress, phone, optionalParams } = request.params;

    if (!firstName || !lastName || !optionalParams.primaryGuarantorId || !optionalParams.dateOfBirth || !optionalParams.gender) {
        console.log("ERROR REQUIRED FIELDS MISSING : firstName, lastName, dateOfBirth, gender, primaryGuarantorId");
        throw new Error("ERROR REQUIRED FIELDS MISSING : firstName, lastName, dateOfBirth, gender, primaryGuarantorId");
    }

    if (!emailAddress) {
        optionalParams.primaryContactId = optionalParams.primaryGuarantorId
    }

    return await createNewPatient(firstName, lastName, emailAddress, phone, optionalParams);
});

export const getOTPCode = async () => {
    const verificationCode = otpGen.generate(PhoneAuthConfig.verificationCodeLength, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });

    return verificationCode;
}

Parse.Cloud.define('sendPhoneMessage', async request => {
    const { phone, message } = request.params;
    const client = new TwilioClient();
    await client.sendMessageToPhoneNumber(phone, message)
        .catch(error => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Failied sending an SMS to the phone number."
            );
        });
}, {
    fields: {
        phone: {
            required: true,
            type: String,
        },
        message: {
            required: true,
            type: String,
        }
    }
})

Parse.Cloud.define('newBookingUser', async request => {
    const { email, phone, firstName, lastName, reason, isNewPatient, gender, dateOfBirth, address1, city, state, postalCode } = request.params;

    const isTestPhoneNumber = PhoneAuthConfig.testPhoneNumbers.includes(phone);
    const verificationCode = isTestPhoneNumber
        ? PhoneAuthConfig.testOtp
        : await getOTPCode();

    const message = `Your Total Health Dental Care app verification code is 
    ${verificationCode}. This code will be valid for ${PhoneAuthConfig.verificatioCodeValiDuration} minutes.`

    const orQueries: Parse.Query<Parse.Object<Parse.Attributes>>[] = [];
    if (phone) {
        orQueries.push(new Parse.Query("Contact").equalTo("phone", phone).equalTo("isOwner", true));
    }
    if (email) {
        orQueries.push(new Parse.Query("Contact").equalTo("email", email).equalTo("isOwner", true));
    }

    const mainQuery = Parse.Query.or(...orQueries)
        .include(["patient", "patient.user"]);
    const results = await mainQuery.include("patient").find();

    console.log("\n<<<<<results", results, "\n");

    if (results.length !== 0) {
        // TODO : this problem needs to be handled somehow where we get multiple patients matching query constraints 
        let patient = results[0].get('patient');
        const primaryContact = patient.get('primaryContact');

        if (primaryContact && primaryContact.id !== patient.id) {
            patient = patient.get('primaryContact');
        }

        if (!!patient.get('user')) {
            console.log("EXISTING USER")
            // EXISTING USER
            if (!isTestPhoneNumber) {
                const user = patient.get('user');
                user.set('password', verificationCode);
                await user.save(null, MASTER_KEY_OPTION)

                await sendOTP(phone, email, message);
            }

            return patient.id;

        } else {
            console.log("CONTACT EXISTS BUT LOGIN USER DOES NOT, CREATE NEW USER FIRST AND CONNECT")
            const user = new Parse.User();
            user.set("username", patient.id);
            user.set("password", verificationCode);
            user.set("isProvider", false);
            user.set("generatedBy", "web");
            user.set("lastUpdatedBy", "web");
            user.set("migrationStatus", "COMPLETE");
            try {
                await user.signUp();
                patient.set('user', user);
                await patient.save()

                if (!isTestPhoneNumber) {
                    await sendOTP(phone, email, message);
                }

                return patient.id;
            } catch (error) {
                console.log("Error: " + error.code + " " + error.message);
                return error;
            }
        }
    } else {
        console.log("BRAND NEW PATIENT USER NEEDS TO BE CREATED")
        if (!phone || !email || !firstName || !lastName) {
            console.log("ERROR REQUIRED FIELDS MISSING : email, phone, firstName, lastName");
            throw new Error("email or phone doesn't exist please try creating a new patient");
        }

        const brandNewPatient = await createNewPatient(firstName, lastName, email, phone, {
            dateOfBirth: dateOfBirth,
            gender: gender,
            address1: address1,
            city: city,
            state: state,
            postalCode: postalCode
        });

        const user = new Parse.User();

        user.set("username", brandNewPatient.id);
        user.set("phone", phone);
        user.set("phone1", phone);
        user.set("email", email);
        user.set("password", verificationCode);
        user.set("isProvider", false);
        user.set("generatedBy", "web");
        user.set("lastUpdatedBy", "web");
        user.set("migrationStatus", "COMPLETE");

        try {
            await user.signUp();

            brandNewPatient.set("user", user);
            await brandNewPatient.save();

            if (!isTestPhoneNumber) {
                await sendOTP(phone, email, message);
            }

            return brandNewPatient.id;
        } catch (error) {
            console.log("Error: " + error.code + " " + error.message);
            return error;
        }
    }
});

const sendOTP = async (phone: string, emailAddress: string, message: string) => {
    if (!!phone) {
        const client = new TwilioClient();
        await client.sendMessageToPhoneNumber(phone, message)
            .catch(error => {
                throw new Parse.Error(
                    Parse.Error.VALIDATION_ERROR,
                    "Failied sending an SMS with OTP."
                );
            });
    }

    await sendEmail([emailAddress], 'OTP - Total Health Dental Care ', message)
        .catch(error => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Failied sending an email with OTP."
            );
        });;
}