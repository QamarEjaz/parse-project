const SelectField = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  valueKey = 'value',
  options,
}) => {
  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className={`block text-sm font-medium transition-colors ${
            error ? 'text-red-500' : 'text-gray-700'
          } mb-1`}
        >
          {label}
        </label>
      ) : null}
      <select
        id={id}
        name={name}
        className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
        onChange={onChange ? onChange : () => null}
        placeholder={placeholder}
        value={value}
      >
        {options &&
          options.map((loc) => (
            <option value={loc.id} key={loc.id}>
              {loc[valueKey]}
            </option>
          ))}
      </select>
      {helperText ? (
        <div className='text-xs text-red-500 absolute mt-0.5'>{helperText}</div>
      ) : null}
    </div>
  );
};

export default SelectField;
