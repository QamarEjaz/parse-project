import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Button from "./Button"
import Loader from "./Loader"
import AppointmentDetails from "./AppointmentDetails"
import StickyContainer from "./StickyContainer"
import { useSelector } from "react-redux"

const Square = ({
  paymentForm,
  saveCard,
  isLoadingBtn,
  setIsLoadingBtn,
  handleCreateAppt,
  // hasSquareCustomer,
  isSquareProduction,
  selectedPatientCard,
  patientId,
}) => {
  const [errors, setErrors] = useState(null)

  useEffect(() => {
    paymentForm = new paymentForm({
      // Initialize the payment form elements
      applicationId: isSquareProduction
        ? process.env.REACT_APP_SQUARE_APPLICATION_ID
        : process.env.REACT_APP_SQUARE_SANDBOX_APPLICATION_ID,
      inputClass: "sq-input",
      autoBuild: false,
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [
        {
          fontSize: "14px",
          // lineHeight: "30px",
          padding: "12px",
          placeholderColor: "#a0a0a0",
          backgroundColor: "white",
        },
      ],
      // Initialize the credit card placeholders
      cardNumber: {
        elementId: "sq-card-number",
        placeholder: "Card Number",
      },
      cvv: {
        elementId: "sq-cvv",
        placeholder: "CVV",
      },
      expirationDate: {
        elementId: "sq-expiration-date",
        placeholder: "Expiration date MM/YY",
      },
      postalCode: {
        elementId: "sq-postal-code",
        placeholder: "Postal Code",
      },
      // SqPaymentForm callback functions
      callbacks: {
        /*
         * callback function: cardNonceResponseReceived
         * Triggered when: SqPaymentForm completes a card nonce request
         */
        cardNonceResponseReceived: function (errors, nonce, cardData) {
          setErrors(null)
          if (errors) {
            setErrors(errors)
            setIsLoadingBtn(false)
            return
          }
          saveCard(nonce, cardData)
        },
      },
    })
    paymentForm.build()
  })

  const requestCardNonce = () => {
    setIsLoadingBtn(true)
    try {
      paymentForm.requestCardNonce()
    } catch (error) {
      paymentForm.build() // temp fix
      setIsLoadingBtn(false)
      toast.error(JSON.stringify(error.message))
    }
  }

  const PaymentCard = () => {
    return (
      <div
        id="form-container"
        className="bg-mobile-grey-50 my-4 p-4 pb-2 rounded-lg"
      >
        <div id="sq-card-number"></div>
        <div className="third" id="sq-expiration-date"></div>
        <div className="third" id="sq-cvv"></div>
        <div className="third" id="sq-postal-code"></div>

        {errors && (
          <>
            <h4 className="text-mobile-red-1000 font-bold my-3">Errors</h4>
            <ul className="text-mobile-red-1000 list-decimal pl-5">
              {errors.map((error) => (
                <li key={error.field}>{error.message}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      {patientId || window.location.pathname === "/chk-cc" ? (
        <>
          {isLoadingBtn ? <Loader /> : <PaymentCard />}
          <StickyContainer>
            <Button
              loading={isLoadingBtn}
              onClick={requestCardNonce}
              title="Confirm"
            />
          </StickyContainer>
        </>
      ) : (
        <>
          {isLoadingBtn ? (
            <Loader />
          ) : selectedPatientCard?.length <= 0 ? (
            <PaymentCard />
          ) : null}
          <AppointmentDetails />
          <StickyContainer>
            <Button
              loading={isLoadingBtn}
              onClick={
                selectedPatientCard?.length > 0
                  ? handleCreateAppt
                  : requestCardNonce
              }
              title="Confirm"
            />
          </StickyContainer>
        </>
      )}
    </>
  )
}

export default Square
