import { useMemo } from "react";

const Button = ({
  type,
  className,
  children,
  loading,
  variant = "contained",
  color = "indigo",
  disabled,
  onClick,
  style,
}) => {
  const variantClasses = useMemo(
    () => ({
      text: "btn-text",
      contained: "btn-contained",
      outlined: "btn-outlined",
    }),
    []
  );

  const colorClasses = useMemo(
    () => ({
      primary: "btn-primary",
      indigo: "btn-indigo",
      "indigo-light": "btn-indigo-light",
      red: "btn-red",
      gray: "btn-gray",
    }),
    []
  );

  return (
    <button
      type={type || "button"}
      className={`btn ${variantClasses[variant]} ${colorClasses[color]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
    >
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="spinner-wrapper">
            <Spinner
              className={
                !color || color === "gray" || color === "white"
                  ? "bg-gray-700"
                  : variant !== "contained"
                  ? color === "primary"
                    ? "bg-primary"
                    : color === "indigo" || color === "indigo-light"
                    ? "bg-indigo-500"
                    : color === "red"
                    ? "bg-red-500"
                    : "bg-gray-700"
                  : "bg-white"
              }
            />
          </div>
        </div>
      )}
      <span className={`${loading && "opacity-0"}`}>{children}</span>
    </button>
  );
};

export default Button;

const Spinner = ({ className }) => {
  return (
    <div className={`lds-ellipsis`}>
      <div className={className || ""}></div>
      <div className={className || ""}></div>
      <div className={className || ""}></div>
      <div className={className || ""}></div>
    </div>
  );
};
