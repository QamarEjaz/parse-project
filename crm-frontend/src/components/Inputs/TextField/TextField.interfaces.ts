import { HTMLInputTypeAttribute } from "react"
import { FieldValues, UseFormRegister } from "react-hook-form"

export interface ITextFieldProps {
  label?: string
  className?: string
  register?: UseFormRegister<FieldValues>
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
  noring?: boolean
  disabled?: boolean
  inputRef?: React.RefObject<HTMLInputElement>
  type?: HTMLInputTypeAttribute | undefined
  value?: any
  required?: boolean
  placeholder?: string
  autoComplete?: string
  style?: React.CSSProperties
  name?: string
  noShadow?: boolean
  error?: boolean
  helperText?: string
}