import moment from "moment"
import { isInteger, isString } from "lodash"
import { IGetOptionFromSelect } from "../pages/virtuals-list/Modal/Tabs/AppointmentTabContent.interface"

export const checkEmailDomain = (email: string): boolean => {
  if (!process.env.REACT_APP_ALLOWED_DOMAINS) return false

  return process.env.REACT_APP_ALLOWED_DOMAINS.split(",").includes(
    email.split("@")[1]
  )
}

export const formatDate = (
  val: string | Date,
  format = "MM.DD.YYYY",
  formatFrom = ""
): string => {
  if (!val) return ""

  if (format === "diffForHumans") return moment(val).fromNow()

  return moment(val, formatFrom).format(format)
}

export const formatPhoneNumber = (phone_number: string): string => {
  if (!phone_number) return ""
  let x = phone_number
    .replace(/\D/g, "")
    .match(/(\d{0,3})(\d{0,3})(\d{0,4})/) as string[]

  return (phone_number = !x[2]
    ? x[1]
    : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : ""))
}

export const getRandomString = (): string => {
  return (
    (Math.random() + 1).toString(36).substring(7) +
    "-" +
    (Math.random() + 1).toString(36).substring(7)
  )
}

export const ele = (selector: string): Element | null => {
  let element = document.querySelector(selector)
  if (element === null) {
    console.log(
      `Element not found, selector ${selector} is wrong or js is not in the body`
    )
    return null
  }
  return element
}

export const getName = (value: {
  firstName: string
  lastName: string
}): string => {
  let name = ""
  if (value?.firstName) {
    name += value?.firstName
  }
  if (value?.lastName) {
    name += " "
    name += value?.lastName
  }
  return name
}

export const getPhone = (patient: any): string => {
  return patient?.phones
    .map(({ number }: { number: string }) => formatPhoneNumber(number))
    .join(", ")
}

export const getGender = (patient: { gender: string }): string => {
  const genders = { M: "Male", F: "Female", O: "Other" }

  return genders[patient?.gender as keyof typeof genders]
}

export const getLocationName = (name: string): string => {
  if (!name) return ""

  return name
    .replace("Total Health Dental Care", "")
    .replace("Dr. H. & Co.", "")
    .replace("DR. H. & CO.", "")
    .replace("Dr. H. & CO.", "")
    .trim()
}

export const getAge = (val: string) => {
  // return Math.floor((Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365))

  let now = moment().unix()
  let then = moment(val).unix()
  let diff = (now - then) / (60 * 60 * 24 * 365)
  return Math.floor(diff)
}

export const getAgeInYears = (dateOfBirth: string) => {
  if (!dateOfBirth) return ""

  return `${Math.floor(
    (new Date().getTime() - new Date(dateOfBirth).getTime()) /
      1000 /
      60 /
      60 /
      24 /
      365.25
  )}`
}

export const generateUID = () => Math.floor(Math.random() * 10000).toString()

export function formatSSN(value: string) {
  if (!value) return value

  // clean the input for any non-digit values.
  const ssn = value?.replace(/[^\d]/g, "")

  // ssnLength is used to know when to apply our formatting for the ssn
  const ssnLength = ssn.length

  // we need to return the value with no formatting if its less than four digits
  if (ssnLength < 4) return ssn

  // if ssnLength is greater than 4 and less the 6 we start to return
  // the formatted number
  if (ssnLength < 6) {
    return `${ssn.slice(0, 3)}-${ssn.slice(3)}`
  }

  // finally, if the ssnLength is greater then 6, we add the last
  // bit of formatting and return it.
  return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`
}
export function validateEmail(inputText: string) {
  var email_filter = new RegExp(
    /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
  )
  if (email_filter.test(inputText)) {
    return true
  } else {
    return false
  }
}

export const getApptHoursDifference = (
  start: Date | string,
  end: Date | string
): string => {
  if (!start) return ""

  var now = new Date().getTime()
  var endDate = new Date(start).getTime()
  var diff = endDate - now

  var hours = Math.floor(diff / 3.6e6)
  var minutes = Math.floor((diff % 3.6e6) / 6e4)

  if (
    formatDate(new Date(), "MM/DD/YYYY") !== formatDate(start, "MM/DD/YYYY")
  ) {
    return `${formatDate(start, "MM/DD/YYYY")}`
  }

  if (
    new Date().getTime() >= new Date(start).getTime() &&
    new Date().getTime() <= new Date(end).getTime()
  ) {
    return "Appointment Started"
  }

  if (minutes < 1) {
    return "Passed"
  }

  if (hours < 1 && minutes > 0 && minutes < 60) {
    return `In ${minutes} ${
      minutes === 1 || minutes === 0 ? "minute" : "minutes"
    }`
  }

  return `In ${hours} ${
    hours === 1 || hours === 0 ? "hour" : "hours"
  } ${minutes} ${minutes === 1 || minutes === 0 ? "minute" : "minutes"}`
}

// fix any
export const getOptionFromSelect = ({
  array,
  id,
}: {
  array: any
  id: number
}): IGetOptionFromSelect => {
  if (array && isInteger(id)) {
    // fix any
    let option = array.find((arr: any) => arr?.id === id)
    if (option)
      return { id: option?.id, value: option?.value, name: option?.name }
  } else if (array?.length > 0 && isString(id)) {
    return { id: array?.length + 1, value: "", name: "Select" }
  }
  return {
    id: array?.length > 0 ? (array?.length + 1).toString() : "0",
    value: "",
    name: "Select",
  }
}

export const excludeParseQueryFields = ({
  query,
  whitelist,
}: {
  query: any
  whitelist: string[]
}): any[] => whitelist.map((field) => query.exclude(field))
