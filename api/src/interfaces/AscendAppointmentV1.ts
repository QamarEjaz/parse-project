import { AscendData } from "./AscendData";
import { AscendReference } from "./AscendReference";

export interface AscendAppointmentUpdateV1 {
    confirmed?: string;
    needsFollowUp?: boolean;
    followedUpOn?: string;
    bookingType?: string;
    needsPremedicate?: boolean;
    note?: string;
    other?: string;
    bookedOnline?: boolean;
    leftMessage?: string;
    duration?: number;
    lastModified?: string;
    labCaseDentalLab?: AscendReference;
    labCaseStatus?: string;
    labCaseDueDate?: string;
    labCaseNote?: string;
    patientProcedures?: AscendReference[];
    practiceProcedures?: AscendReference[];
    visits?: AscendReference[];
    location?: AscendReference;
}

export interface AscendAppointmentV1 extends AscendData, AscendAppointmentUpdateV1 {
    title?: string;
    start: string;
    end?: string;
    created?: string;
    duration?: number;
    status: string;
    lastModified?: string;
    labCaseDentalLab?: AscendReference;
    labCaseStatus?: string;
    labCaseDueDate?: string;
    labCaseNote?: string;
    provider: AscendReference;
    otherProvider?: AscendReference;
    patient: AscendReference;
    operatory: AscendReference;

}