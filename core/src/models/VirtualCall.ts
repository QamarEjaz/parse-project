import { AppointmentV1 } from "./AppointmentV1";
import { PatientV1 } from "./PatientV1";
import { _User } from "./_User";

export enum VirtualCallStatus {
  waiting = "waiting",
  active = "active",
  ended = "ended",
}

export enum VirtualCallPatientStatus {
  waiting = "waiting",
  joined = "joined",
  kicked = "kicked",
  left = "left",
}

export class VirtualCall extends Parse.Object {
  static className = "VirtualCall";

  static fromJSON(json: any, override?: boolean | undefined): VirtualCall {
    const object = super.fromJSON(
      {
        className: VirtualCall.className,
        ...json,
      },
      override
    ) as unknown as VirtualCall;
    return object;
  }

  constructor() {
    super(VirtualCall.className);
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

  get channelName(): string {
    return this.get("channelName");
  }

  set channelName(value: string) {
    this.set("channelName", value);
  }

  get appointment(): Parse.Pointer | AppointmentV1 {
    return this.get("appointment");
  }

  set appointment(value: Parse.Pointer | AppointmentV1) {
    this.set("appointment", value);
  }

  get patient(): Parse.Pointer | PatientV1 {
    return this.get("patient");
  }

  set patient(value: Parse.Pointer | PatientV1) {
    this.set("patient", value);
  }

  get attendees(): Parse.User[] {
    return this.get("attendees");
  }

  set attendees(value: Parse.User[]) {
    this.set("attendees", value);
  }

  get status(): VirtualCallStatus {
    return this.get("status");
  }

  set status(value: VirtualCallStatus) {
    this.set("status", value);
  }

  get patientStatus(): VirtualCallPatientStatus {
    return this.get("patientStatus");
  }

  set patientStatus(value: VirtualCallPatientStatus) {
    this.set("patientStatus", value);
  }
}

Parse.Object.registerSubclass(
  VirtualCall.className,
  VirtualCall
);

export const VirtualCallSchema = new Parse.Schema(VirtualCall.className)
  .addString("channelName", { required: true })
  .addPointer("appointment", AppointmentV1.className, { required: true })
  .addPointer("patient", PatientV1.className, { required: true })
  .addArray("attendees", { required: true, defaultValue: [] })
  .addString("patientStatus", {required: true})
  .addString("status", { required: true });
