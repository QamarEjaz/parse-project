import * as otpGen from "otp-generator"
import * as otpTool from "otp-without-db"
import { Twilio } from "twilio"
import { PhoneAuthData } from "../../adapters/auth/phoneAuth"
import { PhoneAuthConfig } from "../../config/phoneAuthConfig"
import { createNewPatient } from "../triggers/patient";

/**
 * Cloud function to signup new users
 */
Parse.Cloud.define("signup", async (request) => {
  const email = request.params.email;
  const name = request.params.name;
  const password = request.params.password;

  let user = new Parse.User();
  user.set("username", email);
  user.set("name", name);
  user.set("email", email);
  user.set("password", password);
  user.set("generatedBy", "web");
  user.set("lastUpdatedBy", "web");
  try {
    await user.signUp();
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
});

/**
 * Cloud function to send verification to phone number
 * for phone based authentication.
 */
Parse.Cloud.define(
  "sendPhoneVerificationCode",
  async (request) => {
    const phoneNumber = request.params.phoneNumber;
    const isTestPhoneNumber = PhoneAuthConfig.testPhoneNumbers.includes(phoneNumber);
    const verificationCode = isTestPhoneNumber
      ? PhoneAuthConfig.testOtp
      : otpGen.generate(PhoneAuthConfig.verificationCodeLength, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
    const hash = otpTool.createNewOTP(
      phoneNumber,
      verificationCode,
      PhoneAuthConfig.verificationCodeSecret,
      PhoneAuthConfig.verificatioCodeValiDuration
    );

    const accountSid: string = process.env.TWILIO_ACCOUNT_SID || "";
    const authToken: string = process.env.TWILIO_AUTH_TOKEN || "";
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    const twilioClient = new Twilio(accountSid, authToken);

    if (!isTestPhoneNumber) {
      const smsMessage =
        `Your Total Health Dental Care app verification ` +
        `code is ${verificationCode}. This code will be valid for ` +
        `${PhoneAuthConfig.verificatioCodeValiDuration} minutes.`;
      await twilioClient.messages.create({
        from: twilioNumber,
        to: phoneNumber,
        body: smsMessage,
      });
    }

    return hash;
  },
  {
    fields: {
      phoneNumber: {
        required: true,
        type: String,
        options: (val: string) => {
          return val.length == 10;
        },
      },
    },
    // `validateMasterKey` param is required while calling this
    // function with master key. Otherwise, all validations are
    // ignored.
    validateMasterKey: true,
  }
);

/**
 * The goal of this hook is to mutate phoneAuth `authData` to
 * trigger `authData` validation always during login.
 *
 * By default, if the `authData` provided matches exactly with
 * that present in the _Users record of database, the validation
 * of the `authData` is skipped. Hence, logging in with the
 * previously used verification code would work, even if is
 * is expired.
 */
Parse.Cloud.afterSave(Parse.User, async (request) => {
  const authData = request.object.get("authData");
  if (authData && authData.phoneAuth && !authData.phoneAuth.isVerified) {
    const phoneAuthData: PhoneAuthData = authData.phoneAuth;
    phoneAuthData.isVerified = true;

    // Handling edge case.
    // Since User object saving goes through auth validation process,
    // we need to renew verificationHash with the same verification code
    // if the code is close to expiry.
    const expires = parseInt(phoneAuthData.verificationHash.split(".")[1]);
    const now = Date.now();
    const minimumValidityDuration = 2; // in minutes
    if (expires - now <= minimumValidityDuration * 60 * 1000) {
      const hash = otpTool.createNewOTP(
        phoneAuthData.id,
        phoneAuthData.verificationCode,
        PhoneAuthConfig.verificationCodeSecret,
        minimumValidityDuration
      );
      phoneAuthData.verificationHash = hash;
    }

    request.object.set("authData", authData);
    request.object.save(null, { useMasterKey: true });
  }
});

const MASTER_KEY_OPTION = { useMasterKey: true };

// The code below is for creating new patient from crm

Parse.Cloud.define("registerPatient", async (request) => {
  const {
    address1,
    city,
    contactMethod,
    dateOfBirth,
    emailAddress,
    firstName,
    gender,
    generatedBy,
    languageType,
    lastName,
    lastUpdatedBy,
    location,
    patientStatus,
    phone,
    postalCode,
    preferredLocation,
    ssn,
    state
  } = request.params;

  let selectedLocation = undefined;
  if (!!preferredLocation) {
    let preferredLocationQuery = new Parse.Query("LocationV1");
    selectedLocation = await preferredLocationQuery.get(preferredLocation);
  }

  const optionalParams = {
    gender,
    contactMethod,
    languageType,
    patientStatus,
    dateOfBirth,
    postalCode,
    city,
    state,
    address1,
    preferredLocation: selectedLocation,
    location,
    ssn,
    generatedBy,
    lastUpdatedBy
  };
  try {
    const patientResponse = await createNewPatient(
      firstName,
      lastName,
      emailAddress,
      phone,
      optionalParams
    );
    return patientResponse;
  } catch (error) {
    console.log(error);
    return error;
  }
});
