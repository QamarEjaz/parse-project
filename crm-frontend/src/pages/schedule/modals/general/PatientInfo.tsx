/* eslint-env browser */
import { Control, Controller } from "react-hook-form"
import { Switch } from "@headlessui/react"
import classNames from "classnames"
import { IDefaultForm } from "."
import { formatDate, getTimeOptions } from "../../utils"
import MultiSelect from "../../../../components/Inputs/MultiSelect"
import TextField from "../../../../components/Inputs/TextField"
import Textarea from "../../../../components/Inputs/Textarea"
import { IOption } from "../../../../components/Inputs/MultiSelect/MultiSelect.interfaces"
import Input from "react-select/dist/declarations/src/components/Input"

const PatientInfo = ({ patientControl, patientTypeArray }: { patientControl: Control<IDefaultForm, any>; patientTypeArray: IOption[] }): JSX.Element => {
  return (
    <div className="space-y-4 relative">
      <div className="grid gap-y-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4">
        <div className="capitalize sm:col-span-2">
          <div className="">
            <label className="input-label">Type</label>
            <div className="mt-1">
              <Controller
                name="patientTypes"
                control={patientControl}
                render={({ field }): JSX.Element => {
                  let { onChange, value } = field
                  return <MultiSelect backgroundColor="#fff" border="1px solid #d1d5db" borderRadius="6px" menuBorderRadius="6px" isDark={false} options={patientTypeArray} value={value} isClearable={false} onChange={onChange} />
                }}
              />
            </div>
          </div>
        </div>
        <div className="capitalize">
          <Controller
            name="levelNeeds"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Textarea value={value} onChange={onChange} rows={3} label="Level 4 Needs" id="level"></Textarea>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="socialHistory"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Textarea value={value} onChange={onChange} rows={3} label="Social Notes" id="history"></Textarea>
            }}
          />
        </div>
      </div>
      <div className="capitalize">
        <div className="">
          <dl className="divide-y dark:divide-black-900 divide-gray-200">
            <Switch.Group as="div">
              <Switch.Label as="dt" className="text-xs font-normal dark:text-white text-gray-500" passive>
                VIP Status
              </Switch.Label>
              <dd className="mt-1 text-sm dark:text-white text-gray-900">
                <Controller
                  name="isVip"
                  control={patientControl}
                  render={({ field }): JSX.Element => {
                    let { onChange, value } = field
                    return (
                      <Switch
                        checked={value}
                        onChange={onChange}
                        className={classNames(
                          value ? "bg-gray-600" : "dark:bg-black-900 bg-gray-200",
                          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 dark:focus:ring-offset-transparent focus:ring-offset-2 focus:ring-gray-500 sm:ml-auto"
                        )}
                      >
                        <span aria-hidden="true" className={classNames(value ? "translate-x-5" : "translate-x-0", "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200")} />
                      </Switch>
                    )
                  }}
                />
              </dd>
            </Switch.Group>
          </dl>
        </div>
      </div>
      <div className="mt-4">
        <h3>
          <b>Basic Info</b>
        </h3>
      </div>
      <div className="grid gap-y-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4">
        <div className="capitalize">
          <Controller
            name="firstName"
            rules={{ required: "First Name is required" }}
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} onChange={onChange} label="First Name*" id="level"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="lastName"
            rules={{ required: "Last Name is required" }}
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} type="text" onChange={onChange} label="Last Name*" id="last"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="preferredName"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} type="text" onChange={onChange} label="Preferred Name" id="preferredName"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="emailAddress"
            rules={{ required: "Email is required" }}
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Textarea value={value} onChange={onChange} rows={1} label="Patient Email*" id="emailAddress"></Textarea>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="gender"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} type="text" onChange={onChange} label="Gender" id="gender"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="dateOfBirth"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={formatDate(value, "YYYY-MM-DD")} onChange={onChange} label="Date Of Birth" type="date" id="dateOfBirth"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="patientStatus"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <Textarea value={value} onChange={onChange} rows={1} label="Patient Status" id="patientStatus"></Textarea>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="address1"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} onChange={onChange} label="Patient Address" id="address1"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="city"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} onChange={onChange} label="City" id="city"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="state"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} onChange={onChange} label="State" id="state"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="postalCode"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} onChange={onChange} label="Postal Code" id="postalCode"></TextField>
            }}
          />
        </div>
        <div className="capitalize">
          <Controller
            name="firstVisitDate"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={formatDate(value, "YYYY-MM-DD")} onChange={onChange} type="date" disabled label="First Visit Date" id="firstVisitDate"></TextField>
            }}
          />
        </div>
        {/* <div className="capitalize"> I will uncomment this when migration from ascend is done for this column
                    <Controller
                      name="lastVisitDate"
                      control={patientControl}
                      render={({ field }): JSX.Element => {
                        let { onChange, value } = field
                        console.log("lastvisit", value)
                        return <TextField value={formatDate(value, "YYYY-MM-DD")} onChange={onChange} label="Last Visit Date" id="lastVisitDate"></TextField>
                      }}
                    />
                  </div> */}
        <div className="capitalize">
          <Controller
            name="ssn"
            control={patientControl}
            render={({ field }): JSX.Element => {
              let { onChange, value } = field
              return <TextField value={value} onChange={onChange} type="text" label="Social Security #" id="ssn"></TextField>
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PatientInfo
