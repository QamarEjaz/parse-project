import Parse from "parse"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import * as Yup from "yup"
import { useSelector } from "react-redux"
import moment from "moment"
import { Form, FormikProvider, useFormik } from "formik"
import DatePicker from "react-date-picker"
import { formatSSN } from "../../utils/helpers"
import PageContainer from "../../components/PageContainer"
import Button from "../../components/Button"
import PageTitle from "../../components/PageTitle"
import InputField from "../../components/InputField"
import StickyContainer from "../../components/StickyContainer"
import DentalProviders from "../../components/DentalProviders"
import States from "../../components/States"
import { toast } from "react-toastify"
import { parseConfig } from "../../utils/ParseConfig"

export default function InsurancePublicPage() {
  let history = useHistory()
  const search = window.location.search
  const params = new URLSearchParams(search)
  const patientId = params.get("id")

  const [dateOfBirth, setDateOfBirth] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [insuranceProviderState, setInsuranceProviderState] = useState("")
  const [insuranceState, setInsuranceState] = useState("")
  const [insuranceStateValidation, setInsuranceStateValidation] = useState("")
  const [yesterdayDay, setYesterdayDay] = useState()
  const [insuranceProvidersWithState, setInsuranceProvidersWithState] =
    useState([])

  let isState = insuranceProvidersWithState.includes(insuranceProviderState)
  let isShowId = insuranceProviderState === "Metlife Ship (UC Berkeley)"

  const loginUserSchema = Yup.object().shape({
    insuranceProvider: Yup.string().required(
      "Please select insurance provider"
    ),
    providerName: Yup.string().when("insuranceProvider", {
      is: "Other",
      then: Yup.string().required("Provider name is required."),
    }),
    insuranceStateValue: Yup.string().when("insuranceProvider", {
      is: insuranceStateValidation,
      then: Yup.string().required("State is required."),
    }),
    subscriberName: Yup.string()
      .required("Please enter subscriber name")
      .matches(/\S/, "Invalid subscriber name"),
    subscriberSsn: Yup.string().required("Please enter subscriber SSN"),
    subscriberId: Yup.string().when("insuranceProvider", {
      is: "Metlife Ship (UC Berkeley)",
      then: Yup.string().required("Subscriber Id is required."),
    }),
    membershipId: Yup.string().required("Please enter membership ID"),
  })
  const formik = useFormik({
    initialValues: {
      providerName: "",
      subscriberName: "",
      subscriberSsn: "",
      subscriberId: undefined,
      membershipId: "",
      insuranceProvider: "",
      insuranceStateValue: undefined,
    },
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async (values) => {
      if (dateOfBirth) {
        setIsLoading(true)
        try {
          await Parse.Cloud.run("updatePatientInsurance", {
            patientId: patientId,
            insuranceProvider:
              values.insuranceProvider === "Other"
                ? values.providerName
                : values.insuranceProvider,
            state: values.insuranceStateValue,
            dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
            subscriberName: values.subscriberName,
            subscriberSsn: values.subscriberSsn,
            subscriberId: values.subscriberId,
            membershipId: values.membershipId,
            generatedBy: "web",
          })
          toast.success("Insurance update successfully")
          history.push("/")
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
          toast.error(JSON.stringify(error.message))
        }
      } else {
        toast.error("Please add date of birth")
      }
    },
  })

  parseConfig()

  useEffect(() => {
    setInsuranceProviderState(formik?.values?.insuranceProvider)
  }, [formik?.values?.insuranceProvider])
  useEffect(() => {
    if (insuranceProviderState === "Delta Dental PPO") {
      setInsuranceStateValidation("Delta Dental PPO")
    } else if (insuranceProviderState === "Blue Cross") {
      setInsuranceStateValidation("Blue Cross")
    } else if (insuranceProviderState === "Blue Shield") {
      setInsuranceStateValidation("Blue Shield")
    } else setInsuranceStateValidation("")
  }, [insuranceProviderState])

  useEffect(() => {
    const fetchConfigProviders = async () => {
      const config = await Parse.Config.get()
      const insuranceProvidersWithStates = config.get(
        "insuranceProvidersWithState"
      )
      setInsuranceProvidersWithState(insuranceProvidersWithStates)
    }
    fetchConfigProviders()
  }, [])

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime())
    previous.setDate(date.getDate() - 1)
    setYesterdayDay(previous)
    return previous
  }
  useEffect(() => {
    getPreviousDay()
  }, [])

  return (
    <PageContainer
      step={7}
      leftContent={
        <>
          <PageTitle title="Enter Insurance Information">
            Enter the primary subscriber’s insurance information: this is you,
            your partner, or a parent whose employer provides the insurance
          </PageTitle>

          <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div className="mb-5">
                <DentalProviders
                  name="insuranceProvider"
                  value={insuranceProviderState}
                  onChange={(e) => {
                    setInsuranceProviderState(e.target.value)
                    formik.setFieldValue("insuranceProvider", e.target.value)
                  }}
                  error={Boolean(
                    formik.touched.insuranceProvider &&
                      formik.errors.insuranceProvider
                  )}
                  helpertext={formik.errors.insuranceProvider}
                />
              </div>
              {insuranceProviderState === "Other" && (
                <div className="mb-5">
                  <InputField
                    placeholder="Enter Insurance Provider Name"
                    name="providerName"
                    value={formik.values && formik.values.providerName}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.providerName && formik.errors.providerName
                    )}
                    helpertext={formik.errors.providerName}
                  />
                </div>
              )}
              {isState && (
                <div className="mb-5">
                  <States
                    name="insuranceStateValue"
                    value={insuranceState}
                    onChange={(e) => {
                      setInsuranceState(e.target.value)
                      formik.setFieldValue(
                        "insuranceStateValue",
                        e.target.value
                      )
                    }}
                    error={Boolean(
                      formik.touched.insuranceStateValue &&
                        formik.errors.insuranceStateValue
                    )}
                    helpertext={formik.errors.insuranceStateValue}
                  />
                </div>
              )}
              <div className="mb-5">
                <DatePicker
                  format="MM/dd/yyyy"
                  value={dateOfBirth}
                  maxDate={yesterdayDay}
                  onChange={(date) => setDateOfBirth(date)}
                  className={`w-full py-2 px-3 placeholder-mobile-grey-400 bg-gray-100 focus:outline-none lg:text-3xl rounded-md border-0`}
                />
              </div>
              <div className="mb-5">
                <InputField
                  placeholder="Name of Subscriber"
                  name="subscriberName"
                  value={formik.values && formik.values.subscriberName}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.subscriberName &&
                      formik.errors.subscriberName
                  )}
                  helpertext={formik.errors.subscriberName}
                />
              </div>
              <div className="mb-5">
                <InputField
                  type="subscriberSsn"
                  placeholder="SSN of Subscriber"
                  name="subscriberSsn"
                  value={formatSSN(
                    formik.values && formik.values.subscriberSsn
                  )}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.subscriberSsn && formik.errors.subscriberSsn
                  )}
                  helpertext={formik.errors.subscriberSsn}
                />
              </div>
              {isShowId && (
                <div className="mb-5">
                  <InputField
                    placeholder="ID of Subscriber"
                    name="subscriberId"
                    value={formik.values && formik.values.subscriberId}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.subscriberId && formik.errors.subscriberId
                    )}
                    helpertext={formik.errors.subscriberId}
                  />
                </div>
              )}
              <div className="mb-10">
                <InputField
                  placeholder="Member ID"
                  name="membershipId"
                  value={formik.values && formik.values.membershipId}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.membershipId && formik.errors.membershipId
                  )}
                  helpertext={formik.errors.membershipId}
                />
              </div>
              <StickyContainer>
                <Button
                  loading={isLoading}
                  onClick={formik.handleSubmit}
                  title="Complete Insurance Information"
                />
              </StickyContainer>
            </Form>
          </FormikProvider>
        </>
      }
    />
  )
}
