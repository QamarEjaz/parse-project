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
import { getLocationSuccess } from "../../Store/Location/actions"
import { getMainPatient, getSelectedPatient } from "../../Store/Auth/actions"
import LocationListing from "../../components/LocationListing"

export default function WelcomeCenterLocations() {
  const detectMobile = useMobileDetect()
  const dispatch = useDispatch()
  const history = useHistory()

  let locations = useSelector((state) => state?.Location?.locations)
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  )
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(async () => {
    const response = new Parse.Query("LocationV1")
      .equalTo("isActive", true)
      .equalTo("isWelcomeCenter", true)
    const locations = await response.findAll()
    dispatch(getLocationSuccess(locations.map((location) => location.toJSON())))
  }, [])

  const goNext = async (id) => {
    if (!selectedLocation && !id?.objectId) {
      return notify("Please select location to Continue", "error")
    } else {
      setIsLoading(true)
      if (window.location.pathname == "/location") {
        await Parse.Cloud.run("updatePatientPreferredLocation", {
          locationId: selectedLocation?.objectId || id.objectId,
          patientId: selectedPatient?.objectId,
        })
        dispatch(getMainPatient())
        dispatch(getSelectedPatient(selectedPatient?.objectId))
        dispatch(getMainPatient())
      }
      history.push("/chooseDate")
      setIsLoading(false)
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
          <PageTitle title={"Pick an office for your Exam"} className="mb-0">
            New patients must visit us at one of our Welcome Centers for their
            first exam, after that patients can see us at any of our 16
            locations across the Bay Area
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
