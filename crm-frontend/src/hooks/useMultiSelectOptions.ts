import { useEffect, useRef, useState } from "react"
import { IOption } from "../components/Inputs/MultiSelect/MultiSelect.interfaces"

const useMultiSelectOptions = (initialState: any[]): any[] => {
  const getId = (object: any): string | undefined => {
    if (object?.id) return object?.id
    else if (object?.ascend_id) return object?.ascend_id
    else if (object?.attributes?.id) return object?.attributes?.id
    else return undefined
  }

  const getName = (object: any): string | undefined => {
    if (object?.name) return object?.name
    else if (object?.firstName) return object?.firstName + object?.lastName
    else if (object?.get && object?.get("name")) return object?.get("name")
    else if (object?.get && object?.get("firstName"))
      return object?.get("firstName") + object?.get("lastName")
    else return undefined
  }

  const handleOptions = (state: any): any[] => {
    const array = state?.map((object: any) => {
      return {
        id: `${getId(object)}`,
        value: `${getId(object)}`,
        label: getName(object),
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

export default useMultiSelectOptions
