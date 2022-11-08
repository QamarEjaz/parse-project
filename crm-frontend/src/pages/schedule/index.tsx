import { useEffect, useRef } from "react"
import ScheduleTemplate from "./schedule-template"

import Aside from "./aside"

import CreateAppointment from "./modals/CreateAppointment"
import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import { getPatientTypes } from "../../Store/Patient/actions"
import useLocalStorage from "use-local-storage"
import { MultiValue } from "react-select"
import { IAppointment, ICellData } from "./schedule-template/Template.interfaces"
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar"
import { IOption as IMultiSelectOption } from "../../components/Inputs/MultiSelect/MultiSelect.interfaces"
import { IOption } from "../../components/Inputs/Select/Select.interfaces"
import { setLocation } from "../../Store/Appointment/actions"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAppointments, getOperatories, getProviders } from "./services/Appointment.service"

import Parse from "parse"
import useSubscription from "./subscriptions/useSubscription"
import { addAppointment, deleteAppointment, updateAppointment } from "./utils"

const queryOptions = {
  staleTime: Infinity,
  cacheTime: Infinity,
}

const appointmentQuery = new Parse.Query("AppointmentV1")

const Schedule = (): JSX.Element => {
  const dispatch = useDispatch()

  const [selectedAppt, setSelectedAppt] = useState<IAppointment | null>(null)
  const [selectedCell, setSelectedCell] = useState<ICellData | null>(null)

  const loadingProgressRef = useRef<LoadingBarRef | null>(null)

  const location = useSelector((state: any) => state?.Appointment?.location)

  const [isCreatingAppt, setIsCreatingAppt] = useState(false)

  // Filters
  const [showApptInfo, setShowApptInfo] = useLocalStorage("showApptInfo", false)
  const [providers, setProviders] = useLocalStorage<MultiValue<IMultiSelectOption>>("providers-filter", [])
  const [apptStatus, setApptStatus] = useLocalStorage<MultiValue<IMultiSelectOption>>("appt-status-filter", [])

  const date = useSelector((state: any) => state?.Schedule.date)

  // React hook query
  const queryClient = useQueryClient()

  const { data: appointments } = useQuery(["schedule-appts", date, location, providers, apptStatus], () => getAppointments(date, location, providers, apptStatus, loadingProgressRef, appointmentQuery), queryOptions)
  const { data: providersData } = useQuery(["schedule-providers"], () => getProviders(), queryOptions)
  const { data: operatories } = useQuery(["schedule-operatories", location], () => getOperatories(location), queryOptions)

  const updateAppointmentClosure = (appointment: IAppointment): void => {
    updateAppointment(appointment, queryClient, date, location, providers, apptStatus)
  }

  useEffect(() => {
    dispatch(getPatientTypes())
  }, [])

  useEffect(() => {
    const operatoriesFetched = operatories?.length > 0
    const appointmentsFetched = appointments?.data?.length > 0
    const providersFetched = providersData?.length > 0

    if (operatoriesFetched && appointmentsFetched && providersFetched) {
      loadingProgressRef?.current?.complete()
    }
  }, [operatories, appointments, providersData])

  useSubscription(addAppointment, updateAppointment, deleteAppointment, appointmentQuery, queryClient, date, location, providers, apptStatus)

  return (
    <div className="h-full flex flex-col absolute inset-0">
      <LoadingBar color="#63b245" height={4} ref={loadingProgressRef} />

      <div className="flex-1 relative dark:bg-black-700 text-gray-400 flex overflow-hidden">
        <Aside
          providersData={providersData}
          showApptInfo={showApptInfo}
          setShowApptInfo={setShowApptInfo}
          setIsCreatingAppt={setIsCreatingAppt}
          setLocation={(location: any): { type: string; payload: IOption } => dispatch(setLocation(location))}
          location={location}
          providers={providers}
          setProviders={setProviders}
          apptStatus={apptStatus}
          setApptStatus={setApptStatus}
        />
        <section className={`h-full flex-1 dark:text-white relative ${operatories?.length ? "opacity-100" : "opacity-0"} delay-200`}>
          <ScheduleTemplate updateLocalAppointment={updateAppointmentClosure} setSelectedCell={setSelectedCell} setIsCreatingAppt={setIsCreatingAppt} setSelectedAppt={setSelectedAppt} operatories={operatories || []} appointments={appointments?.data || []} showApptInfo={showApptInfo} />
        </section>
      </div>
      {isCreatingAppt ? <CreateAppointment location={location} setSelectedCell={setSelectedCell} operatories={operatories} selectedAppt={selectedAppt} selectedCell={selectedCell} setSelectedAppt={setSelectedAppt} setIsCreatingAppt={setIsCreatingAppt} /> : null}
    </div>
  )
}

export default Schedule
