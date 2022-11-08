import { I_User } from "../../../../../core/src/models/_User"
import { Operatory } from "../../../Types/OperatoryTypes"

export interface IPatientTypes {
  id: string | number
  title: string
}
export interface IPatient {
  id: string | number
  firstName: string
  lastName: string
  address1: string
  city: string
  state: string
  postalCode: string
  dateOfBirth: string
  profile_image: string | null
  social_history: string
  level_needs: string
  types: IPatientTypes[]
  patientTypes: IPatientTypes[]
  patientStatus: string
  emailAddress: string
  phone: string
  preferredName: string
  gender: string
  firstVisitDate: string
  lastVisitDate: string
  ssn: string
  
}

export interface IProvider {
  id: string
  firstName: string
  lastName: string
}

export interface IAppointment {
  updatedAt?: string
  ascend_id?: string
  objectId: string
  toJSON?: Function
  createdAt?: string
  start: string
  end: string
  status: string
  note: string
  teamMembers: I_User[]
  chiefConcern: string
  operatory: Operatory
  patient: IPatient
  provider: IProvider
  other: string
}

export interface ICellData {
  start: string
  end: string
  operatory: Operatory
}
export interface IEventTemplate {
  StartTime: Date
  EndTime: Date
  Appointment: IAppointment
  AppointmentBackground: Operatory["className"]
}
export interface IScheduleTemplateProps {
  operatories: Operatory[]
  appointments: IAppointment[]
  updateLocalAppointment: any
  showApptInfo: boolean
  setIsCreatingAppt: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedAppt: React.Dispatch<React.SetStateAction<IAppointment | null>>
  setSelectedCell: React.Dispatch<React.SetStateAction<ICellData | null>>
}

export interface IConfirmationModalInfo {
  open: boolean
  oldOperatory: Operatory | null
  newOperatory: Operatory | null
  oldStartTime: Date | null
  oldEndTime: Date | null
  newStartTime: Date | null
  newEndTime: Date | null
  updateBtnLoading: boolean
  handleUpdate: () => void
  handleCancel: () => void
}
export interface IRoomData {
  Id: IAppointment["objectId"]
  StartTime: Date
  EndTime: Date
  RoomId: Operatory["objectId"]
  AppointmentBackground: Operatory["className"]
  Appointment: IAppointment
  RecurrenceRule: string
}
