import React from "react";

const InputField = ({
  innerRef = null,
  className = "",
  inputClass = "",
  icon = null,
  error,
  name,
  disabled,
  helpertext,
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full relative ${className}`}>
      <div className="flex flex-col justify-center">
        {icon}
        <input
          className={`w-full py-2 px-3 placeholder-mobile-grey-400 bg-gray-100 focus:outline-none lg:text-3xl rounded-md ${
            error ? "border border-red-400" : "border-transparent"
          } ${
            disabled
              ? "text-mobile-grey-400 cursor-not-allowed"
              : "text-mobile-grey-600"
          } ${inputClass}`}
          name={name}
          ref={innerRef}
          disabled={disabled}
          {...props}
        />
      </div>

      {error && <span className="text-sm mt-1 text-red-400">{helpertext}</span>}
    </div>
  );
};

export default InputField;
