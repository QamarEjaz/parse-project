import React, { useEffect, useState } from "react"
import { Fragment, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog as DialogHeadlessUI, Transition } from "@headlessui/react"
import { Controller, useForm } from "react-hook-form"

import TextField from "../../Inputs/TextField"
import Button from "../../Inputs/Button"
import { IDialogProps } from "./Dialog.interfaces"
import { addPeople } from "../../../Store/PeopleManagement/actions"
import { getLocation } from "../../../Store/Appointment/actions"
import MultiSelect from "../../Inputs/MultiSelect"
import { IOption } from "../../Inputs/MultiSelect/MultiSelect.interfaces"
import useMultiSelectOptions from "../../../hooks/useMultiSelectOptions"
import { validateEmail } from "utils/helpers"

import "../../../index.css"

const Dialog = ({ title, open, setOpen, primaryButtonText, secondaryButtonText }: IDialogProps): JSX.Element => {
  const cancelButtonRef = useRef<HTMLDivElement>(null)
  const refDiv = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  // const [locationArrayState, setLocationArrayState] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const appointment = useSelector((state: any) => state?.Appointment)
  const [locationArrayState] = useMultiSelectOptions(appointment?.locations)

  interface AddPeopleForm {
    name: string
    username: string
    email: string
    phone1: string
    startDate: Date | string
    peopleSets: []
    locations: IOption[]
    departments: IOption[]
    managers: IOption[]
  }

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPeopleForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone1: "",
      startDate: "",
      peopleSets: [],
      locations: [],
      departments: [],
      managers: [],
    },
  })

  const onSubmit = (): void => {
    const { name, username, email, phone1, startDate, peopleSets, departments, managers } = getValues()

    dispatch(
      addPeople({
        name: name,
        username: username,
        email: email,
        phone1: phone1,
        peopleSets: peopleSets,
        startDate: startDate,
        departments: departments,
        managers: managers,
        setLoading: setLoading,
        resetForm: reset,
      })
    )
  }

  useEffect(() => {
    dispatch(getLocation())
  }, [])

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
                      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 items-center">
                        <Controller
                          name="name"
                          control={control}
                          rules={{ required: "Name is required", validate: () => (getValues("name").length > 25 ? "Name should be maximum 25 character long" : true) }}
                          render={({ field }): JSX.Element => {
                            let { onChange, name, value } = field
                            return <TextField name={name} error={errors.name ? true : false} helperText={errors.name?.message} label="Name *" type="text" autoComplete="name" id="name" onChange={onChange} value={value} />
                          }}
                        />
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            required: "Email is required",
                            validate: () => (getValues("email").length > 60 ? "Email should be maximum 60 character long" : (getValues("email").length > 0 ? !validateEmail(getValues("email")) : false) ? "Email is invalid" : true),
                          }}
                          render={({ field }): JSX.Element => {
                            let { onChange, name, value } = field
                            return <TextField name={name} error={errors.email ? true : false} helperText={errors.email?.message} label="Email *" type="email" autoComplete="email" id="email" onChange={onChange} value={value} />
                          }}
                        />

                        <Controller
                          name="username"
                          control={control}
                          render={({ field }): JSX.Element => {
                            let { onChange, name, value } = field
                            return <TextField name={name} error={errors.username ? true : false} helperText={errors.username?.message} type="text" autoComplete="username" id="username" onChange={onChange} value={value} />
                          }}
                        />

                        <Controller
                          name="phone1"
                          control={control}
                          rules={{
                            required: "Phone is required",
                            validate: () => (getValues("phone1").length < 10 ? "Phone should be 10 digit long" : true),
                          }}
                          render={({ field }): JSX.Element => {
                            let { onChange, name, value } = field
                            return <TextField name={name} error={errors.phone1 ? true : false} helperText={errors.phone1?.message} label="Mobile *" type="number" autoComplete="phone1" id="phone1" onChange={onChange} value={value} />
                          }}
                        />

                        <Controller
                          name="startDate"
                          control={control}
                          rules={{ required: "Date is required" }}
                          render={({ field }): JSX.Element => {
                            let { onChange, name, value } = field
                            return <TextField name={name} error={errors.startDate ? true : false} helperText={errors.startDate?.message} label="Start Date" type="date" autoComplete="startDate" id="startDate" onChange={onChange} value={value} />
                          }}
                        />
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
                      <div>
                        <label className="input-label">Add Manager</label>
                        <div className="mt-1">
                          <Controller
                            name="managers"
                            control={control}
                            render={({ field }): JSX.Element => {
                              let { onChange, value } = field
                              return <MultiSelect valueContainerType="boxed" backgroundColor="#fff" border="1px solid #d1d5db" borderRadius="6px" menuBorderRadius="6px" isDark={false} options={locationArrayState} value={value} isClearable={false} onChange={onChange} />
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-3 grid-flow-row-dense">
                        <Button variant="contained" type="submit" color="indigo" className="col-start-2 mt-3 sm:mt-0" loading={loading}>
                          {primaryButtonText}
                        </Button>
                        <Button
                          variant="outlined"
                          color="gray"
                          type="reset"
                          className="col-start-1 mt-3 sm:mt-0"
                          onClick={(): void => {
                            setOpen(false)
                            reset()
                          }}
                        >
                          {secondaryButtonText}
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
