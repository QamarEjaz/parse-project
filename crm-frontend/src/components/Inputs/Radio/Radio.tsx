import { IRadioProps } from "./Radio.interfaces"
import "./Radio.css"

const Radio = ({ checked, defaultChecked, name, title, id, onChange, value }: IRadioProps): JSX.Element => {
  return (
    <label htmlFor={id} className="inline-flex items-center sm:text-sm">
      <input type="radio" id={id} className="radio" checked={checked} defaultChecked={defaultChecked} name={name} onChange={onChange} value={value} />
      <span className="ml-2">{title}</span>
    </label>
  )
}

export default Radio
