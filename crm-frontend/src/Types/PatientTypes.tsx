import { Dispatch, SetStateAction } from "react"

export interface RegisterData {
  firstName: string
  lastName: string
  gender: string
  contactMethod: string
  address: string
  phone: string
  email: string
  dateOfBirth: string
  languageType: string
  postalCode: string
  city: string
  location: any
  patientStatus: any
  ssn: string
  state: string
  setIsLoading: Dispatch<SetStateAction<boolean>>
  handleClose?: () => void
}
