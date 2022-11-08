import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import moment from "moment"
import { formatDate } from "../utils/helpers"

const AppointmentDetails = ({}) => {
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  )
  const slotState = useSelector((state) => state?.Location.timeSloteAndLocation)
  const [appointmentDetails, setAppointmentDetails] = useState()

  const getLocationForCurrentAppointment = () => {
    if (
      selectedPatient?.hasCompletedAppointment ||
      locationHasWelcomeCenter()
    ) {
      setAppointmentDetails(selectedPatient?.preferredLocation)
    } else {
      setAppointmentDetails(
        selectedPatient?.preferredLocation?.welcomeCenterLocation
      )
    }
  }

  const locationHasWelcomeCenter = () => {
    return (
      selectedPatient?.preferredLocation?.objectId ===
      selectedPatient?.preferredLocation?.welcomeCenterLocation?.objectId
    )
  }

  useEffect(() => {
    getLocationForCurrentAppointment()
  }, [selectedPatient, appointmentDetails])

  return (
    <>
      <p className="text-sm md:text-lg mt-1 md:mt-3 text-mobile-grey-600 mb-4">
        Appointment details
      </p>
      <table className="table-auto mb-3">
        <tbody>
          <tr>
            <td className="p-2 text-sm md:text-md mt-1 md:mt-3 text-mobile-grey-600">
              <b>Patient name:</b>
            </td>
            <td className="p-2">
              {selectedPatient?.firstName}
              &nbsp;{selectedPatient?.lastName}
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm md:text-md mt-1 md:mt-3 text-mobile-grey-600">
              <b>Location:</b>
            </td>
            <td className="p-2">{appointmentDetails?.name}</td>
          </tr>
          <tr>
            <td className="p-2 text-sm md:text-md mt-1 md:mt-3 text-mobile-grey-600">
              <b>Location address:</b>
            </td>
            <td className="p-2">
              {appointmentDetails?.address1},&nbsp;{appointmentDetails?.city}
              ,&nbsp;
              {appointmentDetails?.state},&nbsp;{appointmentDetails?.postalCode}
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm md:text-md mt-1 md:mt-3 text-mobile-grey-600">
              <b>Date:</b>
            </td>
            <td className="p-2">
              {moment(slotState?.date).format("MMMM DD, YYYY")}
            </td>
          </tr>
          <tr>
            <td className="p-2 text-sm md:text-md mt-1 md:mt-3 text-mobile-grey-600">
              <b>Time slot:</b>
            </td>
            <td className="p-2">
              {formatDate(slotState?.timeSlot?.start, "h:mm a", "HH:mm")}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default AppointmentDetails
