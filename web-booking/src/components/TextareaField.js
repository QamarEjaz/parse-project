import React from "react";

const TextareaField = ({
  innerRef = null,
  className = "",
  inputClass = "",
  icon = null,
  name,
  error,
  ...props
}) => {
  return (
    <div className={`flex flex-col relative ${className}`}>
      <div className="flex flex-col justify-center">
        {icon}
        <textarea
          className={`w-full py-2 px-3 placeholder-mobile-grey-400 focus:outline-none lg:text-3xl bg-gray-100 rounded ${
            error ? "border border-red-400" : "border-transparent"
          } ${inputClass}`}
          name={name}
          {...props}
        ></textarea>
      </div>

      {error && <span className="text-sm mt-1 text-red-400">{error}</span>}
    </div>
  );
};

export default TextareaField;
