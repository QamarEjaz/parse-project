import Textarea from "../Textarea"
import { ICustomTextareaProps } from "./CustomTextarea.interfaces"

const CustomTextarea = ({ content, value, editMode, id, rows, onChange }: ICustomTextareaProps): JSX.Element => {
  return <div className="flex items-center w-full">{!editMode ? <>{content}</> : <Textarea id={id} rows={rows} value={value} onChange={onChange} />}</div>
}

export default CustomTextarea
