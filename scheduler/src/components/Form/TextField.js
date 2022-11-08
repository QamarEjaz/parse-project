import React from "react";

const TextField = ({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  inputRef,
}) => {
  return (
    <div className="relative">
      {label ? (
        <label
          htmlFor={id}
          className={`block text-sm font-medium transition-colors ${
            error ? "text-red-500" : "text-gray-700"
          } mb-1`}
        >
          {label}
        </label>
      ) : null}
      <div>
        <input
          value={value}
          onChange={onChange ? onChange : () => null}
          type={type}
          name={name}
          ref={inputRef}
          id={id}
          className={`py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition block w-full text-sm   ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-gray-700 focus:border-gray-300"
          }`}
          placeholder={placeholder}
        />
      </div>
      {helperText ? (
        <div className="text-xs text-red-500 absolute mt-0.5">{helperText}</div>
      ) : null}
    </div>
  );
};

export default TextField;
