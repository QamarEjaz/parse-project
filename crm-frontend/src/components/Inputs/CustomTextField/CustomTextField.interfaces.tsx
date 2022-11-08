export interface ICustomTextFieldProps {
  editMode: boolean
  id?: string
  name?: string
  value: string
  content: JSX.Element
  type?: any // fix this
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
