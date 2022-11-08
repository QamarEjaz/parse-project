import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../Inputs/Button"
import Radio from "../../Inputs/Radio"
import Select from "../../Inputs/Select"
import TextField from "../../Inputs/TextField"
import { Controller, useForm } from "react-hook-form"
import FieldError from "components/Feedback/FieldError"
import { ICreatePatientProps } from "./CreatePatient.interfaces"
import { registerPatient } from "../../../Store/Patient/actions"
import { getLocation } from "../../../Store/Appointment/actions"

import { CONTACT_METHOD_OPTIONS, LANGUAGE_TYPE_OPTIONS, PATIENT_STATUS_OPTIONS, STATE_OPTIONS } from "utils/SelectOptions"
import { validateEmail } from "utils/helpers"

const selectDefaultValue = { id: "0", value: "", name: "Select" }
const CreatePatient = ({ handleClose }: ICreatePatientProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)
  const [locationArrayState, setLocationArrayState] = useState([])
  const dispatch = useDispatch()

  const locations = useSelector((state: any) => state?.Appointment?.locations)

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      contactMethod: selectDefaultValue,
      email: "",
      phone: "",
      languageType: selectDefaultValue,
      patientStatus: selectDefaultValue,
      dateOfBirth: "",
      ssn: "",
      postalCode: "",
      city: "",
      state: selectDefaultValue,
      address: "",
      location: selectDefaultValue,
      status: "",
    },
  })

  const onSubmit = (): void => {
    setIsLoading(true)
    const values = getValues()
    dispatch(
      registerPatient({
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        contactMethod: values.contactMethod.value,
        email: values.email,
        phone: values.phone,
        languageType: values.languageType.value,
        patientStatus: values.patientStatus.value,
        dateOfBirth: values.dateOfBirth,
        ssn: values.ssn,
        postalCode: values.postalCode,
        city: values.city,
        state: values.state.value,
        address: values.address,
        location: values.location.value,
        setIsLoading: setIsLoading,
        handleClose: handleClose,
      })
    )
  }

  useEffect(() => {
    dispatch(getLocation())
  }, [])

  useEffect(() => {
    const locationArray = locations?.map((location: any, index: number) => {
      return {
        id: index.toString(),
        value: location.id,
        name: location.attributes?.name,
      }
    })
    setLocationArrayState(locationArray)
  }, [locations])

  return (
    <form noValidate className="flex-1 flex flex-col dark:bg-black-700 bg-white w-full overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex-1 w-full max-w-3xl mx-auto ">
        <div className="py-6 space-y-6 sm:py-0 sm:space-y-0 divide-y divide-gray-200">
          <div className="space-y-2 px-4 sm:space-y-3 sm:px-6 sm:py-5">
            <div>
              <h1 className="block text-sm font-medium dark:text-white text-gray-900 sm:mt-px sm:pt-2">Create New Patient</h1>
            </div>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 items-center">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required", validate: () => (getValues("firstName").length > 25 ? "First name should be maximum 25 character long" : true) }}
                render={({ field }): JSX.Element => {
                  let { onChange, name, value } = field
                  return <TextField name={name} error={errors.firstName ? true : false} helperText={errors.firstName?.message} label="First name" type="text" autoComplete="firstName" id="firstName" onChange={onChange} value={value} />
                }}
              />
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required", validate: () => (getValues("lastName").length > 25 ? "Last name should be maximum 25 character long" : true) }}
                render={({ field }): JSX.Element => {
                  let { onChange, name, value } = field
                  return <TextField name={name} error={errors.lastName ? true : false} helperText={errors.lastName?.message} label="Last name" type="text" autoComplete="lastName" id="lastName" onChange={onChange} value={value} />
                }}
              />
              <div className="col-span-2 relative capitalize">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }): JSX.Element => {
                    let { name } = field
                    return (
                      <fieldset {...field}>
                        <div className="flex space-x-4">
                          <Radio title="Male" id="male" name={name} value="M" />
                          <Radio title="Female" id="female" name={name} value="F" />
                          <Radio title="Other" id="other" name={name} value="O" />
                        </div>
                      </fieldset>
                    )
                  }}
                />
                <FieldError className="absolute -bottom-6 left-0">{errors?.gender?.message}</FieldError>
              </div>

              <Controller
                name="contactMethod"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <Select label="Contact Method" error={errors.contactMethod ? true : false} helperText={errors.contactMethod?.message} options={CONTACT_METHOD_OPTIONS} value={value ? value : selectDefaultValue} onChange={onChange} />
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
                  return <TextField error={errors?.email ? true : false} helperText={errors?.email?.message} label="Email" type="email" autoComplete="email" id="email" name={name} value={value} onChange={onChange} />
                }}
              />

              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Phone is required",
                  validate: () => (getValues("phone").length < 10 ? "Phone should be 10 digit long" : true),
                }}
                render={({ field }): JSX.Element => {
                  let { onChange, name, value } = field
                  return <TextField error={errors?.phone ? true : false} helperText={errors?.phone?.message} label="Phone" type="number" autoComplete="phone" id="phone" name={name} value={value} onChange={onChange} />
                }}
              />
              <Controller
                name="languageType"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <Select error={errors?.languageType ? true : false} helperText={errors?.languageType?.message} label="Language Type" options={LANGUAGE_TYPE_OPTIONS} value={value} onChange={onChange} />
                }}
              />

              <Controller
                name="patientStatus"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <Select error={errors?.patientStatus ? true : false} helperText={errors?.patientStatus?.message} label="Patient Status" value={value} options={PATIENT_STATUS_OPTIONS} onChange={onChange} />
                }}
              />
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, name, value } = field
                  return <TextField error={errors?.dateOfBirth ? true : false} helperText={errors?.dateOfBirth?.message} label="Date of birth" type="date" autoComplete="dob" id="dob" name={name} value={value} onChange={onChange} />
                }}
              />
              <Controller
                name="ssn"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, name, value } = field
                  return <TextField error={errors?.ssn ? true : false} helperText={errors?.ssn?.message} label="SSN" type="number" autoComplete="ssn" id="ssn" name={name} value={value} onChange={onChange} />
                }}
              />
              <Controller
                name="postalCode"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, name, value } = field
                  return <TextField error={errors?.postalCode ? true : false} helperText={errors?.postalCode?.message} label="Postal Code" type="number" autoComplete="postal-code" id="postal-code" name={name} value={value} onChange={onChange} />
                }}
              />
              <Controller
                name="city"
                control={control}
                rules={{
                  validate: () => (getValues("city").length > 30 ? "City should be maximum 30 character long" : true),
                }}
                render={({ field }): JSX.Element => {
                  let { onChange, name, value } = field
                  return <TextField error={errors?.city ? true : false} helperText={errors?.city?.message} label="City" type="text" autoComplete="city" id="city" name={name} value={value} onChange={onChange} />
                }}
              />
              <Controller
                name="state"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <Select error={errors?.state ? true : false} helperText={errors?.state?.message} label="State" options={STATE_OPTIONS} value={value} onChange={onChange} />
                }}
              />
              <Controller
                name="address"
                control={control}
                rules={{
                  validate: () => (getValues("address").length > 60 ? "Address should be maximum 60 character long" : true),
                }}
                render={({ field }): JSX.Element => {
                  let { onChange, name, value } = field
                  return <TextField error={errors?.address ? true : false} helperText={errors?.address?.message} label="Address" type="text" autoComplete="address" id="address" name={name} value={value} onChange={onChange} />
                }}
              />
              <Controller
                name="location"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <Select error={errors?.location ? true : false} helperText={errors?.location?.message} label="Location" value={value} options={locationArrayState} onChange={onChange} />
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="sticky bottom-0 z-10 flex-shrink-0 px-4 bg-white dark:bg-black-800 border-t border-gray-200 dark:border-black-900 py-5 sm:px-6">
        <div className="space-x-3 flex justify-end">
          <Button className="" color="gray" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={isLoading} type="submit" color="gray-dark" variant="contained">
            Create
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreatePatient
