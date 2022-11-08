export interface IPatientTypes {
  id: string | number
  title: string
}

export interface IPatient {
  id: string | number
  firstName: string
  lastName: string
  address1: string
  dateOfBirth: string
  profile_image: string | null
  social_history: string
  level_needs: string
  types: IPatientTypes[]
  patientTypes: IPatientTypes[]
  patientStatus: string
  emailAddress: string
  phone: string
 
}

export interface IPatientSelectProps {
  onChange?: (patient: IPatient | null) => void
  placeholder?: string
  borderLess?: boolean
  className?: string
  iconClassName?: string
  tableContainerClassName?: string
  nonEditable?: boolean
  avatarClassName?: string
  rowClickAble?: boolean
}
