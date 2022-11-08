import Parse from "parse"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { toast } from "react-toastify"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import PageContainer from "../../components/PageContainer"
import PageTitle from "../../components/PageTitle"
import Square from "../../components/Square"
import Loader from "../../components/Loader"
import { appointmentCreatedStatus } from "../../Store/Location/actions"
import { parseConfig } from "../../utils/ParseConfig"
import axios from "axios"
import { getSelectedPatientCard } from "../../Store/Auth/actions"
axios.defaults.withCredentials = false

export default function CardDetails() {
  let history = useHistory()
  const dispatch = useDispatch()

  const search = window.location.search
  const params = new URLSearchParams(search)
  const patientId = params.get("id")

  const [isLoad, setLoad] = useState(false)
  const [isLoadingBtn, setIsLoadingBtn] = useState(false)
  const [isSquareProduction, setIsSquareProduction] = useState(
    process.env.REACT_APP_SQAURE_PRODUCTION === "TRUE"
  )

  const mainPatient = useSelector((state) => state?.AuthRed?.mainPatient)
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  )
  const note = useSelector((state) => state?.AuthRed?.appointmentNote)
  const formType = useSelector((state) => state?.AuthRed?.formType)
  const appointmentCreatedState = useSelector(
    (state) => state?.Location.appointmentCreated
  )
  const selectedPatientCard = useSelector(
    (state) => state?.AuthRed?.selectedPatientCard
  )
  const slotState = useSelector((state) => state?.Location.timeSloteAndLocation)

  useEffect(() => {
    if (mainPatient) {
      dispatch(getSelectedPatientCard({ mainPatient }))
    }
  }, [mainPatient])

  useEffect(() => {
    if (window.location.pathname === "/chk-cc") {
      dispatch(appointmentCreatedStatus(false))
    } else {
      if (mainPatient) {
        if (appointmentCreatedState) {
          history.push("/patients")
        }
      }
    }
  }, [mainPatient])

  parseConfig()

  const handleCreateAppt = async () => {
    setIsLoadingBtn(true)
    try {
      window.gtag("event", "conversion", {
        send_to: process.env.REACT_APP_GTAG_SEND_TO,
      })
      await Parse.Cloud.run("bookingAppointmentCreate", {
        patientId: selectedPatient?.objectId,
        locationId: slotState?.location?.objectId,
        date: moment(slotState?.date).format("YYYY-MM-DD"),
        start: slotState?.timeSlot?.start,
        generatedBy: "web",
        note: note,
      })
      // Log Success
      const { preferredLocation } = selectedPatient
      let phone = selectedPatient.phones?.length
        ? selectedPatient.phones[0]?.number
        : ""
      if (!phone) {
        phone = mainPatient.phones?.length ? mainPatient.phones[0]?.number : ""
      }
      let sheetLocation = selectedPatient.hasCompletedAppointment
        ? preferredLocation.name
        : preferredLocation.welcomeCenterLocation.name
      if (
        preferredLocation.objectId ===
        preferredLocation.welcomeCenterLocation.objectId
      ) {
        sheetLocation = preferredLocation.name
      }
      if (process.env.REACT_APP_SHEET_ATTEMPTS_PRODUCTION === "TRUE") {
        await axios.post(
          `${process.env.REACT_APP_GOOGLE_SHEET_URL}/log/patient/success`,
          {
            brand: "THDC",
            origin: "Web App",
            type: selectedPatient.hasCompletedAppointment ? "EXISTING" : "NEW",
            form: formType == 1 ? "REGISTER" : "LOGIN",
            first_name: selectedPatient.firstName,
            last_name: selectedPatient.lastName,
            phone: phone,
            email: selectedPatient.emailAddress || mainPatient.emailAddress,
            location: sheetLocation,
            reason: selectedPatient?.hasCompletedAppointment
              ? "Teeth Cleaning"
              : "Other",
            date: moment(slotState?.date).format("MMMM D, YYYY"),
            time: slotState?.timeSlot?.start,
            appointment_uid: "",
            appointment_id: "",
          }
        )
      }
      history.push("/confirmation")
      dispatch(appointmentCreatedStatus(true))
      setIsLoadingBtn(false)
    } catch (error) {
      setIsLoadingBtn(false)
      toast.error(JSON.stringify(error.message))
    }
  }

  const handleSaveCard = async (nonce, cardData) => {
    setIsLoadingBtn(true)
    try {
      if (patientId) {
        await Parse.Cloud.run("updatePatientCreditCard", {
          patientId: patientId,
          nonce: nonce,
          enabled: true,
          expMonth: cardData?.exp_month,
          expYear: cardData?.exp_year,
          last4: cardData?.last_4,
        })
        toast.success("Card details update successfully")
        setIsLoadingBtn(false)
        history.push("/")
      } else {
        await Parse.Cloud.run("bookingPatientCardCreate", {
          patientId: mainPatient?.objectId,
          nonce: nonce,
          cardholderName:
            selectedPatient?.firstName + " " + selectedPatient?.lastName,
          enabled: true,
          expMonth: cardData?.exp_month,
          expYear: cardData?.exp_year,
          last4: cardData?.last_4,
        })
        await handleCreateAppt()
      }
    } catch (error) {
      toast.error(JSON.stringify(error.message))
      setIsLoadingBtn(false)
    }
  }

  useEffect(() => {
    let sqPaymentScript = document.createElement("script")
    sqPaymentScript.src =
      process.env.REACT_APP_SQAURE_PRODUCTION === "TRUE"
        ? process.env.REACT_APP_SQUARE_APPLICATION_URL
        : process.env.REACT_APP_SQUARE_SANDBOX_APPLICATION_URL
    sqPaymentScript.type = "text/javascript"
    sqPaymentScript.async = false
    sqPaymentScript.onload = () => setLoad(true)
    document.getElementsByTagName("head")[0].appendChild(sqPaymentScript)
  })

  const squarePayment = isLoad ? (
    <Square
      paymentForm={window.SqPaymentForm}
      selectedPatientCard={selectedPatientCard}
      isSquareProduction={isSquareProduction}
      saveCard={handleSaveCard}
      handleCreateAppt={handleCreateAppt}
      isLoadingBtn={isLoadingBtn}
      setIsLoadingBtn={setIsLoadingBtn}
      patientId={patientId}
    />
  ) : (
    <Loader />
  )

  return (
    <PageContainer
      step={patientId ? 7 : 5}
      leftContent={
        <>
          {patientId ? (
            <PageTitle title={"Enter card details"}>
              We require a credit card to book your visit. Cancellation is free
              up to 72 hours before your visit. Canceling within 72 hours incurs
              a $50 charge.
            </PageTitle>
          ) : (
            <>
              {selectedPatientCard?.length > 0 ? (
                <PageTitle title={"Please Confirm Booking"} />
              ) : (
                <PageTitle title={"Enter card details"}>
                  We require a credit card to book your visit. Cancellation is
                  free up to 72 hours before your visit. Canceling within 72
                  hours incurs a $50 charge.
                </PageTitle>
              )}
            </>
          )}

          {squarePayment}
        </>
      }
    />
  )
}
