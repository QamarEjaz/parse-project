import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import { Tab } from "@headlessui/react"
import { CheckIcon, PencilIcon, XIcon } from "@heroicons/react/outline"
import classNames from "classnames"

import Button from "../../../components/Inputs/Button"
import Icon from "../../../components/DataDisplay/Icon"

import Patient from "./Patient"
import AppointmentTabContent from "./Tabs/AppointmentTabContent"
import PatientTabContent from "./Tabs/PatientTabContent"
// import TreatmentPlanTabContent from "./Tabs/TreatmentPlanTabContent"

interface ModalProps {
  patientQueue: any // fix any
  // fix any
  setPatientQueue: (val: any) => void
}

const tabItems = { 0: "Appointment", 1: "Patient" }
// const tabItems = { 0: "Appointment", 1: "Patient", 2: "Treatment Plan", 3: "Insurance" } // treatment plan and insurance hidden for now

const Modal = ({ patientQueue, setPatientQueue }: ModalProps): JSX.Element => {
  let navigate = useNavigate()

  const { patient, appointment } = patientQueue
  // const { patient, appointment, operatory } = patientQueue

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // const [treatmentPlans, setTreatmentPlans] = useState([])
  // const [selectedTreatmentPlanId, setSelectedTreatmentPlanId] = useState(null)

  // fix any
  // const treatmentPlanRef = useRef<any>()
  const patientRef = useRef<any>()
  const appointmentRef = useRef<any>()

  const handleEditing = (): void => {
    setIsEditing((prevState) => !prevState)
  }

  const handleSubmit = async (): Promise<void> => {
    if (patientRef?.current?.click) {
      await patientRef?.current?.click()
    }
    if (appointmentRef?.current?.click) {
      await appointmentRef?.current?.click()
    }
    // if (treatmentPlanRef?.current?.click) {
    //   await treatmentPlanRef?.current?.click()
    // }

    // implement backend
    // setTimeout(() => {
    //   setIsEditing(false)
    //   setIsLoading(false)
    // }, 1000)
  }

  const handleJoinVirtual = (): void => {
    navigate(`/virtuals/${patientQueue.id}`)
  }

  return (
    <div className="inline-block align-bottom bg-white dark:bg-black-700 rounded-lg text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-4xl sm:w-full">
      <Patient patient={patient.attributes} />

      <Divider />

      <div className="px-10 mt-2">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex justify-between1 items-center1 mb-5 border-b dark:border-b-black-800">
            {Object.values(tabItems).map((tab: string) => (
              <TabItem key={tab}>{tab}</TabItem>
            ))}
          </Tab.List>

          <Tab.Panels className="overflow-y-auto overflow-x-hidden h-full pb-6 my-3 relative bg-white dark:bg-black-900 flex-1 rounded-lg shadow border border-gray-100 shadow-gray-200 dark:shadow-black-900 dark:border-black-900 overflow-visible">
            <div className="sticky top-0 bg-white dark:bg-black-900 flex justify-between items-center border-b dark:border-b-black-700 py-2 px-4">
              <h2 className="block text-base font-medium dark:text-white text-gray-900">{tabItems[selectedIndex as keyof typeof tabItems]} Details</h2>
              <div className="flex">
                {isEditing ? (
                  <div className="flex space-x-3">
                    <CloseButton onClick={handleEditing} />

                    <CheckButton onClick={handleSubmit} isLoading={isLoading} />
                  </div>
                ) : (
                  <EditButton onClick={handleEditing} />
                )}
              </div>
            </div>

            <Tab.Panel>
              <AppointmentTabContent submitRef={appointmentRef} isEditing={isEditing} patient={patient.attributes} appointment={appointment.attributes} />
            </Tab.Panel>
            <Tab.Panel>
              <PatientTabContent submitRef={patientRef} isEditing={isEditing} patient={patient.attributes} />
            </Tab.Panel>
            {/* <Tab.Panel>
              <TreatmentPlanTabContent isEditing={isEditing} patient={patient} appointment={appointment.attributes} treatmentPlans={treatmentPlans} selectedTreatmentPlanId={selectedTreatmentPlanId} />
            </Tab.Panel>
            <Tab.Panel></Tab.Panel> */}
          </Tab.Panels>
        </Tab.Group>

        <div className="flex flex-col">
          <Button color="indigo" onClick={handleJoinVirtual}>
            Join Virtual Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 p-3 pt-0"></div>
    </div>
  )
}
export default Modal

interface ITabItem {
  children: React.ReactNode
}

const TabItem = ({ children }: ITabItem): JSX.Element => {
  return <Tab className={({ selected }: { selected: boolean }): string => classNames(selected ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", "whitespace-nowrap py-4 px-5 border-b-2 font-medium text-sm")}>{children}</Tab>
}

const Divider = (): JSX.Element => <div className="h-px w-3/4 bg-gray-200 mx-auto dark:bg-black-800"></div>

const EditButton = ({ onClick }: { onClick: () => void }): JSX.Element => (
  <button className="text-gray-700 text-xl flex items-center justify-center p-2 bg-gray-100 dark:bg-black-700 dark:hover:bg-black-1000 dark:text-white rounded-full" onClick={onClick}>
    <Icon icon={PencilIcon}></Icon>
  </button>
)

const CloseButton = ({ onClick }: { onClick: () => void }): JSX.Element => (
  <button className="text-gray-700 text-xl flex items-center justify-center p-2 bg-gray-100 dark:bg-black-700 dark:hover:bg-black-1000 dark:text-white rounded-full" onClick={onClick}>
    <Icon icon={XIcon}></Icon>
  </button>
)

const CheckButton = ({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }): JSX.Element => (
  <button className="text-gray-700 text-xl flex items-center justify-center p-2 bg-gray-100 dark:bg-black-700 dark:hover:bg-black-1000 dark:text-white rounded-full" onClick={onClick}>
    {isLoading ? (
      <svg className="animate-spin h-6 w-6 absolute z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : null}

    <span className={`flex items-center justify-center ${isLoading ? "opacity-0" : ""}`}>
      <Icon icon={CheckIcon}></Icon>
    </span>
  </button>
)
