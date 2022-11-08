import { useState } from "react"
import * as Parse from "parse"
import { InputActionMeta, MultiValue } from "react-select"
import MultiSelect from "../../../../components/Inputs/MultiSelect"
import { IOption as IMultiOption } from "../../../../components/Inputs/MultiSelect/MultiSelect.interfaces"

export interface IUser {
  id: string
  value: string
  label: string
}

const TeamMultiSelect = ({ onChange, value }: { onChange: (event: MultiValue<any>) => void; value: IMultiOption[] }): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const [inpuText, setInpuText] = useState<string>("")
  const [filteredOptions, setFilteredOptions] = useState<IUser[]>([])

  const handleInputChange = async (newValue: string) => {
    setInpuText(newValue)
    try {
      if (newValue !== "") {
        setLoading(true)
        console.log("newValue: ", newValue)
        const response = Parse.Object.extend("_User")
        const parseQuery = new Parse.Query(response)
        /* @ts-ignore:disable-next-line */
        parseQuery.matches("name", newValue, "i")
        const result = await parseQuery.find()
        const patientsArray = result?.map((patient: any): IUser => {
          return {
            id: patient.id,
            value: patient.id,
            label: patient?.attributes?.name,
          }
        })
        setFilteredOptions(patientsArray)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <MultiSelect backgroundColor="#fff" border="1px solid #d1d5db" borderRadius="6px" menuBorderRadius="6px" isDark={false} isClearable={true} isLoading={loading} options={filteredOptions} value={value} onChange={onChange} inputValue={inpuText} onInputChange={handleInputChange} />
    </>
  )
}
export default TeamMultiSelect
