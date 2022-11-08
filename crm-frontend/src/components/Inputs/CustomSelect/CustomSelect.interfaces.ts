export interface IOption {
  id: string
  name: string
  value: string | number
}
export interface ICustomSelectProps {
  content?: JSX.Element
  options?: IOption[] | any
  defaultValue?: undefined | string
  value?: IOption
  onChange?: (option: IOption) => void 
  editMode?: boolean
  disabled?: boolean
}
