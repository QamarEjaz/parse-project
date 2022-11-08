export class TwilioConfig {
    static validate() {
        if (!(
            process.env.TWILIO_ACCOUNT_SID &&
            process.env.TWILIO_AUTH_TOKEN &&
            process.env.TWILIO_PHONE_NUMBER
        )) {
            throw new Error(
                "Missing any of the following ENV variables: "
                + "'TWILIO_ACCOUNT_SID', "
                + "'TWILIO_AUTH_TOKEN', "
                + "'TWILIO_PHONE_NUMBER'."
            );
        }
    }

    static get accountSid(): string {
        TwilioConfig.validate();
        return process.env.TWILIO_ACCOUNT_SID;
    }

    static get authToken(): string {
        TwilioConfig.validate();
        return process.env.TWILIO_AUTH_TOKEN;
    }

    static get phoneNumber(): string {
        TwilioConfig.validate();
        return process.env.TWILIO_PHONE_NUMBER;
    }
}