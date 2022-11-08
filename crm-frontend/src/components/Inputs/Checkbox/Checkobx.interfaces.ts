export interface ICheckboxProps {
  label?: string
  id?: string
  name?: string
  type?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  checked?: boolean
  defaultChecked?: boolean
}