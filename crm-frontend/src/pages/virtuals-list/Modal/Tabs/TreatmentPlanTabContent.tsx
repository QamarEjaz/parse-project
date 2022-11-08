import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import CustomTextField from "../../../../components/Inputs/CustomTextField"
import FieldError from "../../../../components/Feedback/FieldError"
// import Spinner from "@component/Spinner"

interface ITreatmentPlanTabContentProps {
  isEditing: boolean
  appointment: any // fix any
  patient: any // fix any
  selectedTreatmentPlanId: any // fix any
  treatmentPlans: any // fix any
  // setTreatmentPlanState: any // fix any
}

const TreatmentPlanTabContent = ({ isEditing, appointment, patient, selectedTreatmentPlanId, treatmentPlans, ...props }: ITreatmentPlanTabContentProps): JSX.Element => {
  const [isUpdatingTreatmentPlan, setisUpdatingTreatmentPlan] = useState<any>(null) // fix any

  // fix any
  const getTreatmentPlan = (treatmentPlan: any, index: number): string => {
    if (treatmentPlan && treatmentPlan && treatmentPlan.treatments[index] && treatmentPlan.treatments[index]["title"]) {
      return treatmentPlan.treatments[index]["title"]
    } else {
      return ""
    }
  }

  // fix any
  const tp = treatmentPlans?.data?.find((tp: any) => tp?.id === selectedTreatmentPlanId)

  const { control, getValues, handleSubmit, formState, setValue, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      treatmentPlan1: getTreatmentPlan(tp, 0),
      treatmentPlan2: getTreatmentPlan(tp, 1),
      treatmentPlan3: getTreatmentPlan(tp, 2),
      treatmentPlan4: getTreatmentPlan(tp, 3),
      treatmentPlan5: getTreatmentPlan(tp, 4),
    },
  })

  const handleTreatmentPlan = (): void => {}

  // fix any
  const getTreatmentPlanFields = (): any => {
    let elements: any = []
    for (let i = 1; i < 6; i++) {
      let name: any = "treatmentPlan" + i // fix any

      elements.push(
        <div className="text-sm dark:text-white" key={i + 1}>
          <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Treatment plan {i}</div>
          <div className="relative mt-2">
            <Controller
              control={control}
              name={name}
              rules={{ required: i === 0 ? "The field is required" : false }}
              render={({ field }) => {
                let { onChange, name, value } = field
                return <CustomTextField editMode={isEditing} id={`treatmentPlan${i + 1}`} name={name} value={value} onChange={onChange} content={<div className="text-sm">{value || "Not filled"}</div>} />
              }}
            />
            {/* <FieldError className="absolute capitalize -bottom-6 left-0">{formState.errors[`treatmentPlan${i + 1}`]?.message}</FieldError> */}
          </div>
        </div>
      )
    }
    return elements
  }

  const handleSave = () => {
    handleTreatmentPlan()
  }
  // fix any
  const verifySubmit = (e: any) => {
    if (!formState.isDirty) {
      e.preventDefault()
      return
    }

    // setIsTreatmentPlanChanged(true);
    handleSubmit(handleSave)(e)
  }

  return (
    <form onSubmit={verifySubmit} className="relative flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-5 py-3 gap-4 md:gap-8 text-black-1000 dark:text-white">
      {/* {isLoadingTreatmentPlan ? ( */}
      {/* <div className="flex justify-center py-2 absolute z-10 w-full">
          <div className="transform scale-75">
            <Spinner variant={"roller"} />
          </div>
        </div>
      ) : ( */}
      {getTreatmentPlanFields()}
      {/* )} */}
    </form>
  )
}

export default TreatmentPlanTabContent
