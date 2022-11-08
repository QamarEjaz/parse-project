export interface TypeItem {
  title: string
}

export interface PatientItem {
  profileImage: string 
  firstName: string
  lastName: string
  levelNeeds: string | null
  types: TypeItem[]
  dateOfBirth: string
  social_history: string | null
  emailAddress: string
  phone: string
  is_vip: boolean
  lastVisitDate: string
}

export interface AppointmentItem {
  start: string
  chief_concern: string | null
  team: string | null
  reason: string
  note: string
  location_model: { name: string }
}

export interface PatientQueueItem {
  id: number
  provider_joined: number
  patient: PatientItem
  appointment: AppointmentItem
  location: string
  type: string
  status: string
  created_at: string
  attributes: any // fix any
  profileImage: string
}
