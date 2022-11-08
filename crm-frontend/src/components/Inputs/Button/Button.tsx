import { useMemo } from "react"
import { IButtonProps } from "./Button.interfaces"

const variantClasses = {
  text: "btn-text",
  contained: "btn-contained",
  outlined: "btn-outlined",
}

const colorClasses = {
  primary: "btn-primary",
  indigo: "btn-indigo",
  "indigo-light": "btn-indigo-light",
  red: "btn-red",
  gray: "btn-gray",
  "gray-light": "btn-gray-light",
  "gray-dark": "btn-gray-dark",
}

const Button = ({ rounded, type = "button", className, children, loading, variant = "contained", color, disabled, onClick, style }: IButtonProps): JSX.Element => {
  const loader = useMemo(
    () =>
      Array(4)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className={
              !color || (color === "gray" && variant !== "contained") || color === "white" ? "bg-gray-700" : variant !== "contained" ? (color === "primary" ? "bg-primary" : color === "indigo" || color === "indigo-light" ? "bg-indigo-500" : color === "red" ? "bg-red-500" : "bg-gray-700") : "bg-white"
            }
          />
        )),
    [color, variant]
  )

  return (
    <button id="button" type={type} className={`btn ${rounded ? "btn-rounded" : ""} ${variantClasses[variant as keyof typeof variantClasses]} ${colorClasses[color as keyof typeof colorClasses]} ${className}`} disabled={disabled || loading} onClick={onClick} style={style}>
      {loading ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" id="button-loader">
          <div className="spinner-wrapper">
            <div className="lds-ellipsis">{loader}</div>
          </div>
        </div>
      ) : null}
      <div className={`${loading && "opacity-0"}`} id="button-text">
        {children}
      </div>
    </button>
  )
}

export default Button
