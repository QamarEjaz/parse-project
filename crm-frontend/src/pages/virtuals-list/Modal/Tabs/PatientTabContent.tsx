import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"

import { formatDate, formatSSN, getName } from "../../../../utils/helpers"
import { GENDER_OPTIONS, PATIENT_STATUS_OPTIONS, TYPE_OPTIONS } from "../../../../utils/SelectOptions"
import { getPatientTypes } from "../../../../Store/Patient/actions"

import CustomSelect from "../../../../components/Inputs/CustomSelect"
import CustomTextArea from "../../../../components/Inputs/CustomTextarea"
import CustomTextField from "../../../../components/Inputs/CustomTextField"
import FieldError from "../../../../components/Feedback/FieldError"
import MultiSelect from "../../../../components/Inputs/MultiSelect"
import Pill from "../../../../components/DataDisplay/Pill"
import Select from "../../../../components/Inputs/Select"

import { IPatient, IProvider } from "./AppointmentTabContent.interface"

interface IPatientTabContentProps {
  isEditing: boolean
  submitRef?: any // fix any
  patient: IPatient
}

const EMPTY_OPTION = {
  id: "0",
  value: "",
  name: "Select",
}

const PatientTabContent = ({ isEditing, submitRef, patient }: IPatientTabContentProps): JSX.Element => {
  // console.log("patient >>>>>>> ", patient)

  const providers = useSelector((state: any) => state?.Appointment?.providers)
  const providerOptions = useMemo(() => providers.map((p: IProvider) => ({ id: p.objectId, value: p.objectId, name: getName(p) })), [providers])
  const primaryProvider = useMemo(() => providers.find((prov: IProvider) => prov?.objectId === patient?.primaryProvider_ascend?.id), [providers, patient?.primaryProvider_ascend?.id])
  const patientTypes = useSelector((state: any) => state?.Patient.patientTypes)

  const primaryProviderOption = primaryProvider
    ? {
        id: primaryProvider.objectId,
        value: primaryProvider.objectId,
        name: `${primaryProvider.firstName} ${primaryProvider.lastName}`,
      }
    : EMPTY_OPTION
  const patientStatusOptions = useMemo(() => [...PATIENT_STATUS_OPTIONS], [])
  const genderOptions = useMemo(() => [...GENDER_OPTIONS], [])
  const typeOptions = useMemo(() => [...patientTypes.map((pt: any) => ({ id: pt.id, value: pt.id, label: pt.attributes?.name }))], [])
  const selectTypeOptions =
    patient?.types?.length &&
    patient?.types?.map((type: { id: number; title: string }) => ({
      id: type?.id,
      value: type?.id.toString(),
      label: type?.title,
    }))

  const dispatch = useDispatch()

  const getNameContent = (): JSX.Element => {
    if (!patient?.firstName) return <NotFilled />
    return <div className="text-sm">{getName(patient)}</div>
  }

  const getAddressContent = (): JSX.Element => {
    if (!patient?.address1) return <NotFilled />
    return (
      <div className="text-sm">
        {patient.address1} {patient.address2}
      </div>
    )
  }

  const getStatusContent = (): JSX.Element => {
    if (!patient?.patientStatus) return <NotFilled />
    return <Pill label={patient?.patientStatus} className="bg-green-300 px-5 text-sm text-green-900"></Pill>
  }

  const getPhoneContent = (): JSX.Element => {
    if (!patient?.phones?.length) return <NotFilled />
    return <div className="text-sm">{patient.phones.map(({ number }: { number: string }) => number).join(", ")}</div>
  }

  const getGenderContent = (): JSX.Element => {
    if (!patient?.gender) return <NotFilled />
    return <div className="text-sm">{genderOptions.find((gp) => gp.value === patient.gender)?.name}</div>
  }

  const getDateOfBirthContent = (): JSX.Element => {
    if (!patient?.dateOfBirth) return <NotFilled />
    return <div className="text-sm">{formatDate(patient.dateOfBirth, "MM/DD/YYYY")}</div>
  }

  const getSSNContent = (): JSX.Element => {
    if (!patient?.ssn) return <NotFilled />
    return <div className="text-sm">{formatSSN(patient.ssn)}</div>
  }

  const getEmailContent = (): JSX.Element => {
    if (!patient?.emailAddress) return <NotFilled />
    return <div className="text-sm">{patient.emailAddress}</div>
  }

  const getPrimaryProviderContent = (): JSX.Element => {
    if (!primaryProvider) return <NotFilled />
    return <div className="text-sm">{getName(primaryProvider)}</div>
  }

  const getTypeContent = (): JSX.Element => {
    if (!patient?.types?.length) return <NotFilled />
    return <div className="mt-2 overflow-hidden text-ellipsis text-sm whitespace-nowrap">{patient.types.map((type: any) => type?.title).join(", ")}</div>
  }

  const getLevelNeedsContent = (): JSX.Element => {
    if (!patient?.levelNeeds) return <NotFilled />
    return <div className="mt-2 overflow-hidden text-ellipsis text-sm whitespace-nowrap">{patient.levelNeeds}</div>
  }

  const getSocialHistoryContent = (): JSX.Element => {
    if (!patient?.socialHistory) return <NotFilled />
    return <div className="mt-2 overflow-hidden text-ellipsis text-sm whitespace-nowrap">{patient.socialHistory}</div>
  }

  let phone = useMemo(() => patient.phones.find((p: any) => p.phoneType === "MOBILE"), [patient.phones])

  const { control, getValues, handleSubmit, formState, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: patient?.firstName || "",
      lastName: patient?.lastName || "",
      gender: {
        id: patient?.gender || "1",
        value: patient?.gender || "",
        name: genderOptions.find((gender) => gender?.value === patient?.gender)?.name || "Select",
      },
      email: patient?.emailAddress || "",
      phone: phone ? phone.number : "",
      patientStatus: {
        id: patientStatusOptions.find((status) => status.value === patient.patientStatus)?.id || "1",
        name: patient?.patientStatus || "Select",
        value: patient?.patientStatus || "",
      },
      dateOfBirth: patient?.dateOfBirth || "",
      ssn: patient?.ssn || "",
      address: patient?.address1 || "",
      address2: patient?.address2 || "",
      levelNeeds: patient?.levelNeeds || "",
      socialHistory: patient?.socialHistory || "",
      type: selectTypeOptions,
      primaryProvider: primaryProviderOption,
    },
  })

  const onSubmit = (e: any): void => {
    console.log("Form Submitted >>> Patient <<<", getValues())
  }

  // fix any
  const verifySubmit = (e: any): void => {
    // if (!formState.isDirty) {
    //   e.preventDefault()
    //   window.alert("Please make a change to a field.")
    //   return
    // }

    handleSubmit(onSubmit)(e)
  }

  useEffect(() => {
    dispatch(getPatientTypes())
  }, [])

  return (
    <form onSubmit={verifySubmit} className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-5 py-6">
      <button type="submit" className="hidden" ref={submitRef}></button>

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Name</div>
        <div className="relative mt-2">
          <Controller
            name="firstName"
            control={control}
            rules={{
              required: "First name is required",
              validate: () => (getValues("firstName").length > 25 ? "First name should be maximum 25 character long" : true),
            }}
            render={({ field }): JSX.Element => {
              let { onChange, name, value } = field
              return <CustomTextField editMode={isEditing} id={`firstName`} name={name} value={value} onChange={onChange} content={getNameContent()} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.firstName?.message}</FieldError>
        </div>
      </div>

      {isEditing && (
        <div className="text-sm dark:text-white">
          <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Last name</div>
          <div className="relative mt-2">
            <Controller
              name={`lastName`}
              control={control}
              rules={{
                required: "Last name is required",
                validate: () => (getValues("lastName").length > 25 ? "Last name should be maximum 25 character long" : true),
              }}
              render={({ field }): JSX.Element => {
                let { onChange, name, value } = field
                return <CustomTextField editMode={isEditing} id={`lastName`} name={name} value={value} onChange={onChange} content={<></>} />
              }}
            />
            <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.lastName?.message}</FieldError>
          </div>
        </div>
      )}

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Email</div>
        <div className={`relative mt-2`}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              validate: () => (getValues("email").length > 60 ? "Email should be maximum 60 character long" : !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(getValues("email")) ? "Email is invalid" : true),
            }}
            render={({ field }): JSX.Element => {
              let { onChange, name, value } = field
              return <CustomTextField editMode={isEditing} type="text" id={`email`} name={name} value={value} onChange={onChange} content={getEmailContent()} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.email?.message}</FieldError>
        </div>
      </div>

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Phone</div>
        <div className={`relative mt-2`}>
          <Controller
            name={"phone"}
            control={control}
            rules={{
              required: "Phone is required",
              validate: () => (getValues("phone").length < 10 ? "Phone should be 10 digit long" : true),
            }}
            render={({ field }) => {
              let { onChange, name, value } = field
              return <CustomTextField type="number" editMode={isEditing} id={`phone`} name={name} value={value} onChange={onChange} content={getPhoneContent()} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.phone?.message}</FieldError>
        </div>
      </div>

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Address</div>
        <div className="relative mt-2">
          <Controller
            name={"address"}
            control={control}
            rules={{
              required: "Address is required",
              validate: () => (getValues("address").length > 60 ? "Address should be maximum 60 character long" : true),
            }}
            render={({ field }): JSX.Element => {
              let { onChange, name, value } = field
              return <CustomTextField editMode={isEditing} id={`address`} name={name} value={value} onChange={onChange} content={getAddressContent()} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.address?.message}</FieldError>
        </div>
      </div>

      {isEditing && (
        <div className="text-sm dark:text-white">
          <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Address line 2</div>
          <div className="relative mt-2">
            <Controller
              name={"address2"}
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }): JSX.Element => {
                let { onChange, name, value } = field
                return <CustomTextField editMode={isEditing} id={`address2`} name={name} value={value} onChange={onChange} content={<></>} />
              }}
            />
            <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.address?.message}</FieldError>
          </div>
        </div>
      )}

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Patient Status</div>
        <div className="relative mt-2">
          <Controller
            name="patientStatus"
            control={control}
            rules={{ required: "patientStatus is required" }}
            render={({ field }): JSX.Element => {
              let { onChange, name, value } = field
              return <CustomSelect options={patientStatusOptions} defaultValue="0" value={value} onChange={onChange} content={getStatusContent()} editMode={isEditing} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.patientStatus?.message}</FieldError>
        </div>
      </div>

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Gender</div>
        <div className="relative mt-2">
          {isEditing ? (
            <>
              <Controller
                name="gender"
                control={control}
                rules={{
                  required: "Gender is required",
                  validate: () => (!getValues("gender").value ? "Gender is required" : true),
                }}
                render={({ field }): JSX.Element => {
                  let { name, value, onChange } = field
                  return (
                    <Select
                      options={genderOptions}
                      value={value}
                      onChange={(selected): void => {
                        if (selected.value === value.value) return
                        onChange(selected)
                      }}
                    />
                  )
                }}
              />
              <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors?.gender?.message}</FieldError>
            </>
          ) : (
            getGenderContent()
          )}
        </div>
      </div>

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Date of Birth</div>
        <div className="relative mt-2">
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{
              required: "Date of birth is required",
            }}
            render={({ field }): JSX.Element => {
              let { onChange, name, value } = field
              return <CustomTextField editMode={isEditing} type="date" id={`dob`} name={name} value={value} onChange={onChange} content={getDateOfBirthContent()} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.dateOfBirth?.message}</FieldError>
        </div>
      </div>

      {!isEditing && (
        <>
          <div className="text-sm dark:text-white">
            <div className="text-xs font-normal dark:text-gray-300 text-gray-600">First Visit</div>
            <div className="relative mt-2">{patient?.firstVisitDate ? formatDate(patient?.firstVisitDate, "MM/DD/YYYY") : "Not filled"}</div>
          </div>

          <div className="text-sm dark:text-white">
            <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Last Visit</div>
            <div className="relative mt-2">{patient?.lastVisitDate ? formatDate(patient?.lastVisitDate, "MM/DD/YYYY") : "Not filled"}</div>
          </div>
        </>
      )}

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Social Security #</div>
        <div className="relative mt-2">
          <Controller
            name="ssn"
            control={control}
            rules={{
              required: "Social Security # is required",
            }}
            render={({ field }): JSX.Element => {
              let { onChange, name, value } = field
              return <CustomTextField editMode={isEditing} type="number" id={`ssn`} name={name} value={value} onChange={onChange} content={getSSNContent()} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.ssn?.message}</FieldError>
        </div>
      </div>

      <div className="text-sm dark:text-white col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Primary Provider</div>
        <div className="relative mt-2">
          <Controller
            name="primaryProvider"
            control={control}
            rules={{ required: "Primary Provider is required" }}
            render={({ field }): JSX.Element => {
              let { onChange, name, value } = field
              return <CustomSelect editMode={isEditing} content={getPrimaryProviderContent()} options={providerOptions} value={value} onChange={onChange} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.primaryProvider?.message}</FieldError>
        </div>
      </div>

      <div className="relative col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Type</div>
        <div className="relative mt-2">
          {isEditing ? (
            <Controller
              name="type"
              control={control}
              render={({ field }): JSX.Element => {
                let { onChange, value } = field
                return (
                  <div className="mt-2">
                    <MultiSelect backgroundColor="#fff" border="1px solid #d1d5db" borderRadius="6px" menuBorderRadius="6px" options={typeOptions} isClearable={false} value={value} onChange={onChange} />
                  </div>
                )
              }}
            />
          ) : (
            getTypeContent()
          )}
        </div>
      </div>

      <div className="text-sm dark:text-white col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Level 4 Needs</div>
        <div className="relative mt-1">
          <Controller
            name="levelNeeds"
            control={control}
            rules={{ required: false }}
            render={({ field }): JSX.Element => {
              let { onChange, name, value } = field
              return <CustomTextArea editMode={isEditing} id="levelNeeds" value={value} onChange={onChange} rows={3} content={getLevelNeedsContent()} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.levelNeeds?.message}</FieldError>
        </div>
      </div>

      <div className="text-sm dark:text-white col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Social History</div>
        <div className="relative mt-1">
          <Controller
            name="socialHistory"
            control={control}
            rules={{ required: false }}
            render={({ field }) => {
              let { onChange, name, value } = field
              return <CustomTextArea editMode={isEditing} id="socialHistory" value={value} onChange={onChange} rows={3} content={getSocialHistoryContent()} />
            }}
          />
          <FieldError className="absolute -bottom-6 left-0 capitalize">{formState.errors.socialHistory?.message}</FieldError>
        </div>
      </div>
    </form>
  )
}

export default PatientTabContent

const NotFilled = (): JSX.Element => {
  return <div className="text-sm">Not filled</div>
}
