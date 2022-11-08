import Parse from "parse"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import Button from "../../components/Button"
import PageContainer from "../../components/PageContainer"
import PageTitle from "../../components/PageTitle"
import StickyContainer from "../../components/StickyContainer"
import { getMainPatient, getSelectedPatient } from "../../Store/Auth/actions"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { getFamilyMember } from "../../Store/CreateFamilyMember/actions"
import Loader from "../../components/Loader"
import { addAppointmentNote } from "../../Store/Auth/actions"
import { appointmentCreatedStatus, timeSlotAndLocationSuccess } from "../../Store/Location/actions"

export default function Patients() {
  const history = useHistory()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [patientListLoader, setPatientListLoader] = useState(false)

  const mainPatient = useSelector((state) => state?.AuthRed?.mainPatient)
  const familyMember = useSelector((state) => state?.FamilyMember.familyMember)
  const familyMemberUpdatedList = useSelector(
    (state) => state?.FamilyMember?.familyMemberList
  )

  useEffect(async () => {
    dispatch(getMainPatient())
    dispatch(timeSlotAndLocationSuccess(null))
    dispatch(addAppointmentNote(""))
    dispatch(getFamilyMember({ setPatientListLoader, mainPatient }))
    dispatch(appointmentCreatedStatus(false))
  }, [])

  const onSelectPatient = async (patient) => {
    setIsLoading(true)
    dispatch(getSelectedPatient(patient.objectId))
    if (patient?.preferredLocation?.objectId === "9000000000842") {
      history.push("/location")
    } else {
      if (patient?.preferredLocation) {
        history.push("/currentlocation")
      } else {
        history.push("/location")
      }
    }
    setIsLoading(false)
  }

  const addFamilyMember = () => {
    if (mainPatient?.preferredLocation) {
      history.push("/addNewFamilyMember")
    } else {
      toast.error(
        "Please add location first then you will add the family memeber"
      )
    }
  }

  return (
    <PageContainer
      step={2}
      leftContent={
        <>
          <PageTitle title="Choose a member">
            Please choose a member below to continue.
          </PageTitle>

          <div className="mb-14 md:mb-5 overflow-y-auto">
            {patientListLoader ? (
              <Loader />
            ) : (
              familyMember?.map((p) => (
                <div
                  className="flex items-center p-2 rounded-md cursor-pointer mb-4 bg-gray-50 shadow-sm"
                  onClick={() => onSelectPatient(p)}
                  key={p.objectId}
                >
                  {p.profile_image ? (
                    <img
                      src={p.profile_image}
                      className="h-12 w-12 rounded-md"
                      alt="Patient Avatar"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-12 w-12 border border-gray-200 text-mobile-grey-600 text-3xl uppercase rounded-md">
                      {p.firstName[0] ?? "P"}
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="text-md">
                      {p.firstName + " " + p.lastName}
                    </h3>
                    <span className="text-xs text-mobile-grey-600">
                      {p.emailAddress}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <StickyContainer>
            <Button
              loading={isLoading}
              onClick={addFamilyMember}
              title="Add family member"
            />
          </StickyContainer>
        </>
      }
    />
  )
}
