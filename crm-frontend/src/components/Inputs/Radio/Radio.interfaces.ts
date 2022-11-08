export interface IRadioProps {
  checked?: boolean | undefined
  id?: string | undefined
  defaultChecked?: boolean | undefined
  name?: string
  title?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string | number | readonly string[] | undefined
}
