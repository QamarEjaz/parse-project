import React, { ReactNode, useState } from "react"
import { components, DropdownIndicatorProps, GroupBase, MultiValue, MultiValueGenericProps, OptionProps, StylesConfig } from "react-select"
import ReactSelect from "react-select"
import { CheckIcon } from "@heroicons/react/outline"
import Icon from "../../DataDisplay/Icon"
import { IMultiSelectProps, IOption } from "./MultiSelect.interfaces"
import { customStyles } from "./MultiSelect.styles"
import { toast } from "react-toastify"

const groupStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}

const groupBadgeStyles: React.CSSProperties = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
}

const formatGroupLabel = (data: GroupBase<any>): JSX.Element => {
  return (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  )
}

const MultiSelectSimple = ({
  variant,
  options,
  noOptionsMessage,
  isClearable,
  onChange,
  fetch,
  value,
  isDark,
  menuBorderRadius,
  border,
  borderWidth,
  borderTopWidth,
  borderRightWidth,
  borderLeftWidth,
  borderBottomWidth,
  borderColor,
  borderTopColor,
  borderRightColor,
  borderLeftColor,
  borderBottomColor,
  borderStyle,
  borderTopStyle,
  borderRightStyle,
  borderLeftStyle,
  borderBottomStyle,
  borderRadius,
  backgroundColor,
}: IMultiSelectProps): JSX.Element => {
  const [optionSelected, setOptionSelected] = useState<IOption[] | MultiValue<any>>(value ? (Array.isArray(value) ? [...value] : [value]) : [])
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [inpuText, setInpuText] = useState<string>("")

  const MultiValueContainer = ({ selectProps, data }: MultiValueGenericProps<any, true, GroupBase<any>>): JSX.Element => {
    const label = data.label
    const allSelected = selectProps?.value
    const index = allSelected.findIndex ? allSelected.findIndex((selected: any) => selected.label === label) : null
    const isLastSelected = index === allSelected.length - 1
    const labelSuffix = isLastSelected ? ` ` : ", "
    const val = `${label}${labelSuffix}`
    return <>{val}</>
  }

  const DropdownIndicator = (props: DropdownIndicatorProps<any, true, GroupBase<any>>): JSX.Element => {
    let arrow = (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={`${variant === "transparent" ? "h-4 w-4 text-white" : "h-5 w-5 text-gray-400"}`}>
          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </div>
    )
    return <components.DropdownIndicator {...props}>{arrow}</components.DropdownIndicator>
  }

  const Option = (props: OptionProps<any, true, GroupBase<any>>): JSX.Element => {
    return (
      <div>
        <components.Option {...props}>
          <input type="checkbox" className="hidden" checked={props?.isSelected} onChange={(): null => null} />
          <label className={`${variant === "transparent" ? "text-xs" : "text-base sm:text-sm"} w-full flex justify-between items-center"`}>
            <span className="dark:text-white">{props?.label}</span>
            {props?.isSelected && (
              <span className={`${props?.isFocused ? "#fff" : "text-primary"} flex items-center justify-center`}>
                <Icon icon={CheckIcon} fontSize="text-xl" />
              </span>
            )}
          </label>
        </components.Option>
      </div>
    )
  }

  const handleMenuClose = (): void => {
    setOpen(false)
  }

  const handleMenuOpen = (): void => {
    setOpen(true)
  }

  const handleChange = (selected: MultiValue<any>): void => {
    setOptionSelected(selected)
    onChange?.(selected)
  }

  const handleInputChange = async (search: string): Promise<void> => {
    setInpuText(search)
    if (fetch) {
      try {
        if (search !== "") {
          setLoading(true)
          await fetch(search)
          setLoading(false)
        }
      } catch (error) {
        toast.error(`${error}`)
        setLoading(false)
      }
    }
  }

  return (
    <span className={`block relative items-center group ${variant === "transparent" && "transparent"}`} data-toggle="popover" data-trigger="focus" data-content="Please select account(s)">
      <ReactSelect
        styles={customStyles({
          variant,
          isDark,
          menuBorderRadius,
          border,
          borderWidth,
          borderTopWidth,
          borderRightWidth,
          borderLeftWidth,
          borderBottomWidth,
          borderColor,
          borderTopColor,
          borderRightColor,
          borderLeftColor,
          borderBottomColor,
          borderStyle,
          borderTopStyle,
          borderRightStyle,
          borderLeftStyle,
          borderBottomStyle,
          borderRadius,
          backgroundColor,
        })}
        options={options}
        noOptionsMessage={(): ReactNode => noOptionsMessage}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{
          MultiValueContainer: MultiValueContainer,
          DropdownIndicator: DropdownIndicator,
          IndicatorSeparator: () => null,
          Option: Option,
        }}
        formatGroupLabel={formatGroupLabel}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        value={optionSelected}
        inputValue={inpuText}
        isLoading={loading}
        isClearable={isClearable}
        isSearchable={open}
      />

      {optionSelected?.length > 1 ? (
        <div className="absolute right-8 transform -translate-y-full -top-2 items-center ml-6 group-hover:flex hidden">
          <div className="relative mx-2 bg-black-900">
            <div className="bg-black text-white text-xs rounded py-2 px-4 right-0 bottom-full">
              {optionSelected.map((option: IOption, index: number) => (
                <React.Fragment key={index}>
                  {option.label}
                  {index === optionSelected.length - 1 ? "" : ", "}
                </React.Fragment>
              ))}
              <svg className="absolute h-2 right-0 mr-3 top-full text-black-900" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
              </svg>
            </div>
          </div>
        </div>
      ) : null}
    </span>
  )
}

export default MultiSelectSimple
