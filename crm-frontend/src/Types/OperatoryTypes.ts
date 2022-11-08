export interface Operatory {
  createdAt?: string
  updatedAt?: string
  name: string
  active: boolean
  ascend_id: string
  shortName: string
  objectId: string
  className?: "bg-appointment-green" | "bg-appointment-blue"
  toJSON?: Function
}
