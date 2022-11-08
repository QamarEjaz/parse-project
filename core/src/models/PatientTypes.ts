import * as Parse from "parse/node";
import { ModelBase } from "./ModelBase";

export interface IPatientTypes {
  name: string;
}

const className = "PatientTypes";

const complexTypes = [
  {
    columnName: "patienTypes",
    className: "PatientV1",
    shouldIgnore: false,
  },
];

export class PatientTypes extends Parse.Object {
  constructor(attributes: IPatientTypes) {
    super(className, attributes);
    this.className = className;
  }

}

Parse.Object.registerSubclass(className, PatientTypes);

const schema = new Parse.Schema(className);
schema.addString("name");

export { schema as PatientTypesSchema };