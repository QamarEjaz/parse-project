import { useEffect } from "react"
import { IOPTION, IPracticeProcedureProps, PracticeProcedure } from "./PracticeProcedureSelect.interfaces"
import { customStyles } from "./PracticeProcedureSelect.styles"
import AsyncSelect from "react-select/async"
import data from "./data/index.json"

// import { fetchPracticeProcedures } from "services/practiceProcedureService"

const getOptionObject = (option: any): IOPTION => ({
  value: option.id,
  label: option.adaCode + " " + option.description,
})

const mapOptions = (values: any): Promise<IOPTION[]> => values.map((option: any) => getOptionObject(option))

const loadOptions = async (inputValue: string): Promise<any> => mapOptions(await fetchOptions(inputValue))

const fetchOptions = (query = ""): any => {
  return data
}

const PracticeProcedureSelect = ({
  onChange,
  value,
  selected,
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
}: IPracticeProcedureProps): JSX.Element => {
  const fetchSelectedOptions = async (): Promise<void> => {
    let res = await fetchOptions()
    let newSelected = res.filter((option: PracticeProcedure) => selected?.includes(option?.uid || ""))?.map((option: PracticeProcedure) => getOptionObject(option))

    if (onChange) onChange(newSelected)
  }

  useEffect(() => {
    if (selected?.length) {
      fetchSelectedOptions()
    }
  }, [selected])

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={value}
      onChange={onChange}
      styles={customStyles({
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
    />
  )
}

export default PracticeProcedureSelect
