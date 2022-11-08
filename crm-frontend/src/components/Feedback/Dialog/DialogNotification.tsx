import React, { useEffect, useState } from "react"
import { Fragment, useRef } from "react"
import { useDispatch } from "react-redux"
import { Dialog as DialogHeadlessUI, Transition } from "@headlessui/react"
import { Controller, useForm } from "react-hook-form"
import { getLocation } from "../../../Store/Appointment/actions"

import TextField from "../../Inputs/TextField"
import Button from "../../Inputs/Button"
import { IDialogProps } from "./Dialog.interfaces"
import Radio from "../../Inputs/Radio"
import Textarea from "../../Inputs/Textarea"
import FieldError from "../FieldError"

import "../../../index.css"

const Dialog = ({ title, open, setOpen }: IDialogProps): JSX.Element => {
  const cancelButtonRef = useRef<HTMLDivElement>(null)
  const refDiv = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  interface NotificationForm {
    title: string
    message: string
    types: "notify" | "sms" | "both"
  }

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NotificationForm>({
    mode: "onChange",
    defaultValues: {
      title: "",
      message: "",
      types: "notify",
    },
  })

  const onSubmit = (): void => {
    const values = getValues()
    console.log("values: ", values)
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
                      <div>
                        <Controller
                          name="title"
                          control={control}
                          rules={{ required: "Title is required" }}
                          render={({ field }): JSX.Element => {
                            let { onChange, name, value } = field
                            return <TextField name={name} error={errors.title ? true : false} helperText={errors.title?.message} label="Title *" type="text" autoComplete="title" id="title" onChange={onChange} value={value} />
                          }}
                        />
                      </div>
                      <div>
                        <Controller
                          name="message"
                          control={control}
                          rules={{ required: "Message is required" }}
                          render={({ field }): JSX.Element => {
                            let { onChange, name, value } = field
                            return <Textarea name={name} error={errors.message ? true : false} helperText={errors.message?.message} label="Message *" id="message" rows={4} onChange={onChange} value={value} />
                          }}
                        />
                      </div>
                      <div>
                        <Controller
                          name="types"
                          control={control}
                          rules={{ required: "Type is required" }}
                          render={({ field }): JSX.Element => {
                            let { name, value, onChange } = field
                            return (
                              <fieldset {...field}>
                                <div className="flex space-x-4">
                                  <Radio title="Notify" id="notify" name={name} value="notify" checked={value === "notify" ? true : false} onChange={onChange} />
                                  <Radio title="SMS" id="sms" name={name} value="sms" checked={value === "sms" ? true : false} onChange={onChange} />
                                  <Radio title="Both" id="both" name={name} value="both" checked={value === "both" ? true : false} onChange={onChange} />
                                </div>
                              </fieldset>
                            )
                          }}
                        />
                        <FieldError className="absolute -bottom-6 left-0">{errors?.types?.message}</FieldError>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outlined" color="gray" onClick={(): void => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button loading={false} type="submit" variant="contained" color="gray-dark">
                          Send
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
