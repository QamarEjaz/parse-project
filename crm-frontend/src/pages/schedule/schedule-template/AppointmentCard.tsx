import React, { useEffect, useMemo, useState } from "react"
import Avatar from "../../../components/DataDisplay/Avatar"
import Icon from "../../../components/DataDisplay/Icon"
import Roller from "../../../components/Feedback/Progress/Roller"
import Ellipsis from "../../../components/Feedback/Progress/Ellipsis"
import { diffInTwoDateInMinutes, formatDate, getAgeInYears } from "../utils"
import { GiBiceps } from "react-icons/gi"
import { HiBell, HiDocumentText } from "react-icons/hi"
import { ClockIcon, UsersIcon } from "@heroicons/react/solid"
import { IAppointment, IPatientTypes } from "./Template.interfaces"
import { Operatory } from "../../../Types/OperatoryTypes"

interface IAppointmentCardProps {
  StartTime: Date
  EndTime: Date
  Appointment: IAppointment
  AppointmentBackground: Operatory["className"]
  showApptInfo: boolean
}

const AppointmentCard = ({ StartTime, EndTime, Appointment, AppointmentBackground, showApptInfo }: IAppointmentCardProps): JSX.Element => {
  const start = useMemo(() => new Date(StartTime).getTime(), [StartTime])
  const end = useMemo(() => new Date(EndTime).getTime(), [EndTime])
  const minutes = useMemo(() => diffInTwoDateInMinutes(start, end), [start, end])
  const [card, setCard] = useState<Element | null>(null)
  const image = useMemo(() => (Appointment?.patient?.profile_image ? Appointment?.patient?.profile_image : ""), [Appointment])

  const apptLoading = false

  const nameOverflowing = (): boolean => {
    if ((showApptInfo ? (Appointment?.patient?.firstName + Appointment?.patient?.lastName).length > 13 : (Appointment?.patient?.firstName + Appointment?.patient?.lastName).length > 17) || (card?.clientWidth || 1000) < 170) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    setCard(document.querySelector(`#appointment-${Appointment.objectId}`))
  })

  const opacity = useMemo(() => `${Appointment?.status.toUpperCase() === "BROKEN" ? " bg-opacity-50 hover:bg-opacity-50" : " "}`, [Appointment?.status])

  const apptStatus = (
    <div className="shrink-0 whitespace-nowrap text-ellipsis overflow-hidden text-white capitalize font-medium" title={Appointment?.status} style={{ fontSize: "11px" }}>
      {Appointment?.status}
    </div>
  )
  const getBody = (): JSX.Element => {
    return (
      <ul className={`text-white whitespace-normal space-y-1 pt-0 overflow-y-auto hide-scrollbar pb-0.5`} style={{ minHeight: minutes < 50 ? "110px" : "145px" }}>
        <li className="flex items-center">
          <span className="mr-1.5 transform translate-y-0.5">
            <Icon fontSize="text-sm" icon={ClockIcon}></Icon>
          </span>
          <span className="font-medium w-10/12 whitespace-nowrap overflow-hidden text-ellipsis text-xs">
            {formatDate(StartTime, "hh:mm A")} - {formatDate(EndTime, "hh:mm A")}
          </span>
        </li>
        {showApptInfo && (
          <>
            {Appointment?.patient?.social_history ? (
              <li className="flex items-center">
                <span className="mr-1.5 transform translate-y-0.5">
                  <Icon fontSize="text-sm" icon={HiBell}></Icon>
                </span>
                <span className="font-medium w-10/12 whitespace-nowrap overflow-hidden text-ellipsis text-xs">{Appointment?.patient?.social_history}</span>
              </li>
            ) : null}
            {Appointment?.patient?.level_needs ? (
              <li className="flex items-center">
                <span className="mr-1.5 transform translate-y-0.5">
                  <Icon fontSize="text-sm" icon={HiDocumentText}></Icon>
                </span>
                <span className="font-medium w-10/12 whitespace-nowrap overflow-hidden text-ellipsis text-xs">{Appointment?.patient?.level_needs}</span>
              </li>
            ) : null}
            {Appointment?.patient?.types?.length ? (
              <li className="flex items-center">
                <span className="mr-1.5 transform translate-y-0.5">
                  <Icon fontSize="text-sm" icon={GiBiceps}></Icon>
                </span>
                <span className="font-medium w-10/12 whitespace-nowrap overflow-hidden text-ellipsis text-xs">{Appointment?.patient?.types?.map((type: IPatientTypes) => type.title).join(", ")}</span>
              </li>
            ) : null}

            {minutes > 50 ? (
              <>
                {Appointment?.chiefConcern ? (
                  <li className="flex items-center">
                    <span className="text-xs font-bold mr-1.5" style={{ fontSize: "10px" }}>
                      CC
                    </span>
                    <span className="font-medium w-10/12 whitespace-nowrap overflow-hidden text-ellipsis text-xs">{Appointment?.chiefConcern}</span>
                  </li>
                ) : null}
                {minutes > 50 && Appointment?.teamMembers && Appointment?.teamMembers?.length > 0 ? (
                  <li className="flex items-center">
                    <span className="mr-1.5 transform translate-y-0.5">
                      <Icon fontSize="text-sm" icon={UsersIcon}></Icon>
                    </span>
                    <span className="font-medium w-10/12 whitespace-nowrap overflow-hidden text-ellipsis text-xs">{Appointment?.teamMembers?.map((mem) => mem?.firstName).join(", ")}</span>
                  </li>
                ) : null}
              </>
            ) : null}
          </>
        )}
      </ul>
    )
  }

  return (
    <div className={`relative h-full c-event-template overflow-hidden`} id={`appointment-${Appointment.objectId}`}>
      <div
        className={`group h-full inset-1 flex flex-col overflow-hidden border ${Appointment?.status?.toUpperCase?.() === "BROKEN" ? "border-opacity-40" : ""}  ${
          AppointmentBackground === "bg-appointment-green" ? "border-appointment-green-dark" : "border-appointment-blue-dark"
        } rounded-md py-1.5 px-2 ${opacity} ${AppointmentBackground === "bg-appointment-green" ? "bg-appointment-green" : "bg-appointment-blue"} ${AppointmentBackground === "bg-appointment-green" ? "hover:bg-appointment-green-dark" : "hover:bg-appointment-blue-dark"} transition-colors`}
        style={{ borderRadius: "10px" }}
      >
        {apptLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="spinner-wrapper">{minutes > 10 ? <Roller color="white" /> : <Ellipsis color="white" />}</div>
          </div>
        ) : (
          <>
            {minutes > 10 ? apptStatus : ""}
            <div className={`flex mb-1 ${minutes > 30 ? "mt-1" : ""}`}>
              {showApptInfo && (card?.clientWidth || 1000) > 180 && minutes > 30 ? (
                <div className="mr-1.5">
                  <Avatar image={image} firstName={Appointment?.patient?.firstName || ""} className="font-medium text-white bg-transparent border border-white" size="appointment" />
                </div>
              ) : null}
              <div className="flex-1 overflow-hidden">
                <p className={`font-semibold leading-4 text-white mb-0.5 whitespace-nowrap text-ellipsis ${minutes > 20 ? "text-sm" : "text-xs"} overflow-hidden capitalize`} title={`${Appointment?.patient?.firstName} ${Appointment?.patient?.lastName}`}>
                  {Appointment?.patient?.firstName + " "}
                  {nameOverflowing() && minutes > 30 ? <br /> : null}
                  {Appointment?.patient?.lastName}
                </p>
                {/* {minutes > 30 ? (
                  <div className="text-white leading-none" style={{ fontSize: "11px" }}>
                    {getAgeInYears(Appointment?.patient)} YO
                  </div>
                ) : null} */}
              </div>
            </div>

            {minutes > 40 ? getBody() : null}
          </>
        )}
      </div>
    </div>
  )
}

export default React.memo(AppointmentCard)
