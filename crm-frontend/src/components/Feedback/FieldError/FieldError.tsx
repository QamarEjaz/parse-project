import { IFieldErrorProps } from "./FieldError.interfaces"

const FieldError = ({ children, className }: IFieldErrorProps): JSX.Element => {
  return <span className={`text-red-500 text-xs mb-1 inline-block${className ? ` ${className}` : ""}`}>{children}</span>
}

export default FieldError
