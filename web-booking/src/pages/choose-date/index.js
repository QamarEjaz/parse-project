import { useEffect, useMemo, useState } from "react"
import { useHistory } from "react-router-dom"
import { DatePickerCalendar } from "react-nice-dates"
import { useDispatch, useSelector } from "react-redux"
import moment from "moment"
import { enGB } from "date-fns/locale"
import {
  formatDate,
  notify,
  removeTotalHeathCareName,
} from "../../utils/helpers"
import BackButton from "../../components/BackButton"
import Button from "../../components/Button"
import PageContainer from "../../components/PageContainer"
import SlotButton from "../../components/SlotButton"
import PageTitle from "../../components/PageTitle"
import StickyContainer from "../../components/StickyContainer"
import {
  appointmentCreatedStatus,
  getLocation,
  timeSlotAndLocationSuccess,
} from "../../Store/Location/actions"
import LocationField from "./LocationField"
import Loader from "../../components/Loader"

import "react-nice-dates/build/style.css"
import { isEqual } from "date-fns"
import Map from "../../components/Map"

export default function ChooseDate() {
  let history = useHistory()
  const dispatch = useDispatch()

  const locations = useSelector((state) => state?.Location?.locations)
  const slot = useSelector((state) => state?.Location?.timeSloteAndLocation)
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  )
  const mainPatient = useSelector((state) => state?.AuthRed?.mainPatient)

  const [selectedSlot, setSelectedSlot] = useState(null)
  const [timeSlot, setTimeSlot] = useState([])
  const [timeSlotLoder, setTimeSlotLoader] = useState(false)
  const [date, setDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthTimeSlots, setMonthTimeSlots] = useState({})

  useEffect(() => {
    dispatch(getLocation())
  }, [])

  useEffect(() => {
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(date)
    }
    setSelectedSlot(null)
  }, [date])

  const getLocationForCurrentAppointment = () => {
    if (
      selectedPatient?.hasCompletedAppointment ||
      locationHasWelcomeCenter()
    ) {
      return selectedPatient?.preferredLocation
    } else {
      return selectedPatient?.preferredLocation?.welcomeCenterLocation
    }
  }

  const goNext = async () => {
    if (!selectedSlot)
      return notify("Please select time slot to Continue", "error")
    dispatch(
      timeSlotAndLocationSuccess({
        location: getLocationForCurrentAppointment(),
        date: date,
        timeSlot: selectedSlot,
      })
    )
    dispatch(appointmentCreatedStatus(false))
    if (selectedPatient.hasCompletedAppointment) {
      history.push("/notes")
    } else {
      history.push("/cardDetails")
    }
  }

  const locationHasWelcomeCenter = () => {
    return (
      selectedPatient?.preferredLocation?.objectId ===
      selectedPatient?.preferredLocation?.welcomeCenterLocation?.objectId
    )
  }

  const selectedLocation = locationHasWelcomeCenter()
    ? selectedPatient?.preferredLocation
    : selectedPatient?.preferredLocation?.welcomeCenterLocation

  const welcomeCenterName = removeTotalHeathCareName(selectedLocation?.name)

  const modifiers = useMemo(() => {
    setDate(currentMonth)

    let dates = []
    Object.keys(monthTimeSlots).forEach((key) => {
      if (!monthTimeSlots[key].length) {
        dates.push(key)
      }
    })

    let mods = {
      disabled: (date) => {
        const isDisabled = dates.some((dateToDisable) =>
          isEqual(moment(dateToDisable).toDate(), date)
        )

        return isDisabled
      },
    }

    return mods
  }, [monthTimeSlots])

  useEffect(() => {
    if (date) {
      setTimeSlot(monthTimeSlots[formatDate(date, "YYYY-MM-DD")])
    }
  }, [date, monthTimeSlots])

  return (
    <PageContainer
      step={4}
      leftContent={
        <>
          <div className="hidden md:block">
            <PageTitle title="Choose a date & time" />
          </div>

          <LocationField
            month={currentMonth}
            setTimeSlot={setMonthTimeSlots}
            locations={locations}
            setTimeSlotLoader={setTimeSlotLoader}
            selectedPatient={selectedPatient}
          />
          <div className="md:flex items-start overflow-y-auto">
            <div className="flex-1 sm:w-3/5 sm:pr-6 sm:mr-6 mb-6 sm:border-mobile-grey-800 relative">
              <DatePickerCalendar
                date={date}
                onDateChange={setDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                minimumDate={new Date()}
                locale={enGB}
                modifiers={modifiers}
              />
            </div>
            <div className="flex flex-wrap sm:w-2/5 overflow-y-auto max-h-72">
              {timeSlotLoder && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10 bg-mobile-grey-50 bg-opacity-25">
                  <Loader />
                </div>
              )}

              {!timeSlotLoder
                ? timeSlot?.length > 0
                  ? timeSlot.map((slot) => {
                      return (
                        <SlotButton
                          value={slot}
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          isSelected={slot.id === selectedSlot?.id}
                        />
                      )
                    })
                  : "No slots are available"
                : null}
            </div>
          </div>

          <StickyContainer>
            <BackButton />
            <Button onClick={goNext} />
          </StickyContainer>
        </>
      }
      rightContent={
        selectedLocation && (
          <Map
            locations={[selectedLocation]}
            initialZoom={15}
            hideOnMobile={true}
          />
        )
      }
    />
  )
}
