import React, { useState } from "react"
import { AiFillStar } from "react-icons/ai"

import { formatDate, formatSSN, getAge, getApptHoursDifference, getGender, getName, getPhone } from "../../../utils/helpers"

import Avatar from "../../../components/DataDisplay/Avatar"
import Icon from "../../../components/DataDisplay/Icon"
import Pill from "../../../components/DataDisplay/Pill"

// fix any
const ActivePatientCard = ({ patientQueue }: any): JSX.Element => {
  const [tab, setTab] = useState("apt")

  const { patient, appointment, location } = patientQueue

  return (
    <div className="py-8">
      <div className="py-5 border-b border-gray-200 dark:border-black-700">
        <div className="flex flex-col justify-center items-center">
          <div className="relative">
            <Avatar image={patient?.profileImage} firstName={patient?.firstName} size="xlarge" bg="bg-gray-100 dark:bg-black-700" text="text-5xl text-black dark:text-white" className="" />
            <span className="absolute top-0 right-4 block h-6 w-6 rounded-full ring-2 ring-white bg-green-400 border-2 border-white" />
          </div>
          <div className="flex justify-center items-center space-x-3 pt-5">
            <span className="flex items-center bg-yellow-500 text-yellow-300 rounded-full p-0.5 border-2 border-yellow-300">
              <Icon icon={AiFillStar} fontSize="text-lg"></Icon>
            </span>
            <h3 className="text-2xl font-semibold dark:text-white text-gray-700">{getName(patient)}</h3>
            <span className="text-sm self-end dark:text-white">({`${getAge(patient?.dateOfBirth)} yo`})</span>
          </div>
        </div>
      </div>

      <div className="mb-5 border-b border-gray-200 dark:text-white text-gray-600 text-center py-4">
        <strong className="text-lg">Metlife </strong>
        <small className="italic">(active until 04/24/23)</small>
      </div>

      <div className="sm:flex sm:items-baseline">
        <div className="w-full">
          <nav className="-mb-px flex justify-center items-center space-x-8">
            <ActivePatientTab tab="apt" setTab={setTab} active={tab === "apt"}>
              Appointment
            </ActivePatientTab>
            <ActivePatientTab tab="pt" setTab={setTab} active={tab === "pt"}>
              Patient
            </ActivePatientTab>
          </nav>
        </div>
      </div>

      <ul className="space-y-6 py-4 sm:py-6">
        {tab === "apt" && (
          <>
            <ActivePatientCardItem label="Appointment Time & Location">
              {formatDate(appointment?.start, "hh:mm a")} at {location?.name} <br /> {getApptHoursDifference(appointment?.start?.iso, appointment?.end?.iso)}
            </ActivePatientCardItem>
            <ActivePatientCardItem label="Chief Concern">{appointment?.chiefConcern}</ActivePatientCardItem>
            <ActivePatientCardItem label="Team"> </ActivePatientCardItem>
            <ActivePatientCardItem label="Notes">{appointment?.note}</ActivePatientCardItem>
            <ActivePatientCardItem label="Appointment Status">{appointment?.status && <Pill label={appointment?.status} className="bg-green-300 px-5 text-sm text-green-900"></Pill>}</ActivePatientCardItem>
            <ActivePatientCardItem label="Provider">{getName(appointment?.provider?.attributes)}</ActivePatientCardItem>
            <ActivePatientCardItem label="Operatory">{appointment?.operatory?.attributes?.shortName}</ActivePatientCardItem>
          </>
        )}

        {tab === "pt" && (
          <>
            <ActivePatientCardItem label="Address">
              {patient?.address1} {patient?.address2}
            </ActivePatientCardItem>
            <ActivePatientCardItem label="Patient Status">{patient?.patientStatus && <Pill label={patient?.patientStatus} className="bg-green-300 px-5 text-sm text-green-900"></Pill>}</ActivePatientCardItem>
            <ActivePatientCardItem label="Phone">{getPhone(patient)}</ActivePatientCardItem>
            <ActivePatientCardItem label="Gender">{getGender(patient)}</ActivePatientCardItem>
            <ActivePatientCardItem label="Date of Birth">{formatDate(patient?.dateOfBirth, "MM/DD/YYYY")}</ActivePatientCardItem>
            <ActivePatientCardItem label="First Visit">{formatDate(patient?.firstVisitDate, "MM/DD/YYYY")}</ActivePatientCardItem>
            <ActivePatientCardItem label="Last Visit">{formatDate(patient?.lastVisitDate, "MM/DD/YYYY")}</ActivePatientCardItem>
            <ActivePatientCardItem label="Social Security #">{formatSSN(patient?.ssn)}</ActivePatientCardItem>
            <ActivePatientCardItem label="Primary Provider"> </ActivePatientCardItem>
            <ActivePatientCardItem label="Email">{patient?.emailAddress}</ActivePatientCardItem>
            <ActivePatientCardItem label="Type"> </ActivePatientCardItem>
            <ActivePatientCardItem label="Level 4 Needs">{patient?.levelNeeds}</ActivePatientCardItem>
            <ActivePatientCardItem label="Social History">{patient?.socialHistory}</ActivePatientCardItem>
          </>
        )}
      </ul>
    </div>
  )
}

export default ActivePatientCard

const ActivePatientTab = ({ tab, active, setTab, children }: { tab: string; active: boolean; setTab: (val: string) => void; children: React.ReactNode }): JSX.Element => {
  return (
    <div
      className={`flex-1 text-center ${
        active ? "dark:bg-black-800 bg-indigo-100 dark:text-white text-indigo-600 rounded-lg " : "border-transparent dark:text-black-600 text-gray-500 dark:hover:text-white hover:text-gray-700 hover:border-gray-300 "
      }whitespace-nowrap py-2 font-medium text-sm cursor-pointer`}
      onClick={(): void => setTab(tab)}
    >
      {children}
    </div>
  )
}

const ActivePatientCardItem = ({ label, children }: { label: string; children: React.ReactNode }): JSX.Element => {
  return (
    <li>
      <div className="flex items-center justify-between">
        <div className="block text-xs font-normal dark:text-white text-gray-600 capitalize">{label}</div>
      </div>

      <div className="mt-1 flex justify-between">
        <div className="flex text-sm items-center font-medium dark:text-white text-gray-700">{children}</div>
      </div>
    </li>
  )
}
