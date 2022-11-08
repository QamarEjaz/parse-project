import Spinner from "./Spinner";

const variants = {
  primary: "text-white bg-gray-800 hover:bg-black",
  gray: "border border-gray-300 hover:bg-gray-50 text-gray-600",
  danger: "text-white bg-red-400 hover:bg-red-500",
};

const Button = ({
  title = "",
  className = "px-10 py-2",
  variant = "primary",
  loading = false,
  children,
  type = "button",
  disabled,
  onClick = () => {},
}) => {
  return (
    <button
      type={type}
      className={`flex shadow-sm rounded-md uppercase transition-colors ${className} ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{title}</span>

      {children}

      {loading && (
        <span className="ml-3">
          <Spinner />
        </span>
      )}
    </button>
  );
};

export default Button;
