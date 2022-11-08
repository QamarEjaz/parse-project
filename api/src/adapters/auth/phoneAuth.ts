import * as otpTool from "otp-without-db"
import { PhoneAuthConfig } from "../../config/phoneAuthConfig"

export interface PhoneAuthData {
    id: string, // the phone number
    verificationCode: string,
    verificationHash: string,
    isVerified?: boolean,
}

export class PhoneAuthAdapter {
    validateAppId() {
        return Promise.resolve({})
    }

    /**
    * @param authData: the client provided authData
    * @param options: additional options
    **/
    async validateAuthData(
        authData: PhoneAuthData,
        options: any
    ) {
        if (!(
            authData.id &&
            authData.verificationCode &&
            authData.verificationHash
        )) {
            throw new Parse.Error(
                Parse.Error.OBJECT_NOT_FOUND,
                "Invalid `authData` provided.",
            )
        }

        const isValid = otpTool.verifyOTP(
            authData.id,
            authData.verificationCode,
            authData.verificationHash,
            PhoneAuthConfig.verificationCodeSecret,
        )

        if (!isValid) {
            throw new Parse.Error(
                Parse.Error.OBJECT_NOT_FOUND,
                "Invalid verification code provided.",
            )
        }
    }
}