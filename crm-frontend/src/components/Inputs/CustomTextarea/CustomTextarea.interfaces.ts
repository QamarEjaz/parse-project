export interface ICustomTextareaProps {
  content: JSX.Element
  value: string
  editMode: boolean
  id?: string
  rows?: number
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}
