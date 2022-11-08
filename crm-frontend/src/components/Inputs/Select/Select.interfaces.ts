export interface IOption {
  id: string
  name: string
  value: string | number
}
export interface ISelectProps {
  label?: string
  options?: IOption[] | any
  defaultValue?: string
  startAdornment?: JSX.Element
  size?: "small" | undefined
  value?: IOption | any
  onChange?: (selectedOption: IOption) => void
  disabled?: boolean
  selectRef?: any
  listStyles?: React.CSSProperties
  error?: boolean
  helperText?: string
}
