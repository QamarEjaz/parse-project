import FieldError from "../../Feedback/FieldError"
import { ITextareaProps } from "./Textarea.interfaces"

const Textarea = ({ label, id, name, error, helperText, rows, placeholder, value, innerRef, onChange }: ITextareaProps): JSX.Element => {
  const getOutlined = (): JSX.Element => {
    return (
      <>
        <div className="relative w-full">
          <label htmlFor={id} className="block text-xs font-normal dark:text-white text-gray-600">
            {label}
          </label>
          <div className="mt-1">
            <textarea
              className="block w-full px-3 py-2 dark:bg-black-900 dark:text-white border dark:border-black-900 border-gray-300 rounded-md shadow-sm bg-transparent resize-none focus:outline-none focus:ring-2 dark:focus:ring-offset-black-700 focus:ring-offset-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              id={id}
              name={name}
              rows={rows}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              ref={innerRef}
            />
          </div>

          {error ? <FieldError className="absolute mt-0.5">{helperText}</FieldError> : null}
        </div>
      </>
    )
  }

  return <>{getOutlined()}</>
}

export default Textarea
