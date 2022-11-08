import { ImportTrack } from "./ImportTrack";
import { PatientV1, PatientV1Schema } from "./PatientV1";

export class Insurance extends Parse.Object {
    static className = 'Insurance';

    constructor() {
        super(Insurance.className);
    }

    get createdAt(): Date {
        return this.get("createdAt");
    }

    set createdAt(value: Date) {
        this.set("createdAt", value);
    }

    get updatedAt(): Date {
        return this.get("updatedAt");
    }

    set updatedAt(value: Date) {
        this.set("updatedAt", value);
    }

    get patient(): PatientV1 {
        return this.get("patient");
    }

    set patient(value: PatientV1) {
        this.set("patient", value);
    }

    get membershipId(): string | undefined {
        return this.get("membershipId");
    }

    set membershipId(value: string | undefined) {
        this.set("membershipId", value);
    }

    get insuranceProvider(): string {
        return this.get("insuranceProvider");
    }

    set insuranceProvider(value: string) {
        this.set("insuranceProvider", value);
    }

    get state(): string | undefined {
        return this.get("state");
    }

    set state(value: string | undefined) {
        this.set("state", value);
    }

    get dateOfBirth(): Date {
        return this.get("dateOfBirth");
    }

    set dateOfBirth(value: Date) {
        this.set("dateOfBirth", value);
    }

    get subscriberName(): string {
        return this.get("subscriberName");
    }

    set subscriberName(value: string) {
        this.set("subscriberName", value);
    }

    get subscriberSsn(): string {
        return this.get("subscriberSsn");
    }

    set subscriberSsn(value: string) {
        this.set("subscriberSsn", value);
    }

    get subscriberId(): string | undefined {
        return this.get("subscriberId");
    }

    set subscriberId(value: string | undefined) {
        this.set("subscriberId", value);
    }

    get importTrack(): ImportTrack | undefined {
        return this.get("importTrack");
    }

    set importTrack(value: ImportTrack | undefined) {
        this.set("importTrack", value);
    }
}

// Register class
Parse.Object.registerSubclass(
    Insurance.className,
    Insurance
);

// Schema definition
export const InsuranceSchema = new Parse.Schema(Insurance.className)
    // @ts-ignore: `className` actually exists, but the type definition
    // doesn't have it.
    .addPointer("patient", PatientV1Schema.className, { required: true })
    .addString("membershipId")
    .addString("insuranceProvider", { required: true })
    .addString("state")
    .addDate("dateOfBirth")
    .addString("subscriberName", { required: true })
    .addString("subscriberSsn", { required: true })
    .addString("subscriberId")
    .addPointer("importTrack", ImportTrack.className);