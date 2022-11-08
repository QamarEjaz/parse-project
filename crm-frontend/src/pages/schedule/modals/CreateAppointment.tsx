import { useState } from "react"

import General from "./general"
import PatientSelect from "../../../components/Inputs/PatientSelect"
import CreatePatient from "../../../components/Forms/CreatePatient"

import { XIcon } from "@heroicons/react/solid"
import Button from "../../../components/Inputs/Button"
import IconButton from "../../../components/Inputs/IconButton"
import Icon from "../../../components/DataDisplay/Icon"
import { ChevronLeftIcon } from "@heroicons/react/outline"
import { IPatient } from "../../../components/Inputs/PatientSelect/PatientSelect.interfaces"
import { IAppointment, ICellData } from "../schedule-template/Template.interfaces"
import { Operatory } from "../../../Types/OperatoryTypes"

interface IAppointmentPopupProps {
  location: any
  setIsCreatingAppt: (val: boolean) => void
  selectedAppt: IAppointment | null
  selectedCell: ICellData | null
  setSelectedAppt: React.Dispatch<React.SetStateAction<IAppointment | null>>
  setSelectedCell: React.Dispatch<React.SetStateAction<ICellData | null>>
  operatories: Operatory[]
}

const AppointmentPopup = ({ location, setIsCreatingAppt, selectedAppt, setSelectedAppt, operatories, selectedCell, setSelectedCell }: IAppointmentPopupProps): JSX.Element => {
  const [isCreatingPatient, setIsCreatingPatient] = useState(false)

  const [patient, setPatient] = useState<IPatient | null>(selectedAppt?.patient || null)

  const handleClose = (): void => {
    setIsCreatingAppt(false)
    setSelectedAppt(null)
    setSelectedCell(null)
  }
  const handleBack = (): void => {
    setIsCreatingPatient(false)
    setPatient(null)
    setSelectedAppt(null)
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full z-40 max-h-screen">
      {!patient && !isCreatingPatient ? (
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Close Button */}
          {isCreatingPatient ? (
            <div className="absolute top-3 left-3 z-40">
              <div className="hidden lg:block">
                <IconButton size="xl" className="dark:bg-black-800  hover:bg-gray-100 dark:hover:bg-black-900" onClick={handleClose}>
                  <ChevronLeftIcon className="text-gray-600 dark:text-white" />
                </IconButton>
              </div>
              <div className="lg:hidden">
                <IconButton size="lg" className="border bg-white dark:border-transparent dark:bg-black-800  hover:bg-gray-100 dark:hover:bg-black-900" onClick={handleClose}>
                  <ChevronLeftIcon className="text-gray-600 dark:text-white" />
                </IconButton>
              </div>
            </div>
          ) : null}
          <div>
            <div className="absolute w-full h-full inset-0 bg-gray-500 bg-opacity-75 transition-opacity overlay-dialog" onClick={handleClose}></div>
          </div>
          <div className="my-16 space-y-2 flex flex-col max-w-lg px-5 lg:my-20 lg:px-0 mx-auto items-center">
            <div className="w-full">
              <PatientSelect className="border-none py-3" onChange={(patient) => setPatient(patient)} />
            </div>
            <div className="w-full">
              <Button variant="contained" className="w-full" color="gray-dark" onClick={() => setIsCreatingPatient(true)}>
                Create a new patient
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white h-full relative">
          {/* Close Button */}
          <>
            {isCreatingPatient ? (
              <div className="absolute top-3 left-3 z-40">
                <div className="hidden lg:block">
                  <IconButton size="xl" className=" dark:bg-black-800  hover:bg-gray-100 dark:hover:bg-black-900" onClick={handleBack}>
                    <ChevronLeftIcon className="text-gray-600 dark:text-white" />
                  </IconButton>
                </div>
                <div className="lg:hidden">
                  <IconButton size="lg" className="border bg-white dark:border-transparent  dark:bg-black-800  hover:bg-gray-100 dark:hover:bg-black-900" onClick={handleBack}>
                    <ChevronLeftIcon className="text-gray-600 dark:text-white" />
                  </IconButton>
                </div>
              </div>
            ) : null}
            <div className="absolute top-3 right-3 z-40">
              <div className="hidden lg:block">
                <IconButton size="xl" className="bg-white dark:bg-black-800  hover:bg-gray-100 dark:hover:bg-black-900" onClick={handleClose}>
                  <XIcon className="text-gray-600 dark:text-white" />
                </IconButton>
              </div>
              <div className="lg:hidden">
                <IconButton size="lg" className="border dark:border-transparent bg-white dark:bg-black-800  hover:bg-gray-100 dark:hover:bg-black-900" onClick={handleClose}>
                  <XIcon className="text-gray-600 dark:text-white" />
                </IconButton>
              </div>
            </div>
          </>

          {/* Content Area */}
          <div className={`h-full flex flex-col dark:bg-black-700 dark:text-white bg-white shadow-xl overflow-y-auto relative ${isCreatingPatient ? "pt-10 md:pt-0" : ""}`}>
            {isCreatingPatient ? <CreatePatient handleClose={handleClose} /> : <General location={location} operatories={operatories} selectedCell={selectedCell} appointment={selectedAppt} patient={patient} handleClose={handleClose} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentPopup
