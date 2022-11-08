export interface ITextareaProps {
  label?: string
  id?: string
  name?: string
  rows?: number
  placeholder?: string
  value?: any
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: boolean
  helperText?: string
  innerRef?: any // fix this
}