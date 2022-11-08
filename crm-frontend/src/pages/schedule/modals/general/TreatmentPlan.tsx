import { MinusIcon, PlusIcon } from "@heroicons/react/outline"
import IconButton from "../../../../components/Inputs/IconButton"
import TextField from "../../../../components/Inputs/TextField"
// import Spinner from "../../../../components/Spinner";

const TreatmentPlan = (): JSX.Element => {
  return (
    <div className="space-y-4 relative">
      {/* {props.isLoading ? ( */}
      {/* <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-black-700 z-10 flex items-center justify-center bg-opacity-50 dark:bg-opacity-60">
        <Spinner variant="ellipsis" className="bg-black-800" />
      </div> */}
      {/* ) : null} */}
      {/* Treatment Plan */}
      <div className="flex items-start justify-between">
        <label className="input-label">Treatment Plan</label>
        <div className="flex items-center justify-between w-24">
          <IconButton size="md" className=" p-1 bg-gray-100 dark:bg-black-900">
            <MinusIcon className="text-gray-600 dark:text-white"></MinusIcon>
          </IconButton>
          1
          <IconButton size="md" className=" p-1 bg-gray-100 dark:bg-black-900">
            <PlusIcon className="text-gray-600 dark:text-white"></PlusIcon>
          </IconButton>
        </div>
      </div>
      <TextField type="text" placeholder={`Treatment plan 1`} />
      {/* <div className="flex space-x-4 col-span-2">{getSecondaryButton()}</div> */}
    </div>
  )
}
export default TreatmentPlan
