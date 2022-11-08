import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Form, FormikProvider } from "formik"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import DatePicker from "react-date-picker"
import "react-date-picker/dist/DatePicker.css"
import Button from "../../components/Button"
import InputField from "../../components/InputField"
import PageTitle from "../../components/PageTitle"
import RadioInput from "../../components/RadioInput"
import StickyContainer from "../../components/StickyContainer"
import PageContainer from "../../components/PageContainer"
import { AddFamilyMember } from "../../Store/CreateFamilyMember/actions"
import { toast } from "react-toastify"
import { getMainPatient } from "../../Store/Auth/actions"
import { formatDOB } from "../../utils/helpers"
import moment from "moment"

export default function AddNewFamilyMember() {
  const dispatchAction = useDispatch()
  let history = useHistory()

  const mainPatient = useSelector((state) => state?.AuthRed?.mainPatient)
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  )
  const user = useSelector((state) => state?.AuthRed?.user)

  const [dateOfBirth, setDateOfBirth] = useState()
  const [gender, setGender] = useState("M")
  const [yesterdayDay, setYesterdayDay] = useState()
  const [emailAddress, setEmailAddress] = useState()
  const [phoneNumber, setPhoneNumber] = useState(
    selectedPatient?.phones?.find(Boolean).number.toString() ?? ""
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatchAction(getMainPatient())
  }, [])

  useEffect(() => {
    setPhoneNumber(
      selectedPatient?.phones?.find(Boolean).number.toString() ?? ""
    )
  }, [selectedPatient])

  const addFamilyMemberSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Please enter first name")
      .matches(/\S/, "Invalid email"),
    lastName: Yup.string()
      .required("Please enter last name")
      .matches(/\S/, "Invalid email"),
  })
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: phoneNumber,
      dateOfBirth: "",
    },
    enableReinitialize: true,
    validationSchema: addFamilyMemberSchema,
    onSubmit: async (values) => {
      if (!dateOfBirth) {
        return toast.error("Please select Date of Birth")
      }
      if (isDobValid(dateOfBirth)) {
        setIsLoading(true)
        dispatchAction(
          AddFamilyMember({
            firstName: values.firstName,
            lastName: values.lastName,
            email: emailAddress,
            phone: values.phone,
            dateOfBirth: dateOfBirth,
            gender: gender,
            user: user,
            history: history,
            setIsLoading: setIsLoading,
          })
        )
      }
    },
  })

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime())
    previous.setDate(date.getDate() - 1)
    setYesterdayDay(previous)
    return previous
  }
  useEffect(() => {
    getPreviousDay()
  }, [])

  function isDobValid(dob) {
    if (dob < new Date("1900-01-01")) {
      toast.error(`INVALID DATE OF BIRTH ${moment(dob).format("YYYY-MM-DD")}`)
      return false
    } else {
      return true
    }
  }

  return (
    <PageContainer
      step={2}
      leftContent={
        <>
          <PageTitle title="Add family member">
            We need a few details from you in order to book an appointment.
          </PageTitle>

          <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div className="flex justify-between mb-5">
                <InputField
                  placeholder="First name"
                  name="firstName"
                  value={formik.values && formik.values.firstName}
                  onChange={formik.handleChange}
                  className="mr-3"
                  error={Boolean(
                    formik.touched.firstName && formik.errors.firstName
                  )}
                  helpertext={formik.errors.firstName}
                />
                <InputField
                  placeholder="Last name"
                  name="lastName"
                  value={formik.values && formik.values.lastName}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.lastName && formik.errors.lastName
                  )}
                  helpertext={formik.errors.lastName}
                />
              </div>
              <div className="mb-5">
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
                {/* simple Date Field */}
                {/* <InputField
                  placeholder="Date of Birth (MM-DD-YYYY)"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(formatDOB(e.target.value))}
                /> */}
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
