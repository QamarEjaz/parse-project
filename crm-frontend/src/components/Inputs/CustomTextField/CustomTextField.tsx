import { useEffect, useRef } from "react"

import TextField from "../TextField"
import { ICustomTextFieldProps } from "./CustomTextField.interfaces"

const CustomTextField = ({ content, value, editMode, onChange, ...props }: ICustomTextFieldProps): JSX.Element => {
  const fieldref = useRef<HTMLInputElement>()

  useEffect(() => {
    if (editMode) {
      fieldref?.current && fieldref.current.focus()
    } else {
      fieldref?.current && fieldref.current.blur()
    }
  }, [editMode])

  return <div className="flex items-center w-full">{!editMode ? <>{content}</> : <TextField id={props.id} name={props.name} value={value} type={props.type} onChange={onChange} />}</div>
}

export default CustomTextField
