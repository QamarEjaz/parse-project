import React, { useEffect, useState } from "react"
import { Fragment, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog as DialogHeadlessUI, Transition } from "@headlessui/react"
import { Controller, useForm } from "react-hook-form"

import TextField from "../../Inputs/TextField"
import Button from "../../Inputs/Button"
import Checkbox from "../../Inputs/Checkbox"
import { IDialogProps } from "./Dialog.interfaces"
import { addPeopleSet } from "../../../Store/PeopleManagement/actions"
import { getLocation } from "../../../Store/Appointment/actions"
import MultiSelect from "../../Inputs/MultiSelect"
import { IOption } from "../../Inputs/MultiSelect/MultiSelect.interfaces"
import useMultiSelectOptions from "../../../hooks/useMultiSelectOptions"

import "../../../index.css"

const Dialog = ({ title, open, setOpen, primaryButtonText }: IDialogProps): JSX.Element => {
  const cancelButtonRef = useRef<HTMLDivElement>(null)
  const refDiv = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const appointment = useSelector((state: any) => state?.Appointment)
  const [locationArrayState] = useMultiSelectOptions(appointment?.locations)

  interface AddPeopleSetForm {
    name: string
    features: string[]
    locations: IOption[]
    departments: IOption[]
  }

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPeopleSetForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      features: [],
      locations: [],
      departments: [],
    },
  })

  const onSubmit = (): void => {
    const { name, features, locations, departments } = getValues()
    console.log("values: ", { name, features, locations, departments })

    dispatch(
      addPeopleSet({
        name: name,
        features: features,
        locations: locations,
        departments: departments,
        setLoading: setLoading,
        resetForm: reset,
      })
    )
  }

  useEffect(() => {
    dispatch(getLocation())
  }, [])

  let [state, setState] = useState(true)
  const handleRowSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState(event?.target?.checked)
  }

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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div>
                    <DialogHeadlessUI.Title as="h3" className="mb-5 text-lg leading-6 font-medium dark:text-white text-gray-900">
                      {title}
                    </DialogHeadlessUI.Title>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 items-center">
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required", validate: () => (getValues("name").length > 25 ? "Username should be maximum 25 character long" : true) }}
                        render={({ field }): JSX.Element => {
                          let { onChange, name, value } = field
                          return <TextField name={name} error={errors.name ? true : false} helperText={errors.name?.message} label="Name *" type="text" autoComplete="name" id="name" onChange={onChange} value={value} />
                        }}
                      />
                      <div className="w-full">
                        <label className="flex mb-1">
                          <span className="block text-xs font-normal dark:text-white text-gray-600">Features*</span>
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="mr-5 mb-2">
                            <Checkbox label="Virtuals" id="virtuals" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2">
                            <Checkbox label="Schedule" id="schedule" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="View People" id="view-people" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="Create People" id="create-people" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="Edit People" id="edit-people" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="View Patient" id="view-patient" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="Create Paitent" id="create-paitent" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="Edit Patient" id="edit-patient" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="Create Appointment" id="create-appointment" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="Edit Appointment" id="edit-appointment" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                          <div className="mr-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <Checkbox label="View Appointment" id="view-appointment" name="features" onChange={(event): void => handleRowSelect(event)} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="input-label">Add Location</label>
                        <div className="mt-1">
                          <Controller
                            name="locations"
                            control={control}
                            render={({ field }): JSX.Element => {
                              let { onChange, value } = field
                              return <MultiSelect valueContainerType="boxed" backgroundColor="#fff" border="1px solid #d1d5db" borderRadius="6px" menuBorderRadius="6px" isDark={false} options={locationArrayState} value={value} isClearable={false} onChange={onChange} />
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="input-label">Add Department</label>
                        <div className="mt-1">
                          <Controller
                            name="departments"
                            control={control}
                            render={({ field }): JSX.Element => {
                              let { onChange, value } = field
                              return <MultiSelect valueContainerType="boxed" backgroundColor="#fff" border="1px solid #d1d5db" borderRadius="6px" menuBorderRadius="6px" isDark={false} options={locationArrayState} value={value} isClearable={false} onChange={onChange} />
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-start-1 mt-2 ">
                        <Button variant="contained" type="submit" color="indigo" className="col-start-6 mt-6 sm:mt-0 w-full" loading={loading}>
                          {primaryButtonText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </DialogHeadlessUI>
    </Transition.Root>
  )
}

export default Dialog
