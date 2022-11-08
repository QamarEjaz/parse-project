import { Control, Controller } from "react-hook-form"
import Select from "../../../../components/Inputs/Select"
import Textarea from "../../../../components/Inputs/Textarea"
import TextField from "../../../../components/Inputs/TextField"
// import UsersSelect from "../../../../components/Inputs/UsersSelect"
// import MultiSelect from "../../../../components/Inputs/MultiSelect"
import MultiSelectTeam from "../../../../components/Inputs/MultiSelect/MultiSelectTeam"
import { formatDate, getTimeOptions } from "../../utils"
import { IOption } from "../../../../components/Inputs/Select/Select.interfaces"
import { IOption as IMultiOption } from "../../../../components/Inputs/MultiSelect/MultiSelect.interfaces"
import { APPT_STATUS_OPTIONS } from "../../../../utils/SelectOptions"
import { IAppointment } from "../../schedule-template/Template.interfaces"
import { useState } from "react"
import { MultiValue } from "react-select"

const timeOptions = [...getTimeOptions()]

const statusArray = APPT_STATUS_OPTIONS.map((status) => ({ id: status.id.toString(), value: status.value, name: status.label }))
// const providersArray = PROVIDERS.map((prov) => ({ id: prov.id, value: prov.uid, name: `${prov?.firstName} ${prov?.lastName}` }))

interface IAppointmentProps {
  appointment: IAppointment | null
  control: Control<
    {
      status: IOption
      other: string
      operatory: IOption
      provider: IOption
      date: Date
      start: IOption
      end: IOption
      chiefConcern: string
      teamMembers: IMultiOption[]
      notes: string
      patientTypes: MultiValue<IMultiOption>
      setPatientTypes: (options: MultiValue<any>) => void
      levelNeeds: string
      socialHistory: string
      isVip: boolean

      firstName: string
      lastName: string
      preferredName: string
      emailAddress: string
      phones: []
      gender: string
      dateOfBirth: Date
      patientStatus: string
      firstVisitDate: string
      lastVisitDate: string
      ssn: string
      address1: string
      city: string
      state: string
      postalCode: string
    },
    any
  >
  errors: any
  operatoriesArray: IOption[]
  providersArray: IOption[]
  teamMembersTypeArray?: IMultiOption[]
}

const Appointment = ({ appointment, control, errors, operatoriesArray, providersArray, teamMembersTypeArray }: IAppointmentProps): JSX.Element => {
  return (
    <>
      <div className={`grid grid-cols-2 gap-4`}>
        <div className="capitalize">
          <Controller
            name="status"
            rules={{ required: "Status is required" }}
            control={control}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Select disabled={appointment ? false : true} onChange={onChange} value={value} label="Appt Status" options={statusArray} />
            }}
          />
        </div>
        <div>
          <Controller
            name="operatory"
            rules={{ required: "Operatory is required" }}
            control={control}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Select onChange={onChange} value={value} label="Operatory" options={operatoriesArray} />
            }}
          />
        </div>
        <div>
          <Controller
            name="provider"
            rules={{ required: "Provider is required" }}
            control={control}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Select onChange={onChange} value={value} label="Providers" options={providersArray} />
            }}
          />
        </div>
        <div>
          <Controller
            name="other"
            control={control}
            rules={{ required: "Other is required" }}
            render={({ field }): JSX.Element => {
              let { onChange, value, name } = field
              return <TextField onChange={onChange} label="Other" name={name} type="text" value={value} error={errors.other ? true : false} helperText={errors.other?.message} />
            }}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Controller
            name="date"
            rules={{ required: "Date is required" }}
            control={control}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField onChange={onChange} label="Appointment Date" name="appointment-date" type="date" value={formatDate(value, "YYYY-MM-DD")} />
            }}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="flex sm:mt-5 items-center">
            <div className="time-select flex-1 dark:bg-black-800">
              <Controller
                name="start"
                rules={{ required: "Start is required" }}
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <Select options={timeOptions} value={value} onChange={onChange} />
                }}
              />
            </div>
            <div className="mx-2">
              <span className="dark:text-white">to</span>
            </div>
            <div className="time-select flex-1 dark:bg-black-800">
              <Controller
                name="end"
                rules={{ required: "End is required" }}
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <Select options={timeOptions} onChange={onChange} value={value} />
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full col-span-2">
          <div className="">
            <label className="input-label">Team</label>
            <div className="mt-1">
              <Controller
                name="teamMembers"
                control={control}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <MultiSelectTeam value={value} onChange={onChange} options={teamMembersTypeArray} />
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full col-span-1">
          <Controller
            name="chiefConcern"
            control={control}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Textarea onChange={onChange} value={value} label="Chief Concern" rows={5} />
            }}
          />
        </div>
        <div className="w-full col-span-1">
          <Controller
            name="notes"
            control={control}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Textarea onChange={onChange} value={value} label="Notes" rows={5} />
            }}
          />
        </div>
      </div>
    </>
  )
}
export default Appointment
