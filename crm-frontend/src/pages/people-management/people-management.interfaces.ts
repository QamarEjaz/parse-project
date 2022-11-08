export interface IPeople {
  name: string
  username: string
  status: string
  createdAt: Date
  delete: () => void
}

export interface IPeopleSet {
  name: string
  locations: any
  features: string[]
  createdAt: Date
  delete: () => void
}
