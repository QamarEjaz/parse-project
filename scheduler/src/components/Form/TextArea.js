import React from "react";

const TextArea = ({
  label,
  id,
  name,
  rows = 4,
  placeholder,
  error,
  helperText,
  value,
  onChange,
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
        <textarea
          placeholder={placeholder}
          rows={rows}
          name={name}
          value={value}
          onChange={onChange}
          id={id}
          className={`py-2 px-3 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 transition block w-full text-sm border resize-none ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-gray-300 focus:ring-gray-700"
          }`}
        />
      </div>
      {helperText ? (
        <div className="text-xs text-red-500 absolute mt-0.5">{helperText}</div>
      ) : null}
    </div>
  );
};

export default TextArea;
