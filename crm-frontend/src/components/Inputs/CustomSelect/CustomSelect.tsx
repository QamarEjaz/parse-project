import { useEffect, useRef } from "react"
import Select from "../Select"
import { ICustomSelectProps, IOption } from "./CustomSelect.interfaces"

const CustomSelect = ({ content, options, defaultValue, value, onChange, editMode, disabled }: ICustomSelectProps): JSX.Element => {
  const fieldref = useRef<HTMLElement>()

  const handleChange = (option: IOption | any) => {
    onChange?.(option)
  }

  useEffect(() => {
    if (editMode) {
      fieldref?.current && fieldref?.current?.focus?.()
    } else {
      fieldref?.current && fieldref?.current?.blur?.()
    }
  }, [editMode])

  return (
    <>
      {!editMode ? (
        <>{content}</>
      ) : (
        <div
          className="w-full"
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <Select disabled={disabled} options={options} defaultValue={defaultValue} value={value} onChange={handleChange} />
        </div>
      )}
    </>
  )
}

export default CustomSelect
