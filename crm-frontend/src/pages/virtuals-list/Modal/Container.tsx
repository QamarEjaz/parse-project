import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"

import Modal from "./Modal"

import { PatientQueueItem } from "../WaitingQueue/WaitingQueue.interface"
interface ContainerProps {
  open: boolean
  setOpen: () => void
  patientQueue: PatientQueueItem | null
  setPatientQueue: (val: any) => void // fix any
}

const Container = ({ open, setOpen, patientQueue, setPatientQueue }: ContainerProps): JSX.Element => {
  return (
    <Transition.Root show={open} as={"div"}>
      <Dialog as="div" className="fixed inset-0 overflow-y-auto" style={{ zIndex: 100 }} onClose={setOpen}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:px-4 sm:p-0">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity overlay-dialog" />
          </Transition.Child>

          <Transition.Child
            as={"div"}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Modal patientQueue={patientQueue} setPatientQueue={setPatientQueue}></Modal>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Container
