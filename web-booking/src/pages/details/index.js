import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Form, FormikProvider } from "formik"
import { useDispatch, useSelector } from "react-redux"
import Select from "react-select"
import { useHistory } from "react-router-dom"
import DatePicker from "react-date-picker"
import "react-date-picker/dist/DatePicker.css"
import Button from "../../components/Button"
import InputField from "../../components/InputField"
import PageTitle from "../../components/PageTitle"
import RadioInput from "../../components/RadioInput"
import StickyContainer from "../../components/StickyContainer"
import PageContainer from "../../components/PageContainer"
import { toast } from "react-toastify"
import { AddPersonalInfo } from "../../Store/AddPersonalInfo/actions"
import { getMainPatient } from "../../Store/Auth/actions"
import moment from "moment"
import { optionData } from "../../utils/optionData"
import { formatDOB } from "../../utils/helpers"

export default function Details() {
  let history = useHistory()
  const dispatchAction = useDispatch()

  const user = useSelector((state) => state?.AuthRed?.user)
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  )

  const [dateOfBirth, setDateOfBirth] = useState(
    selectedPatient?.dateOfBirth ? new Date(selectedPatient?.dateOfBirth) : null
  )
  const [stateValue, setstateValue] = useState({})
  const [gender, setGender] = useState(selectedPatient?.gender ?? "M")
  const [yesterdayDay, setYesterdayDay] = useState()
  const [phoneNumber, setPhoneNumber] = useState(
    selectedPatient?.phones?.find(Boolean).number.toString() ?? ""
  )

  useEffect(() => {
    dispatchAction(getMainPatient())
  }, [])

  useEffect(() => {
    setDateOfBirth(
      selectedPatient?.dateOfBirth
        ? new Date(selectedPatient.dateOfBirth)
        : null
    )
    setGender(selectedPatient?.gender ?? "M")
    setPhoneNumber(
      selectedPatient?.phones?.find(Boolean).number.toString() ?? ""
    )
    setstateValue(
      selectedPatient?.state
        ? {
            label: selectedPatient?.state,
            value: selectedPatient?.state,
          }
        : {}
    )
  }, [selectedPatient])

  const [isLoading, setIsLoading] = useState(false)
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const userDetailsSchema = Yup.object().shape({
    address: Yup.string()
      .required("Please enter address")
      .matches(/\S/, "Invalid address"),
    city: Yup.string()
      .required("Please enter city")
      .matches(/\S/, "Invalid city"),
    state: Yup.mixed().required("Please enter state"),
    postalCode: Yup.string()
      .matches(/^[0-9]{5}/, "Invalid postal code")
      .required(),
  })

  const formik = useFormik({
    initialValues: {
      phone: phoneNumber,
      address: selectedPatient?.address1 ?? "",
      city: selectedPatient?.city ?? "",
      state: selectedPatient?.state ?? "",
      postalCode: selectedPatient?.postalCode ?? "",
    },
    enableReinitialize: true,
    validationSchema: userDetailsSchema,
    onSubmit: async (values) => {
      if (!!dateOfBirth) {
        if (isDobValid(dateOfBirth)) {
          setIsLoading(true)
          dispatchAction(
            AddPersonalInfo({
              dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
              gender: gender,
              address: values.address,
              city: values.city,
              state: values.state.value,
              postalCode: values.postalCode,
              user: user,
            })
          )
          history.push("/location")
          setIsLoading(false)
        }
      } else {
        toast.error("Please enter date of birth")
      }
    },
  })
  console.log("formik", formik)

  function isDobValid(dob) {
    if (dob < new Date("1900-01-01")) {
      toast.error(`INVALID DATE OF BIRTH ${moment(dob).format("YYYY-MM-DD")}`)
      return false
    } else {
      return true
    }
  }

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
      step={2}
      leftContent={
        <>
          <PageTitle title="Personal Information">
            We need a few details from you in order to book an appointment.
          </PageTitle>
          <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div className="flex justify-between mb-5">
                <InputField
                  placeholder="Address"
                  name="address"
                  value={formik.values && formik.values.address}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.address && formik.errors.address
                  )}
                  helpertext={formik.errors.address}
                />
              </div>
              <div className=" flex justify-between mb-5">
                <InputField
                  placeholder="City"
                  name="city"
                  className="mr-3"
                  value={formik.values && formik.values.city}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.city && formik.errors.city)}
                  helpertext={formik.errors.city}
                />
                <div
                  className="w-full  placeholder-mobile-grey-400 bg-gray-100 focus:outline-none lg:text-3xl lg:h-12 rounded-md border-0"
                  style={{ hight: "52px" }}
                >
                  <Select
                    name="state"
                    placeholder="State"
                    options={optionData}
                    value={stateValue}
                    classNamePrefix="react-select react-selectDetail"
                    onChange={(e) => {
                      setstateValue(e)
                      formik.setFieldValue("state", e)
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between mb-5">
                <InputField
                  placeholder="Postal code"
                  name="postalCode"
                  className="mr-3"
                  value={formik.values && formik.values.postalCode}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.postalCode && formik.errors.postalCode
                  )}
                  helpertext={formik.errors.postalCode}
                />
                <DatePicker
                  maxDetail="month"
                  dayPlaceholder="dd"
                  monthPlaceholder="mm"
                  yearPlaceholder="yyyy"
                  yearAriaLabel="Year"
                  format="MM/dd/yyyy"
                  value={dateOfBirth}
                  minDate={new Date("1900-01-01")}
                  maxDate={yesterdayDay}
                  onChange={(date) => setDateOfBirth(date)}
                  className="w-full py-2 px-3 placeholder-mobile-grey-400 bg-gray-100 focus:outline-none lg:text-3xl rounded-md border-0"
                />
              </div>
              <div className="text-mobile-grey-600 mb-10">
                <h6 className="font-bold text-sm md:text-lg">Gender</h6>
                <div className="flex mt-3">
                  <RadioInput
                    name="gender"
                    value="M"
                    onChange={setGender}
                    option={{ title: "Male", text: "" }}
                    selectedOption={gender}
                  />
                  <RadioInput
                    name="gender"
                    value="F"
                    onChange={setGender}
                    option={{ title: "Female", text: "" }}
                    selectedOption={gender}
                  />
                  <RadioInput
                    name="gender"
                    value="O"
                    onChange={setGender}
                    option={{ title: "Other", text: "" }}
                    selectedOption={gender}
                  />
                </div>
              </div>
              <StickyContainer>
                <Button loading={isLoading} onClick={formik.handleSubmit} />
              </StickyContainer>
            </Form>
          </FormikProvider>
        </>
      }
    />
  )
}
