import MultiSelectSimple from "./MultiSelectSimple"
import MultiSelectTeam from "./MultiSelectTeam"
import { IMultiSelectProps } from "./MultiSelect.interfaces"

const MultiSelect = ({ ...props }: IMultiSelectProps): JSX.Element => {
  switch (props.variant) {
    case "simple":
      return <MultiSelectSimple {...props} />
    case "team":
      return <MultiSelectTeam {...props} />
    default:
      return <MultiSelectSimple {...props} />
  }
}

export default MultiSelect
