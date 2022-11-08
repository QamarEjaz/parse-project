import { InputActionMeta, MultiValue } from "react-select"

export interface IOption {
  id: string
  label: string
  value: string | number
}
export interface IMultiSelectProps {
  variant?: string
  options?: IOption[]
  noOptionsMessage?: string
  isClearable?: boolean
  clearValue?: boolean
  onChange?: (option: MultiValue<any>) => void
  fetch?: (search: string) => void
  onInputChange?: (newValue: string) => void
  value?: IOption | IOption[] | MultiValue<IOption>
  inputValue?: string
  isLoading?: boolean
  isDark?: boolean
  menuBorderRadius?: string
  border?: string
  borderWidth?: string
  borderTopWidth?: string
  borderRightWidth?: string
  borderLeftWidth?: string
  borderBottomWidth?: string
  borderColor?: string
  borderTopColor?: string
  borderRightColor?: string
  borderLeftColor?: string
  borderBottomColor?: string
  borderStyle?: string
  borderTopStyle?: string
  borderRightStyle?: string
  borderLeftStyle?: string
  borderBottomStyle?: string
  borderRadius?: string
  backgroundColor?: string
  valueContainerType?: 'boxed' | "default"
}
