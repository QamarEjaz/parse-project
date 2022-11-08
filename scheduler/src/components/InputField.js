import React from "react";

const InputField = ({
  innerRef = null,
  className = "",
  inputClass = "",
  icon = null,
  error,
  name,
  disabled,
  title,
  helpertext,
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full relative ${className}`}>
      <div className="flex flex-col justify-center">
        {icon}
        { title && <div className="mb-1"> <label> {title} </label> </div> }

        <input
          className={`w-full py-2 px-3 placeholder-mobile-grey-400 border bg-white focus:outline-none rounded-md ${
            error ? "border border-red-400" : "border-gray-300"
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
