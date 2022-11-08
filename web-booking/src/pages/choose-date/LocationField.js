import Parse from "parse"
import { useEffect } from "react"
import Select from "react-select"
import { useDispatch } from "react-redux"
import moment from "moment"
import { removeTotalHeathCareName } from "../../utils/helpers"
import { toast } from "react-toastify"
import { getMainPatient, getSelectedPatient } from "../../Store/Auth/actions"

export default function LocationField(props) {
  const { setTimeSlot, month, setTimeSlotLoader, locations, selectedPatient } =
    props

  const filteredLocations = locations?.filter(
    (location) => !location.isWelcomeCenter && !location.isRemote
  )

  const dispatch = useDispatch()

  const handleChange = async (location) => {
    setTimeSlotLoader(true)
    try {
      await Parse.Cloud.run("updatePatientPreferredLocation", {
        locationId: location?.value,
        patientId: selectedPatient?.objectId,
      })
      dispatch(getMainPatient())
      dispatch(getSelectedPatient(selectedPatient?.objectId))
      dispatch(getMainPatient())
      setTimeSlotLoader(false)
    } catch (error) {
      setTimeSlotLoader(true)
      toast.error(JSON.stringify(error.message))
    }
  }

  const locationHasWelcomeCenter = () => {
    return (
      selectedPatient?.preferredLocation?.objectId ===
      selectedPatient?.preferredLocation?.welcomeCenterLocation?.objectId
    )
  }

  const getLocationId = () => {
    if (
      selectedPatient?.hasCompletedAppointment ||
      locationHasWelcomeCenter()
    ) {
      return selectedPatient?.preferredLocation?.objectId
    } else {
      return selectedPatient?.preferredLocation?.welcomeCenterLocation?.objectId
    }
  }

  useEffect(() => {
    dispatch(getMainPatient())
  }, [])

  useEffect(async () => {
    if (!!selectedPatient) {
      const locationId = getLocationId()
      if (locationId) {
        setTimeSlotLoader(true)
        const getTimeSlote = await Parse.Cloud.run(
          "bookingSlotsRetrieveByDateRange",
          {
            locationId: locationId,
            reason: !selectedPatient?.hasCompletedAppointment
              ? "Other"
              : "Teeth Cleaning",
            startDateTime: moment(month)
              .startOf("month")
              .format("YYYY-MM-DD 00:00"),
            endDateTime: moment(month)
              .endOf("month")
              .format("YYYY-MM-DD 23:59:59"),
          }
        )
        setTimeSlot(getTimeSlote)
        setTimeSlotLoader(false)
      }
    }
  }, [month, selectedPatient]) //TIME_SLOT_AVAILABILITY

  return (
    <>
      {selectedPatient.hasCompletedAppointment ? (
        <div className="mb-6 md:block">
          <Select
            name="location"
            placeholder="Preffered location"
            className="react-select-container"
            classNamePrefix="react-select"
            value={{
              value: selectedPatient?.preferredLocation?.objectId,
              label: selectedPatient?.preferredLocation?.name,
            }}
            options={filteredLocations?.map((loc) => {
              return {
                value: loc?.objectId,
                label: removeTotalHeathCareName(loc?.name),
              }
            })}
            onChange={handleChange}
          />
        </div>
      ) : null}
    </>
  )
}
