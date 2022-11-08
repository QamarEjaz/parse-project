import { Dialog, Transition } from "@headlessui/react"
import { ExclamationIcon } from "@heroicons/react/outline"
import React, { Fragment, useRef } from "react"
import Button from "../../../../components/Inputs/Button"
import { IConfirmationModalProps } from "./confirmation.interfaces"

const ConfirmationModal = ({ open, operatories, oldOperatory, newOperatory, handleUpdate, handleCancel, newStartTime, newEndTime, oldStartTime, oldEndTime, updateBtnLoading }: IConfirmationModalProps): JSX.Element => {
  const cancelButtonRef = useRef<HTMLDivElement>(null)
  const refDiv = useRef<HTMLDivElement>(null)

  const showTimeInfo = (): JSX.Element => {
    if (new Date(oldEndTime || "").toLocaleTimeString() !== new Date(newEndTime || "").toLocaleTimeString() || new Date(newStartTime || "").toLocaleTimeString() !== new Date(oldStartTime || "").toLocaleTimeString()) {
      return (
        <div>
          <h4 className="font-medium">Time Range</h4>
          <p className="text-sm mt-0.5">
            Start Time: {new Date(oldStartTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {"=>"} {new Date(newStartTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-sm mt-0.5">
            End Time: {new Date(oldEndTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {"=>"} {new Date(newEndTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      )
    } else {
      return <></>
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-y-auto" initialFocus={cancelButtonRef.current ? cancelButtonRef : refDiv} onClose={handleCancel} style={{ zIndex: 100 }}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0" ref={refDiv}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity overlay-dialog" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-black-700 rounded-lg space-y-3 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-black-800 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationIcon className="h-6 w-6 text-red-600 dark:text-black-200" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Update appointment
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-200">Are you sure you want to update the appointment?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-5 mb-1">
                    {oldOperatory?.objectId !== newOperatory?.objectId ? (
                      <div>
                        <h4 className="font-medium">Operatory</h4>
                        <p className="text-sm mt-0.5">
                          {operatories.find((opt) => oldOperatory?.objectId === opt.objectId)?.shortName}
                          {" => "}
                          {operatories.find((opt) => newOperatory?.objectId === opt.objectId)?.shortName}
                        </p>
                      </div>
                    ) : null}

                    {showTimeInfo()}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <div>
                  <Button className="w-32 ml-3" variant="contained" color="red" onClick={handleUpdate} loading={updateBtnLoading}>
                    Yes
                  </Button>
                </div>
                <div>
                  <Button className="w-32" variant="outlined" color="gray" onClick={handleCancel}>
                    No
                  </Button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ConfirmationModal
