
import moment from 'moment-timezone';
import { PatientV1 } from '../../../core/src';
import { TwilioClient } from './external/TwilioClient';

export class PatientInsuranceService {
    async sendInsuranceDetailSavingLinkToPatient(
        patient: PatientV1,
        authuser: Parse.User | undefined = undefined
    ): Promise<any> {
        
        const phones = patient.get("phones") || [];
        if (phones.length === 0) return;

        const expiryDate = moment().add(120, "minutes");
        patient.set("updateInsuranceExpiry", expiryDate.toDate());
        await patient.save(null, { useMasterkey: !authuser });

        const url = `${process.env.BASE_URL_WEB_BOOKING_APP}/chk-ins?id=${patient.id}`
        const message = `Hi ${patient.get("firstName")} please fill the insurance info using this link ${url}`;

        const client = new TwilioClient();
        for (const phone of phones) {
            await client.sendMessageToPhoneNumber(phone.number, message);
        }
    }
}
