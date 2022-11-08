import { AppointmentV1 } from "./AppointmentV1";
import { ImportTrack } from "./ImportTrack";
import { LocationV1 } from "./LocationV1";
import { PatientV1 } from "./PatientV1";
import { _User } from "./_User";

export enum TreatmentPlanStatus {
  draft = "draft",
  scheduled = "scheduled",
  completed = "completed",
}

export interface Treatment {
  title: string;
  description: string | undefined;
  amount: number;
  insuranceAmount: number | undefined;
}

export class TreatmentPlan extends Parse.Object {
  static className = "TreatmentPlan";

  static fromJSON(json: any, override?: boolean | undefined): TreatmentPlan {
    const object = super.fromJSON(
      {
        className: TreatmentPlan.className,
        ...json,
      },
      override
    ) as unknown as TreatmentPlan;
    return object;
  }

  constructor() {
    super(TreatmentPlan.className);
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

  get patient(): Parse.Pointer | PatientV1 {
    return this.get("patient");
  }

  set patient(value: Parse.Pointer | PatientV1) {
    this.set("patient", value);
  }

  get location(): Parse.Pointer | LocationV1 {
    return this.get("location");
  }

  set location(value: Parse.Pointer | LocationV1) {
    this.set("location", value);
  }

  get appointment(): Parse.Pointer | AppointmentV1 | undefined {
    return this.get("appointment");
  }

  set appointment(value: Parse.Pointer | AppointmentV1 | undefined) {
    this.set("appointment", value);
  }

  get code(): string {
    return this.get("code");
  }

  set code(value: string) {
    this.set("code", value);
  }

  get note(): string | undefined {
    return this.get("note");
  }

  set note(value: string | undefined) {
    this.set("note", value);
  }

  get title(): string | undefined {
    return this.get("title");
  }

  set title(value: string | undefined) {
    this.set("title", value);
  }

  get description(): string | undefined {
    return this.get("description");
  }

  set description(value: string | undefined) {
    this.set("description", value);
  }

  get discountDurationInMinutes(): number {
    return this.get("discountDurationInMinutes");
  }

  set discountDurationInMinutes(value: number) {
    this.set("discountDurationInMinutes", value);
  }

  get discountPercent(): number {
    return this.get("discountPercent");
  }

  set discountPercent(value: number) {
    this.set("discountPercent", value);
  }

  get treatments(): Treatment[] {
    return this.get("treatments");
  }

  set treatments(value: Treatment[]) {
    this.set("treatments", value);
  }

  get totalAmount(): number {
    return this.get("totalAmount");
  }

  set totalAmount(value: number) {
    this.set("totalAmount", value);
  }

  get insuranceAmount(): number {
    return this.get("insuranceAmount");
  }

  set insuranceAmount(value: number) {
    this.set("insuranceAmount", value);
  }

  get payableAmount(): number {
    return this.get("payableAmount");
  }

  set payableAmount(value: number) {
    this.set("payableAmount", value);
  }

  get status(): string {
    return this.get("status");
  }

  set status(value: string) {
    this.set("status", value);
  }

  get importTrack(): ImportTrack | undefined {
      return this.get("importTrack");
  }

  set importTrack(value: ImportTrack | undefined) {
      this.set("importTrack", value);
  }
}

Parse.Object.registerSubclass(
  TreatmentPlan.className,
  TreatmentPlan
);

export const TreatmentPlanSchema = new Parse.Schema(TreatmentPlan.className)
  .addPointer("patient", PatientV1.className, { required: true })
  .addPointer("location", LocationV1.className, { required: true })
  .addPointer("appointment", AppointmentV1.className)
  .addString("code", { required: true })
  .addString("note")
  .addNumber("discountDurationInMinutes", { required: true, defaultValue: 0 })
  .addNumber("discountPercent", { required: true, defaultValue: 0 })
  .addArray("treatments", { required: true, defaultValue: [] })
  .addNumber("totalAmount", { required: true, defaultValue: 0 })
  .addNumber("insuranceAmount", { required: true, defaultValue: 0 })
  .addNumber("payableAmount", { required: true, defaultValue: 0 })
  .addString("status", { required: true })
  .addPointer("importTrack", ImportTrack.className);
  // TODO: add payment
  ;


