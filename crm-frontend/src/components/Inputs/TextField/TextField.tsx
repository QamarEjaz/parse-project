import classNames from "classnames"
import FieldError from "../../Feedback/FieldError"
import { ITextFieldProps } from "./TextField.interfaces"

const TextField = ({ label, error, helperText, className, register, onChange, id, noring, disabled, inputRef, type, value, required, placeholder, autoComplete, style, name, noShadow }: ITextFieldProps): JSX.Element => {
  return (
    <div className="w-full relative">
      {label ? (
        <label htmlFor={id} className="input-label mb-1">
          {label}
        </label>
      ) : null}
      <div>
        <input
          id={id}
          name={name}
          type={type}
          style={style}
          value={value}
          ref={inputRef}
          disabled={disabled}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={classNames(
            "sm:text-sm block w-full focus:outline-none px-3 py-2 dark:bg-black-900 dark:text-white border dark:border-black-900 border-gray-300 rounded-md placeholder-gray-400 ",
            noring ? "" : "focus:ring-2 dark:focus:ring-offset-black-700 focus:ring-offset-2 focus:ring-gray-500 focus:border-gray-500",
            disabled ? "bg-gray-100 text-gray-400" : "",
            noShadow ? " " : " shadow-sm ",
            className
          )}
          {...register}
        />
      </div>
      {error ? <FieldError className="absolute mt-0.5">{helperText}</FieldError> : null}
    </div>
  )
}

export default TextField
