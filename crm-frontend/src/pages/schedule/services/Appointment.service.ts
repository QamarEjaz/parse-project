import moment from "moment"
import Parse from "parse"
import { IOption } from "../../../components/Inputs/Select/Select.interfaces"
import { IOption as IMultiSelectOption } from "../../../components/Inputs/MultiSelect/MultiSelect.interfaces"
import {
  APPOINTMENT_WHITELIST,
  OPERATORY_WHITELIST,
} from "../../../constants/Whitelists"
import { excludeParseQueryFields } from "../../../utils/helpers"
import { MultiValue } from "react-select"
import { IAppointment } from "../schedule-template/Template.interfaces"
import { Operatory } from "../../../Types/OperatoryTypes"
import _ from "lodash"
import { updateHeaderRow, updateTimeSlots } from "../utils"

export const getAppointments = async (
  date: Date | string,
  location: IOption,
  providers: MultiValue<IMultiSelectOption>,
  status: MultiValue<IMultiSelectOption>,
  loadingProgressRef: any,
  appointmentQuery: any,
): Promise<any> => {

  if(!location?.value) return []

  loadingProgressRef.current?.continuousStart(0)
  
  // const PatientV1 = Parse.Object.extend("PatientV1")
  const LocationV1 = Parse.Object.extend("LocationV1")

  const start = moment(date).startOf("day") // Start of day
  const end = moment(date).endOf("day") // End of day

  /**
   * Exclude unnecessary fields from query.
   */
  excludeParseQueryFields({
    query: appointmentQuery,
    whitelist: APPOINTMENT_WHITELIST,
  })

  appointmentQuery.notEqualTo("ascendSyncCompleted", false)
  appointmentQuery.include(["patient", "teamMembers"]) // Include patient and teamMembers object in each appoitnment

  appointmentQuery.equalTo("location", new LocationV1({ id: location.value }))
  appointmentQuery.greaterThanOrEqualTo("start", start.format())
  appointmentQuery.lessThan("start", end.format())

  if (providers.length) {
    appointmentQuery.containedIn(
      "provider",
      providers.map((p: any) => p?.value)
    )
  }
  if (status.length) {
    appointmentQuery.containedIn(
      "status",
      status.map((s: any) => s?.value?.toUpperCase?.())
    )
  }

  try {
    let result = await appointmentQuery.find()

    result = result.map((appointment: any): IAppointment => {
      const appt = appointment?.toJSON?.()
      return { ...appt, start: appt?.start?.iso, end: appt?.end?.iso }
    })

    return {
      data: result
    }
  } catch (error: any) {
    throw `API error: ${error?.message}`
  }
}

export const getProviders = async (): Promise<any> => {
  const response = new Parse.Query("ProviderV1").equalTo("active", true)
  try {
    const result = await response.findAll()
    return result
  } catch (error: any) {
    throw `API error: ${error?.message}`
  }
}

export const getOperatories = async (location: IOption): Promise<any> => {
  try {
    const response = Parse.Object.extend("OperatoryV1")
    const query = new Parse.Query(response)

    /**
     * Exclude unnecessary fields from query.
     */
    excludeParseQueryFields({ query: query, whitelist: OPERATORY_WHITELIST })

    /**
     * Apply Filters
     */
    query.equalTo("location", location.value)

    const result = await query.find()

    let operatories = result.map((operatory: any): Operatory => operatory?.toJSON?.())

    operatories = _.orderBy(operatories, "shortName", "asc").map((operatory: Operatory, index: number) => ({
      ...operatory,
      className: index % 2 ? "bg-appointment-green" : "bg-appointment-blue",
    }))

    operatories = operatories.filter((opt: Operatory) => opt.objectId && opt.active)

    updateHeaderRow(operatories)
    updateTimeSlots()
    
    return operatories
  } catch (error: any) {
    throw `API error: ${error?.message}`
  }
}
