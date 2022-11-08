const sgMail = require('@sendgrid/mail')
import { Client } from 'pg';

sgMail.setApiKey(process.env.EMAIL_API_KEY)

const pgClient = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT),
});

Parse.Cloud.define('getInactivePatient', async (request: any) => {
    const { inactiveDays, limit, orderBy } = request.params;

    console.log(`inactiveDays : ${inactiveDays}, orderBy : ${orderBy}, limit : ${limit}`)
        
    const response = await getInactivePatientIds(inactiveDays, limit, orderBy);

    return response;
});

Parse.Cloud.define('sendEmail', async (request: any) => {
    const { toAddress, subject, bodyText } = request.params;
    return await sendEmail(toAddress, subject, bodyText);
});

export const sendEmail = async (toAddress: string[], subject: string, bodyHtml: string) => {
  const msg = {
    to: toAddress,
    from: process.env.EMAIL_FROM,
    subject: subject,
    html: bodyHtml,
  }
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const getInactivePatientIds = async (inactiveDays: number, limit: number, orderBy: string) => {
    try {
        await pgClient.connect();
    } catch (pgClientError) {
        console.log(pgClientError);
    }

    const now: any = new Date();
    const date: any = new Date(now - ((182 + 365)*24*60*60*1000));

    const inactivePatientIdsQuery = `select * from public."PatientV1" where "objectId" in (
        select distinct "patient"
        from public."AppointmentV1"
        where 
        "start" < '"${date.toISOString()}"'::timestamp with time zone and 
        "patient" is not NULL and
        "patient" not in 
            (select distinct "patient"
            from public."AppointmentV1"
            where "start" > '"${date.toISOString()}"'::timestamp with time zone)
    ) limit ${limit};
    `
    console.log(`running postgres query ${inactivePatientIdsQuery}`)

    const response = await pgClient.query(inactivePatientIdsQuery);

    return response;
}

