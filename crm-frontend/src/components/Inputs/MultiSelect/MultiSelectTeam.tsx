import { useState } from "react"
import * as Parse from "parse"
import MultiSelectSimple from "./MultiSelectSimple"
import { IMultiSelectProps, IOption } from "./MultiSelect.interfaces"

const MultiSelectTeam = ({ onChange, value, options }: IMultiSelectProps): JSX.Element => {
  const [filteredOptions, setFilteredOptions] = useState<IOption[]>(options || [])

  const fetch = async (search: string): Promise<void> => {
    try {
      const response = Parse.Object.extend("_User")
      const parseQuery = new Parse.Query(response)
      /* @ts-ignore:disable-next-line */
      parseQuery.matches("name", search, "i")
      const result = await parseQuery.find()
      const patientsArray = result?.map((patient: any): IOption => {
        return {
          id: patient.id,
          value: patient.id,
          label: patient?.attributes?.name,
        }
      })
      setFilteredOptions(patientsArray)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <MultiSelectSimple backgroundColor="#fff" border="1px solid #d1d5db" borderRadius="6px" menuBorderRadius="6px" isDark={false} isClearable={true} options={filteredOptions} value={value} onChange={onChange} fetch={fetch} />
    </>
  )
}
export default MultiSelectTeam
