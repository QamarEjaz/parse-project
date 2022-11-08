import { Twilio } from "twilio";
import { TwilioConfig } from "../../config/twilioConfig";

export class TwilioClient {
    private client: Twilio;

    constructor() {
        this.client = new Twilio(
            TwilioConfig.accountSid,
            TwilioConfig.authToken
        );
    }

    async sendMessageToPhoneNumber(
        phoneNumber: string,
        message: string
    ) {
        return this.client.messages.create({
            from: TwilioConfig.phoneNumber,
            to: phoneNumber,
            body: message,
        })
    }
}