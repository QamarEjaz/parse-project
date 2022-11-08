import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { classNames } from "../../utils/helpers";

export const Select = ({
  preferredLocation,
  setOpen,
  label,
  options,
  defaultValue,
  startAdornment,
  size,
  value,
  valueKey = "value",
  onChange,
  disabled,
  helperText,
  error,
  id,
  ...props
}) => {
  const [selected, setSelected] = useState(
    value
      ? options[options?.findIndex((i) => i[valueKey] === value[valueKey])]
      : options[defaultValue]
  );

  const handleChange = (e) => {
    setSelected(e);
    if (onChange) onChange(e, setSelected);
  };

  useEffect(() => {
    if (selected) {
      if (onChange) onChange(selected);
    }
  }, []);
  //
  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  return (
    <>
      <div className="w-full text-sm sm:text-base relative">
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
        <div className={`${label ? "mt-1" : ""}`}>
          <Listbox value={selected} onChange={handleChange} disabled={disabled}>
            {({ open }) => (
              <>
                <div className={`${label ? "mt-1" : ""} relative`}>
                  <Listbox.Button
                    ref={props.selectRef}
                    className={`relative w-full dark:bg-black-900 ${
                      disabled ? "bg-gray-100" : "bg-white"
                    } border dark:border-black-900 ${
                      error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }  rounded-md shadow-sm ${
                      size === "small" ? "pl-1 pr-8 py-1" : "pl-3 pr-10 py-2"
                    } text-left dark:text-white cursor-default focus:outline-none focus:ring-2 dark:focus:ring-offset-black-700 focus:ring-offset-2 sm:text-sm`}
                  >
                    <span
                      className={`flex items-center ${
                        disabled ? "text-gray-400" : "text-black"
                      }`}
                    >
                      {startAdornment}
                      <span
                        className={`block truncate ${
                          size === "small"
                            ? `${startAdornment ? "ml-2" : "ml-0"}`
                            : `${startAdornment ? "ml-3" : "ml-0"}`
                        } text-ellipsis overflow-hidden`}
                      >
                        {selected ? selected.name : ""}{" "}
                      </span>
                    </span>
                    <span
                      className={`ml-3 absolute inset-y-0 right-0 flex items-center pointer-events-none ${
                        size === "small" ? "pr-1" : "pr-2"
                      }`}
                    >
                      <SelectorIcon
                        className={`h-5 w-5 ${
                          disabled ? "text-gray-300" : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      className="absolute mt-1 w-full dark:bg-black-800 bg-white shadow-lg max-h-56 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                      style={props.listStyles}
                    >
                      {options.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? `${
                                    option?.disabled
                                      ? "bg-indigo-100"
                                      : "text-white dark:bg-black-900 bg-indigo-600"
                                  }`
                                : "dark:text-black-600 text-gray-900",
                              option?.disabled ? "opacity-50" : "",
                              "cursor-default select-none relative py-2 pl-3 pr-9"
                            )
                          }
                          value={option}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                {startAdornment}
                                {preferredLocation?.id === option?.id ? (
                                  <div className="absolute right-8 text-mobile-gray-600">
                                    <span className="bg-purple-300 text-purple-800 text-xs font-semibold mr-2 px-3 py-1 dark:bg-purple-300 dark:text-purple-900 rounded-full">
                                      Home office
                                    </span>
                                  </div>
                                ) : null}
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    size === "small"
                                      ? `${
                                          !startAdornment ? "ml-0" : "ml-3"
                                        } text-xs`
                                      : `${startAdornment ? "ml-3" : "ml-0"}`,
                                    "block"
                                  )}
                                >
                                  {option.name}
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-indigo-600",
                                    "absolute inset-y-0 right-0 flex items-center",
                                    size === "small" ? "pr-2" : "pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
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

        {helperText ? (
          <div className="text-xs text-red-500 absolute mt-0.5">
            {helperText}
          </div>
        ) : null}
      </div>
    </>
  );
};
