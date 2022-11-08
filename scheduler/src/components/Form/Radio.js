import React from "react";
import "./index.css";

const Radio = ({
  checked,
  defaultChecked,
  name,
  title,
  id,
  onChange,
  value,
}) => {
  return (
    <label htmlFor={id} className="inline-flex items-center sm:text-sm">
      <input
        type="radio"
        id={id}
        className="radio"
        checked={checked}
        defaultChecked={defaultChecked}
        name={name}
        onChange={onChange}
        value={value}
      />
      {title ? <span className="ml-2">{title}</span> : null}
    </label>
  );
};

export default Radio;
