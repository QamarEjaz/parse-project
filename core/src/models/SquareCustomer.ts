import { Customer } from "square";
import { ImportTrack } from "./ImportTrack";

export class SquareCustomer extends Parse.Object {
    static className = 'SquareCustomer';

    static fromJSON(json: any, override?: boolean | undefined): SquareCustomer {
        const object = super.fromJSON(
            {
                className: SquareCustomer.className,
                ...json,
            },
            override
        ) as unknown as SquareCustomer;
        return object;
    }

    constructor() {
        super(SquareCustomer.className);
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

    get givenName(): string | undefined {
        return this.get("givenName");
    }

    set givenName(value: string | undefined) {
        this.set("givenName", value);
    }

    get familyName(): string | undefined {
        return this.get("familyName");
    }

    set familyName(value: string | undefined) {
        this.set("familyName", value);
    }

    get emailAddress(): string | undefined {
        return this.get("emailAddress");
    }

    set emailAddress(value: string | undefined) {
        this.set("emailAddress", value);
    }

    get address(): { [key: string]: any } | undefined {
        return this.get("address");
    }

    set address(value: { [key: string]: any } | undefined) {
        this.set("address", value);
    }

    get phoneNumber(): string | undefined {
        return this.get("phoneNumber");
    }

    set phoneNumber(value: string | undefined) {
        this.set("phoneNumber", value);
    }

    get referenceId(): string | undefined {
        return this.get("referenceId");
    }

    set referenceId(value: string | undefined) {
        this.set("referenceId", value);
    }

    get note(): string | undefined {
        return this.get("note");
    }

    set note(value: string | undefined) {
        this.set("note", value);
    }

    get preferences(): { [key: string]: any } | undefined {
        return this.get("preferences");
    }

    set preferences(value: { [key: string]: any } | undefined) {
        this.set("preferences", value);
    }

    get creationSource(): string | undefined {
        return this.get("creationSource");
    }

    set creationSource(value: string | undefined) {
        this.set("creationSource", value);
    }

    get groupIds(): string[] | undefined {
        return this.get("groupIds");
    }

    set groupIds(value: string[] | undefined) {
        this.set("groupIds", value);
    }

    get segmentIds(): { [key: string]: any } | undefined {
        return this.get("segmentIds");
    }

    set segmentIds(value: { [key: string]: any } | undefined) {
        this.set("segmentIds", value);
    }

    get version(): number | undefined {
        return this.get("version");
    }

    set version(value: number | undefined) {
        this.set("version", value);
    }

    get environment(): string {
        return this.get("environment");
    }

    set environment(value: string) {
        this.set("environment", value);
    }

    get importTrack(): ImportTrack | undefined {
        return this.get("importTrack");
    }

    set importTrack(value: ImportTrack | undefined) {
        this.set("importTrack", value);
    }

    populateFromSquareData(data: Customer) {
        this.id = data.id!;
        this.givenName = data.givenName;
        this.familyName = data.familyName;
        this.emailAddress = data.emailAddress;
        this.address = data.address;
        this.phoneNumber = data.phoneNumber;
        this.referenceId = data.referenceId;
        this.note = data.note;
        this.preferences = data.preferences;
        this.creationSource = data.creationSource;
        this.groupIds = data.groupIds;
        this.segmentIds = data.segmentIds;
        this.version = data.version
            ? Number(data.version)
            : undefined;
    }
}

// Register class
Parse.Object.registerSubclass(
    SquareCustomer.className,
    SquareCustomer
);

// Schema definition
export const SquareCustomerSchema = new Parse.Schema(SquareCustomer.className)
    .addString("givenName")
    .addString("familyName")
    .addString("emailAddress")
    .addObject("address")
    .addString("phoneNumber")
    .addString("referenceId")
    .addString("note")
    .addObject("preferences")
    .addString("creationSource")
    .addArray("groupIds")
    .addArray("segmentIds")
    .addNumber("version")
    .addString("environment", {required: true, defaultValue: "production"})
    .addPointer("importTrack", ImportTrack.className);