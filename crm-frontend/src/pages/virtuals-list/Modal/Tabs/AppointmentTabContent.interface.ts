export interface IAppointmentTabContent {
  appointment: any
  patient: any
  isEditing: boolean
  submitRef?: any // fix any
}

// fix any types
export interface IPatient {
  firstName: string
  lastName: string
  gender: string
  emailAddress: string
  phones: {number: string}[]
  patientStatus: string
  dateOfBirth: string
  ssn: string
  address1: string
  address2: string
  levelNeeds: string
  socialHistory: string
  types: any
  primaryProvider_ascend: any
  is_vip: string
  firstVisitDate: string
  lastVisitDate: string
}

export interface IProvider {
  id: string
  uid: string
  objectId: string
  firstName: string
  lastName: string
}

export interface ILocation {
  uid: string
  name: string
}

export interface IOperatory {
  id: string
  uid: string
  shortName: string
}

export interface IProcedure {
  adaCode: string
  description: string
}

export interface IGetOptionFromSelect {
  id: string
  value: string
  name: string
}
