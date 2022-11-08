import { PatientV1, PatientV1Schema } from './PatientV1';
import { SquareCustomer } from './SquareCustomer';
import { Card } from "square";
import { ImportTrack } from './ImportTrack';

export class SquareCard extends Parse.Object {
    static className = 'SquareCard';

    static fromJSON(json: any, override?: boolean | undefined): SquareCard {
        const object = super.fromJSON(
            {
                className: SquareCard.className,
                ...json,
            },
            override
        ) as unknown as SquareCard;
        return object;
    }

    constructor() {
        super(SquareCard.className);
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

    get squareCustomer(): SquareCustomer {
        return this.get("squareCustomer");
    }

    set squareCustomer(value: SquareCustomer) {
        this.set("squareCustomer", value);
    }

    get billingAddress(): { [key: string]: any } | undefined {
        return this.get("billingAddress");
    }

    set billingAddress(value: { [key: string]: any } | undefined) {
        this.set("billingAddress", value);
    }

    get fingerprint(): string | undefined {
        return this.get("fingerprint");
    }

    set fingerprint(value: string | undefined) {
        this.set("fingerprint", value);
    }

    get bin(): string | undefined {
        return this.get("bin");
    }

    set bin(value: string | undefined) {
        this.set("bin", value);
    }

    get cardBrand(): string | undefined {
        return this.get("cardBrand");
    }

    set cardBrand(value: string | undefined) {
        this.set("cardBrand", value);
    }

    get cardType(): string | undefined {
        return this.get("cardType");
    }

    set cardType(value: string | undefined) {
        this.set("cardType", value);
    }

    get cardholderName(): string | undefined {
        return this.get("cardholderName");
    }

    set cardholderName(value: string | undefined) {
        this.set("cardholderName", value);
    }

    get enabled(): boolean {
        return this.get("enabled");
    }

    set enabled(value: boolean) {
        this.set("enabled", value);
    }

    get expMonth(): number {
        return this.get("expMonth");
    }

    set expMonth(value: number) {
        this.set("expMonth", value);
    }

    get expYear(): number {
        return this.get("expYear");
    }

    set expYear(value: number) {
        this.set("expYear", value);
    }

    get last4(): string | undefined {
        return this.get("last4");
    }

    set last4(value: string | undefined) {
        this.set("last4", value);
    }

    get merchantId(): string | undefined {
        return this.get("merchantId");
    }

    set merchantId(value: string | undefined) {
        this.set("merchantId", value);
    }

    get prepaidType(): string | undefined {
        return this.get("prepaidType");
    }

    set prepaidType(value: string | undefined) {
        this.set("prepaidType", value);
    }

    get referenceId(): string | undefined {
        return this.get("referenceId");
    }

    set referenceId(value: string | undefined) {
        this.set("referenceId", value);
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

    populateFromSquareData(data: Card) {
        this.id = data.id!;
        this.billingAddress = data.billingAddress;
        this.fingerprint = data.fingerprint;
        this.bin = data.bin;
        this.cardBrand = data.cardBrand;
        this.cardType = data.cardType;
        this.cardholderName = data.cardholderName;
        this.enabled = data.enabled ?? false;
        this.expMonth = Number(data.expMonth);
        this.expYear = Number(data.expYear);
        this.last4 = data.last4;
        this.merchantId = data.merchantId;
        this.prepaidType = data.prepaidType;
        this.referenceId = data.referenceId;
        this.version = data.version
            ? Number(data.version)
            : undefined;
    }
}

// Register class
Parse.Object.registerSubclass(
    SquareCard.className,
    SquareCard
);

// Schema definition
export const SquareCardSchema = new Parse.Schema(SquareCard.className)
    // @ts-ignore: `className` actually exists, but the type definition
    // doesn't have it.
    .addPointer("patient", PatientV1Schema.className)
    .addPointer("squareCustomer", SquareCustomer.className)
    .addObject("billingAddress")
    .addString("fingerprint")
    .addString("bin")
    .addString("cardBrand")
    .addString("cardType")
    .addString("cardholderName")
    .addBoolean("enabled")
    .addNumber("expMonth")
    .addNumber("expYear")
    .addString("last4")
    .addString("merchantId")
    .addString("prepaidType")
    .addString("referenceId")
    .addNumber("version")
    .addString("environment", {required: true, defaultValue: "production"})
    .addPointer("importTrack", ImportTrack.className);