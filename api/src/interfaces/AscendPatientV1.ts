import { AscendData } from "./AscendData";
import { AscendReference } from "./AscendReference";


export interface Phone {
    id: string;
    phoneType: string;
    number: string;
    extension?: string;
    sequence: number;
}

export interface AscendPatientUpdateV1 {
    title?: string;
    firstName?: string;
    middleInitial?: string;
    lastName?: string;
    nameSuffix?: string;
    preferredName?: string;
    gender?: string;
    dateOfBirth?: string;
    contactMethod?: string;
    languageType?: string;
    patientStatus?: string;
    emailAddress?: string;
    chartNumber?: string;
    preferredDays?: any[];
    preferredTimes?: any[];
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    income?: number;
    phones?: Phone[];
    primaryProvider?: AscendReference;
    discountPlan?: AscendReference;
    duplicateOfPatient?: AscendReference;
}

export interface AscendPatientV1 extends AscendData, AscendPatientUpdateV1 {
    firstVisitDate?: string;
    referredByPatient?: AscendReference;
    referredByReferral?: AscendReference;
    primaryGuarantor?: AscendReference;
    secondaryGuarantor?: AscendReference;
    primaryContact?: AscendReference;
    secondaryContact?: AscendReference;
    preferredLocation: AscendReference;
    referredPatients?: AscendReference[];
    lastModified?: string;
}