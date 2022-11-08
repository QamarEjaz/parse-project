import { Fragment, useEffect, useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import classNames from "classnames"
import FieldError from "../../Feedback/FieldError"
import { IOption, ISelectProps } from "./Select.interfaces"

const Select = ({ error, helperText, label, options = [], defaultValue, startAdornment, size, value, onChange, selectRef, disabled, listStyles }: ISelectProps): JSX.Element => {
  const [selected, setSelected] = useState(value ? options[options.findIndex((i: any) => i.value === value.value)] : options[defaultValue as unknown as number])

  const handleChange = (selectedOption: IOption) => {
    setSelected(selectedOption)
    if (onChange) onChange(selectedOption)
  }

  const getOutlined = (): JSX.Element => {
    return (
      <>
        <div className="w-full text-sm sm:text-base relative">
          <label htmlFor="status" className="input-label">
            {label}
          </label>
          <div className={`${label ? "mt-1" : ""}`}>
            <Listbox value={selected} onChange={handleChange} disabled={disabled}>
              {({ open }) => (
                <>
                  <div className={`${label ? "mt-1" : ""} relative`}>
                    <Listbox.Button
                      ref={selectRef}
                      className={`relative w-full dark:bg-black-900 ${disabled ? "bg-gray-100" : "bg-white"} border dark:border-black-900 border-gray-300 rounded-md shadow-sm ${size === "small" ? "pl-1 pr-8 py-1" : "pl-3 pr-10 py-2"
                        } text-left dark:text-white cursor-default focus:outline-none focus:ring-2 dark:focus:ring-offset-black-700 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm`}
                    >
                      <span className={`flex items-center ${disabled ? "text-gray-400" : "text-black"}`}>
                        {startAdornment}
                        <span className={`block truncate ${size === "small" ? `${startAdornment ? "ml-2" : "ml-0"}` : `${startAdornment ? "ml-3" : "ml-0"}`} text-ellipsis overflow-hidden`}>{selected ? selected.name : ""} </span>
                      </span>
                      <span className={`ml-3 absolute inset-y-0 right-0 flex items-center pointer-events-none ${size === "small" ? "pr-1" : "pr-2"}`}>
                        <SelectorIcon className={`h-5 w-5 ${disabled ? "text-gray-300" : "text-gray-400"}`} aria-hidden="true" />
                      </span>
                    </Listbox.Button>

                    <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-30 mt-1 w-full dark:bg-black-800 bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" style={listStyles}>
                        {options.map((option: any) => (
                          <Listbox.Option key={option.id} className={({ active }) => classNames(active ? "text-white dark:bg-black-900 bg-gray-600" : "dark:text-black-600 text-gray-900", "cursor-default select-none relative py-2 pl-3 pr-9")} value={option}>
                            {({ selected: current, active }) => (
                              <>
                                <div className="flex items-center">
                                  {startAdornment}

                                  <span className={classNames(current || option.id === value?.id || option.id === selected?.id ? "font-semibold" : "font-normal", size === "small" ? `${!startAdornment ? "ml-0" : "ml-3"} text-xs` : `${startAdornment ? "ml-3" : "ml-0"}`, "block")}>{option.name}</span>
                                </div>

                                {current || option.id === value?.id || option.id === selected?.id ? (
                                  <span className={classNames(active ? "text-white" : "text-gray-600", "absolute inset-y-0 right-0 flex items-center", size === "small" ? "pr-2" : "pr-4")}>
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>

          {error ? <FieldError className="absolute mt-0.5">{helperText}</FieldError> : null}
        </div>
      </>
    )
  }

  useEffect(() => {
    if (selected) {
      if (onChange) onChange(selected)
    }
  }, [])

  useEffect(() => {
    if (value) setSelected(value)
  }, [value])

  return <>{getOutlined()}</>
}

export default Select
