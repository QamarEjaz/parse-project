import Parse from "parse"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import useMobileDetect from "use-mobile-detect-hook"
import { notify } from "../../utils/helpers"
import BackButton from "../../components/BackButton"
import Button from "../../components/Button"
import Map from "../../components/Map"
import PageContainer from "../../components/PageContainer"
import PageTitle from "../../components/PageTitle"
import StickyContainer from "../../components/StickyContainer"
import { getLocation } from "../../Store/Location/actions"
import {
  getMainPatient,
  getSelectedPatient,
  GetWelcomeCenterScreen,
} from "../../Store/Auth/actions"
import { SKIPABLLE_LOCATIONS } from "../../utils/mapLocations"
import LocationListing from "../../components/LocationListing"
import { toast } from "react-toastify"

export default function Location() {
  const detectMobile = useMobileDetect()
  const dispatch = useDispatch()
  const history = useHistory()

  let LocationsArray = useSelector((state) => state?.Location?.locations)
  LocationsArray = LocationsArray?.filter(
    (location) => !location.isWelcomeCenter && !location.isRemote
  )
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  )

  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState(LocationsArray)
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    dispatch(getMainPatient())
    dispatch(getLocation())
  }, [])

  useEffect(() => {
    if (LocationsArray?.length > 0) {
      const locationIndexing = [...LocationsArray]
      let locationsConstent
      const index = LocationsArray?.findIndex((object) => {
        return object?.objectId === selectedPatient?.preferredLocation?.objectId
      })
      locationsConstent = [
        locationIndexing.splice(index, 1)[0],
        ...locationIndexing,
      ]
      setLocations(locationsConstent)
    }
  }, [selectedPatient])

  const goNext = async (id) => {
    if (!selectedLocation && !id?.objectId) {
      return notify("Please select location to Continue", "error")
    } else {
      try {
        setIsLoading(true)
        await Parse.Cloud.run("updatePatientPreferredLocation", {
          locationId: selectedLocation?.objectId || id.objectId,
          patientId: selectedPatient?.objectId,
        })
        dispatch(getMainPatient())
        dispatch(getSelectedPatient(selectedPatient?.objectId))
        dispatch(getMainPatient())
        setIsLoading(false)
        if (selectedPatient?.hasCompletedAppointment) {
          history.push("/chooseDate")
        } else {
          dispatch(
            GetWelcomeCenterScreen({
              objectID: selectedPatient?.objectId,
              history: history,
            })
          )
        }
      } catch (error) {
        setIsLoading(false)
        toast.error(JSON.stringify(error.message))
      }
    }
  }

  const onSelectLocation = (location) => {
    setSelectedLocation(location)
  }

  return (
    <PageContainer
      step={3}
      leftContent={
        <>
          <PageTitle
            title={
              selectedPatient.hasCompletedAppointment
                ? "Pick an office"
                : "Pick a home office"
            }
            className="mb-0"
          >
            Where would you like to schedule?
          </PageTitle>

          <LocationListing
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            goNext={goNext}
          />

          <StickyContainer>
            <BackButton />
            <Button onClick={goNext} loading={isLoading} />
          </StickyContainer>
        </>
      }
      rightContent={
        <Map
          hideOnMobile={true}
          locations={locations}
          initialZoom={detectMobile.isMobile() ? 9 : 10}
          onClick={goNext}
          selectedLocation={selectedLocation}
        />
      }
    />
  )
}
