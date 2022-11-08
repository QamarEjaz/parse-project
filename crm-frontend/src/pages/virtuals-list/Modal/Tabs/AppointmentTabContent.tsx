import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"
import * as Parse from "parse"
import moment from "moment"

import { APPT_STATUS_OPTIONS, getTimeOptions, OPERATORY_OPTIONS, PROVIDER_OPTIONS } from "../../../../utils/SelectOptions"
import { formatDate, getApptHoursDifference, getName, getOptionFromSelect } from "../../../../utils/helpers"

import CustomSelect from "../../../../components/Inputs/CustomSelect"
import CustomTextArea from "../../../../components/Inputs/CustomTextarea"
import CustomTextField from "../../../../components/Inputs/CustomTextField"
import FieldError from "../../../../components/Feedback/FieldError"
import Select from "../../../../components/Inputs/Select"
import Pill from "../../../../components/DataDisplay/Pill"

import { IAppointmentTabContent, IOperatory, IProvider } from "./AppointmentTabContent.interface"

const EMPTY_OPTION = {
  id: "0",
  value: "",
  name: "Select",
}

const AppointmentTabContent = ({ appointment, isEditing, submitRef }: IAppointmentTabContent): JSX.Element => {
  const providers = useSelector((state: any) => state?.Appointment?.providers)
  const selectedProvider = useMemo(() => providers.find((prov: IProvider) => prov?.objectId === appointment?.provider_ascend?.id), [providers, appointment?.provider_ascend?.id])
  const providerOptions = useMemo(() => providers.map((p: IProvider) => ({ id: p.objectId, value: p.objectId, name: getName(p) })), [providers])

  // console.log("Appointment >>>> ", appointment)

  // const [operatories, setOperatories] = useState<IOperatory[]>([]) // fetch from state
  const operatories = useSelector((state: any) => state?.Appointment?.operatories)
  const selectedOperatory = useMemo(() => operatories.find((opt: any) => opt?.objectId === appointment?.operatory_ascend?.id), [operatories, appointment?.operatory_ascend?.id])
  const operatoryOptions = useMemo(() => operatories.map((op: any) => ({ id: op.objectId, value: op.objectId, name: op.shortName })), [operatories])

  // console.log("Operatories >>>>> ", operatoryOptions)

  const appStatusOptions = useMemo(() => APPT_STATUS_OPTIONS.map((status) => ({ id: status.id, value: status.value, name: status.label })), [])
  const timeOptions = useMemo(() => [...getTimeOptions()], [])

  // const [procedures, setProcedures] = useState<IProcedure[]>(appointment?.practice_procedure_models)
  const [fromDate, setFromDate] = useState(formatDate(appointment.start, "YYYY-MM-DD"))
  const [fromTime, setFromTime] = useState(formatDate(appointment.start, "hh:mm A"))
  const [toTime, setToTime] = useState(formatDate(appointment.end, "hh:mm A"))
  const locator = useSelector((state: any) => state.Virtual.virtuals)
  const [locationData, setLocationData] = useState<any>()

  // Methods
  const getDateTimeContent = (): JSX.Element => {
    if (!appointment?.start) return <NotFilled />

    return (
      <div className="text-sm dark:text-white">
        <div className="text-sm">
          <strong>{formatDate(appointment.start, "hh:mm a")}</strong> at
          <strong> {locationData?.attributes?.name} </strong>
        </div>
        <div className="italic text-sm mt-1">{getApptHoursDifference(appointment.start, appointment.end)}</div>
      </div>
    )
  }

  const getChiefConcernContent = (): JSX.Element => {
    return (
      <div className={`text-sm dark:text-white`}>
        <div className="text-sm">{appointment?.chiefConcern}</div>
      </div>
    )
  }

  const getTeamContent = (): JSX.Element => {
    // Note: Provider & Team are different. Needs to implement team --> for the time being using provider
    // console.log(appointment.provider.get("firstName"))
    if (!appointment?.provider) return <NotFilled />

    return (
      <div className={`text-sm dark:text-white`}>
        <div className="text-sm">Dr. {appointment?.provider.attributes.firstName}</div>
      </div>
    )
  }

  const getNotesContent = (): JSX.Element => {
    if (!appointment?.note) return <NotFilled />

    return (
      <div className="text-sm dark:text-white 2xl:col-span-2">
        <div className="text-sm">{appointment.note}</div>
      </div>
    )
  }

  const getStatusContent = (): JSX.Element => {
    if (!appointment?.status) return <NotFilled />

    return (
      <div className="text-sm dark:text-white">
        <Pill label={appointment.status} className="bg-green-300 px-5 text-sm text-green-900"></Pill>
      </div>
    )
  }

  const getProviderContent = (): JSX.Element => {
    if (!appointment?.provider) return <NotFilled />

    return (
      <div className="text-sm dark:text-white">
        <div className="text-sm">Dr. {appointment.provider.attributes?.firstName}</div>
      </div>
    )
  }

  const getOperatoryContent = (): JSX.Element => {
    if (!appointment?.operatory) return <NotFilled />

    return (
      <div className="text-sm dark:text-white">
        <div className="text-sm">{appointment.operatory.attributes?.shortName}</div>
      </div>
    )
  }

  // const getProceduresContent = (procedures: IProcedure[]): string | JSX.Element => {
  //   // improve logic
  //   const getString = (): string => {
  //     if (procedures?.length > 0) {
  //       return procedures
  //         ?.map((pro, index) => {
  //           if (pro && pro?.adaCode && pro?.description) {
  //             return procedures.length !== index + 1 ? `${pro?.adaCode} - ${pro?.description}, \n` : `${pro?.adaCode} - ${pro?.description} \n`
  //           } else {
  //             return ""
  //           }
  //         })
  //         .join("")
  //     } else {
  //       return "Not filled"
  //     }
  //   }

  //   return (
  //     <div className="text-sm dark:text-white">
  //       <div>
  //         <div className="text-ellipsis-appt" title={getString()}>
  //           {getString()}
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  const { control, getValues, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      status: appointment?.status ? appStatusOptions.find((stat) => stat.value === appointment?.status) : EMPTY_OPTION,
      provider: selectedProvider
        ? {
            id: selectedProvider.objectId,
            value: selectedProvider.objectId,
            name: getName(selectedProvider),
          }
        : EMPTY_OPTION,
      operatory: selectedOperatory
        ? {
            id: providerOptions.find((opt: any) => opt.value === selectedOperatory?.id)?.id ?? "0",
            value: selectedOperatory.id,
            name: selectedOperatory.shortName,
          }
        : EMPTY_OPTION,
      date: appointment?.start ? moment(new Date(appointment?.start)).utc().format("YYYY-MM-DD") : moment(new Date(fromDate)).utc().format("YYYY-MM-DD"),
      fromTime: fromTime ? timeOptions.find((time) => time.value === fromTime.toUpperCase()) : appointment?.start ? timeOptions.find((time) => time.value === formatDate(appointment?.start, "hh:mmA").toUpperCase()) : getOptionFromSelect({ array: timeOptions, id: 0 }),
      toTime: toTime ? timeOptions.find((time) => time.value === toTime.toUpperCase()) : appointment?.end ? timeOptions.find((time) => time.value === formatDate(appointment?.end, "hh:mmA").toUpperCase()) : getOptionFromSelect({ array: timeOptions, id: 5 }),
      chiefConcerns: appointment?.chief_concern ?? "",
      team: appointment?.team ?? "",
      notes: appointment?.note ?? "",
    },
  })

  const onSubmit = (): void => {
    console.log("Form Submitted >>> Appointment <<<", getValues())
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
    async function getLocation(): Promise<void> {
      try {
        const lquery = new Parse.Query("LocationV1")
        const welcomeCenter = await lquery.get(locator[0]?.attributes?.appointment?.attributes?.location?.id)
        setLocationData(welcomeCenter)
      } catch (error) {
        console.log("error ", error)
      }
    }
    getLocation()
  }, [])

  return (
    <form onSubmit={verifySubmit} className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 px-5 py-6 dark:text-white">
      <button type="submit" className="hidden" ref={submitRef}></button>

      <div className="text-sm dark:text-white col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Appointment Time {"&"} Location</div>
        <div className="mt-2">
          {isEditing && (
            <div className="col-span-2 sm:col-span-1">
              <div className="flex sm:mb-4 items-center">
                <div className="time-select flex-1 dark:bg-black-800 relative capitalize">
                  <Controller
                    name="fromTime"
                    control={control}
                    rules={{ required: "From Time is required" }}
                    render={({ field }): JSX.Element => {
                      let { onChange, name, value } = field
                      return <Select options={timeOptions} value={value} onChange={onChange} />
                    }}
                  />
                  <FieldError className="absolute -bottom-6 left-0">{formState.errors.fromTime?.message}</FieldError>
                </div>
                <div className="mx-2">
                  <span className="dark:text-white">to</span>
                </div>
                <div className="time-select flex-1 dark:bg-black-800 relative capitalize">
                  <Controller
                    name="toTime"
                    control={control}
                    rules={{ required: "To Time is required" }}
                    render={({ field }): JSX.Element => {
                      let { onChange, name, value } = field
                      return <Select options={timeOptions} value={value} onChange={onChange} />
                    }}
                  />
                  <FieldError className="absolute -bottom-6 left-0">{formState.errors.toTime?.message}</FieldError>
                </div>
              </div>
            </div>
          )}

          <div className="relative col-span-2 sm:col-span-1">
            <Controller
              name="date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }): JSX.Element => {
                let { onChange, name, value } = field
                return <CustomTextField type="date" id="appointment-date" name={name} value={value} onChange={onChange} content={getDateTimeContent()} editMode={isEditing} />
              }}
            />
            <FieldError className="absolute -bottom-6 left-0">{formState.errors.date?.message}</FieldError>
          </div>
        </div>
      </div>

      <div className="text-sm dark:text-white col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Chief Concern</div>
        <div className="mt-1">
          <div className="relative capitalize">
            <Controller
              name="chiefConcerns"
              control={control}
              rules={{ required: false }}
              render={({ field }) => {
                let { onChange, value } = field
                return (
                  <CustomTextArea
                    id="chief-concern"
                    value={value}
                    onChange={(e): void => {
                      onChange(e)
                    }}
                    rows={4}
                    content={getChiefConcernContent()}
                    editMode={isEditing}
                  />
                )
              }}
            />
          </div>
        </div>
      </div>

      <div className="text-sm dark:text-white col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Team</div>
        <div className="mt-1">
          <div className="relative capitalize">
            <Controller
              name="team"
              control={control}
              rules={{ required: false }}
              render={({ field }) => {
                let { onChange, value } = field
                return <CustomTextArea id="team" value={value} onChange={onChange} rows={4} content={getTeamContent()} editMode={isEditing} />
              }}
            />
          </div>
        </div>
      </div>

      <div className="text-sm dark:text-white col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Notes</div>
        <div className="mt-1">
          <div className="relative capitalize">
            <Controller
              name="notes"
              control={control}
              rules={{ required: false }}
              render={({ field }) => {
                let { onChange, value } = field
                return <CustomTextArea id="notes" value={value} onChange={onChange} rows={4} content={getNotesContent()} editMode={isEditing} />
              }}
            />
          </div>
        </div>
      </div>

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Appointment Status</div>
        <div className="mt-2">
          <div className="relative capitalize">
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => {
                let { onChange, value } = field
                return <CustomSelect options={appStatusOptions} defaultValue="0" value={value} onChange={onChange} content={getStatusContent()} editMode={isEditing} disabled={!appointment} />
              }}
            />
            <FieldError className="absolute -bottom-6 left-0">{formState.errors.status?.message}</FieldError>
          </div>
        </div>
      </div>

      <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Operatory</div>
        <div className="mt-2">
          <div className="relative capitalize">
            <Controller
              name="operatory"
              control={control}
              rules={{ required: "Operatory is required" }}
              render={({ field }) => {
                let { onChange, value } = field
                return <CustomSelect options={operatoryOptions} defaultValue="0" value={value} onChange={onChange} content={getOperatoryContent()} editMode={isEditing} />
              }}
            />
            <FieldError className="absolute -bottom-6 left-0">{formState.errors.operatory?.message}</FieldError>
          </div>
        </div>
      </div>

      <div className="text-sm dark:text-white col-span-2">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Provider</div>
        <div className="mt-2">
          <div className="relative capitalize">
            <Controller
              name="provider"
              control={control}
              rules={{ required: "Provider is required" }}
              render={({ field }) => {
                let { onChange, value } = field
                return <CustomSelect options={providerOptions} value={value} onChange={onChange} content={getProviderContent()} editMode={isEditing} />
              }}
            />
            <FieldError className="absolute -bottom-6 left-0">{formState.errors.provider?.message}</FieldError>
          </div>
        </div>
      </div>

      {/* <div className="text-sm dark:text-white">
        <div className="text-xs font-normal dark:text-gray-300 text-gray-600">Procedure Codes</div>
        <div className="mt-2">
          <CustomProcedureCodes
              previousProcedures={previousProcedures}
              value={procedures}
              onChange={(value) => {
                setProcedures(value);
                let isChanged = false;
                if (
                  value?.length ===
                  appointment?.practice_procedure_models?.length
                ) {
                  value.forEach((value) => {
                    if (appointment?.practice_procedure_models?.length) {
                      appointment.practice_procedure_models.forEach((modal) => {
                        if (
                          value.label ===
                          `${modal?.adaCode} ${modal?.description}`
                        ) {
                          isChanged = false;
                        } else {
                          isChanged = true;
                        }
                      });
                    } else {
                      isChanged = true;
                    }
                  });
                } else {
                  isChanged = true;
                }
                console.log('procedure isChanged: ', isChanged);
                setProceduresChanged(isChanged);
              }}
              content={getProceduresContent(
                appointment?.practice_procedure_models || []
              )}
              editMode={isEditing}
            />
        </div>
      </div> */}
    </form>
  )
}

export default AppointmentTabContent

const NotFilled = (): JSX.Element => {
  return <div className="text-sm">Not filled</div>
}
