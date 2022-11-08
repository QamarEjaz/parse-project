import { Fragment, useRef } from "react"
import { Dialog as DialogHeadlessUI, Transition } from "@headlessui/react"

import Button from "../../Inputs/Button"
import { IDialogProps } from "./Dialog.interfaces"
import { ExclamationIcon } from "@heroicons/react/outline"

import "../../../index.css"

const Dialog = ({ title, open, setOpen, description, primaryButtonText, secondaryButtonText, onClickPrimaryButton, onClickSecondaryButton, primaryButtonLoading }: IDialogProps): JSX.Element => {
  const cancelButtonRef = useRef<HTMLDivElement>(null)
  const refDiv = useRef<HTMLDivElement>(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <DialogHeadlessUI as="div" className="fixed inset-0 overflow-y-auto" initialFocus={cancelButtonRef.current ? cancelButtonRef : refDiv} onClose={setOpen} style={{ zIndex: 100 }}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0" ref={refDiv}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <DialogHeadlessUI.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity overlay-dialog" />
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
            <div className="max-w-md w-full inline-block align-middle dark:bg-black-700 bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:px-8 sm:py-10">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-black-800 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationIcon className="h-6 w-6 text-red-600 dark:text-black-200" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogHeadlessUI.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {title}
                  </DialogHeadlessUI.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-200">{description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                {primaryButtonText && (
                  <Button variant="contained" color="red" className="ml-3" loading={primaryButtonLoading} onClick={onClickPrimaryButton}>
                    {primaryButtonText}
                  </Button>
                )}
                {secondaryButtonText && (
                  <Button variant="outlined" color="gray" onClick={onClickSecondaryButton}>
                    {secondaryButtonText}
                  </Button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </DialogHeadlessUI>
    </Transition.Root>
  )
}

export default Dialog
