import { useEffect, useRef, useState } from "react"
import { IOption } from "../components/Inputs/MultiSelect/MultiSelect.interfaces"

const useLocationsSelect = (initialState: any[]): any[] => {
  const getId = (object: any): string => {
    if (object?.id) return object?.id
    else if (object?.ascend_id) return object?.ascend_id
    else if (object?.attributes?.id) return object?.attributes?.id
    else return ""
  }

  const getName = (object: any): string => {
    if (object?.name) return object?.name?.replace("Total Health Dental Care ","")
    else if (object?.get && object?.get("name")) return object?.get("name")?.replace("Total Health Dental Care ","")
    else return ""
  }

  const handleOptions = (state: any): any[] => {
    const array = state?.map((object: any) => {
      return {
        id: `${getId(object)}`,
        value: `${getId(object)}`,
        name: getName(object),
      }
    })
    return array
  }

  const [state, setState] = useState<IOption[]>(handleOptions(initialState))
  const executedRef = useRef(false)

  const toggle = (value: any): void => setState(handleOptions(value))

  useEffect(() => {
    if (executedRef.current) {
      return
    }

    toggle(initialState)

    executedRef.current = true
  }, [initialState])

  return [state, toggle]
}

export default useLocationsSelect
