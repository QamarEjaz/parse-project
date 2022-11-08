import React, { useEffect } from "react"
import { CalendarIcon, ChevronLeftIcon, FilterIcon, LocationMarkerIcon } from "@heroicons/react/outline"

import { DatePickerCalendar } from "react-nice-dates"

import "react-nice-dates/build/style.css"
import { enGB } from "date-fns/locale"

import "./styles.css"
import { useRef } from "react"
import classNames from "classnames"
import { Switch } from "@headlessui/react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../../components/Inputs/Button"
import Icon from "../../../components/DataDisplay/Icon"
import Select from "../../../components/Inputs/Select"
import { getLocation, getProvider } from "../../../Store/Appointment/actions"
import { setDate } from "../../../Store/Schedule/actions"
import { MultiValue } from "react-select"
import { APPT_STATUS_OPTIONS } from "../../../utils/SelectOptions"
import MultiSelect from "../../../components/Inputs/MultiSelect"
import useMultiSelectOptions from "../../../hooks/useMultiSelectOptions"
import useLocationsSelect from "../../../hooks/useLocationsSelect"

interface IAsideProps {
  setIsCreatingAppt: (val: boolean) => void
  setLocation: any
  location: any
  providers: MultiValue<any>
  setProviders: (options: MultiValue<any>) => void
  apptStatus: MultiValue<any>
  setApptStatus: (options: MultiValue<any>) => void
  setShowApptInfo: any
  showApptInfo: boolean

  providersData: any
}

const Aside = ({ setIsCreatingAppt, setLocation, location, providersData, setProviders, setApptStatus, providers, apptStatus, showApptInfo, setShowApptInfo }: IAsideProps): JSX.Element => {
  const dispatch = useDispatch()
  const date = useSelector((state: any) => state?.Schedule.date)

  const scheduleLocation = useSelector((state: any) => state?.Appointment?.location)

  const appointment = useSelector((state: any) => state?.Appointment)
  const [locationArrayState] = useLocationsSelect(appointment?.locations || [])
  const [providerArrayState] = useMultiSelectOptions(providersData || [])

  const isNavbarVertical = useSelector((state: any) => state?.Layout?.isNavbarVertical)

  useEffect(() => {
    dispatch(getLocation())
    dispatch(getProvider())
  }, [])

  const locationRef = useRef<HTMLDivElement>(null)
  const sidePanelRef = useRef<HTMLDivElement>(null)
  const toggleIconRef = useRef<HTMLDivElement>(null)
  const openContentRef = useRef<HTMLDivElement>(null)
  const closeContentRef = useRef<HTMLDivElement>(null)

  const openLocationDropdown = (): void => {
    openSidePanel()
    locationRef?.current?.click()
  }

  const openStatusDropdown = (): void => {
    openSidePanel()
  }

  const openSidePanel = (): void => {
    toggleIconRef?.current?.classList?.remove("rotate-180")
    sidePanelRef?.current?.classList?.remove("w-14")
    sidePanelRef?.current?.classList?.add("w-64")
    closeContentRef?.current?.classList?.replace("flex", "hidden")
    openContentRef?.current?.classList?.replace("hidden", "flex")
  }

  const closeSidePanel = (): void => {
    toggleIconRef?.current?.classList?.add("rotate-180")
    sidePanelRef?.current?.classList?.remove("w-64")
    sidePanelRef?.current?.classList?.add("w-14")
    closeContentRef?.current?.classList?.replace("hidden", "flex")
    openContentRef?.current?.classList?.replace("flex", "hidden")
  }

  const toggleSidePanel = (): void => {
    if (sidePanelRef?.current?.classList?.contains("w-64") /* if open */) {
      closeSidePanel()
    } else {
      openSidePanel()
    }
  }

  return (
    <>
      <div className={`relative h-full d-flex bg-white dark:bg-black-800 dark:border-black-900 border-r transition-all duration-300 w-64`} ref={sidePanelRef}>
        <div className="flex-col h-full justify-between flex" ref={openContentRef}>
          <div className="overflow-auto flex-1 justify-center flex-col space-y-2 px-6 pt-16 pb-10">
            <div>
              <div className="capitalize">
                <div className="">
                  <dl className="divide-y dark:divide-black-900 divide-gray-200">
                    <Switch.Group as="div" className="flex justify-between items-center">
                      <Switch.Label as="dt" className="text-xs font-normal dark:text-white text-gray-500" passive>
                        Appt Info
                      </Switch.Label>
                      <dd className="mt-1 text-sm dark:text-white text-gray-900">
                        <Switch
                          checked={showApptInfo}
                          onChange={(): void => setShowApptInfo(!showApptInfo)}
                          className={classNames(
                            showApptInfo ? "bg-gray-600" : "dark:bg-black-900 bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 dark:focus:ring-offset-transparent focus:ring-offset-2 focus:ring-gray-500 sm:ml-auto"
                          )}
                        >
                          <span aria-hidden="true" className={classNames(showApptInfo ? "translate-x-5" : "translate-x-0", "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200")} />
                        </Switch>
                      </dd>
                    </Switch.Group>
                  </dl>
                </div>
              </div>
            </div>
            <div className="simple-calendar pt-2">
              <div>
                <h1 className="text-xl dark:text-white text-black-800 font-semibold mb-2">Calendar</h1>
              </div>
              <div>
                <DatePickerCalendar date={new Date(date)} month={new Date(date)} onDateChange={(date): { type: string; payload: Date } | null => (date ? dispatch(setDate(date)) : null)} locale={enGB} />
              </div>
            </div>
            <div className={`${isNavbarVertical ? "block" : "block lg:hidden"}`}>
              <Select
                label="Location"
                value={scheduleLocation}
                selectRef={locationRef}
                options={locationArrayState}
                onChange={(event: any): void => {
                  dispatch(setLocation(event))
                }}
                key="id"
              />
              {/* <Select label="Location" selectRef={locationRef} options={locationArrayState} value={location} onChange={(event: any) => setLocation(event)} key="id" /> */}
            </div>
            <div className="capitalize">
              <div>
                <label className="input-label">Status</label>
                <div className="mt-1">
                  <MultiSelect
                    variant="simple"
                    backgroundColor="#fff"
                    border="1px solid #d1d5db"
                    borderRadius="6px"
                    menuBorderRadius="6px"
                    isDark={false}
                    options={APPT_STATUS_OPTIONS}
                    value={apptStatus}
                    isClearable={false}
                    onChange={(options): void => {
                      setApptStatus(options)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="capitalize">
              <div>
                <label className="input-label">Provider</label>
                <div className="mt-1">
                  <MultiSelect
                    variant="simple"
                    backgroundColor="#fff"
                    border="1px solid #d1d5db"
                    borderRadius="6px"
                    menuBorderRadius="6px"
                    isDark={false}
                    options={providerArrayState}
                    isClearable={false}
                    value={providers}
                    onChange={(options): void => {
                      setProviders(options)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 flex-shrink-0 flex justify-center px-4 dark:bg-black-800 bg-white border-t border-gray-200 dark:border-black-900 py-5 sm:px-6">
            <Button variant="contained" color="gray-dark" className="w-full" onClick={(): void => setIsCreatingAppt(true)}>
              Create Appointment
            </Button>
          </div>
        </div>
        <div className={`w-full items-center flex-col pt-16 space-y-5 hidden`} ref={closeContentRef}>
          <button className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-black-900 bg-gray-700 hover:shadow-lg transition-shadow text-white" onClick={(): void => openSidePanel()}>
            <Icon icon={CalendarIcon} fontSize="text-lg"></Icon>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-black-900 bg-gray-700 hover:shadow-lg transition-shadow text-white" onClick={openLocationDropdown}>
            <Icon icon={LocationMarkerIcon} fontSize="text-lg"></Icon>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-black-900 bg-gray-700 hover:shadow-lg transition-shadow text-white" onClick={openStatusDropdown}>
            <Icon icon={FilterIcon} fontSize="text-lg"></Icon>
          </button>
        </div>
      </div>

      <button className="w-8 h-8 rounded-full p-2 relative top-4 -left-4 z-30 dark:bg-black-900 dark:text-white border border-transparent dark:border-black-400 bg-white hover:bg-gray-50 text-primary transition duration-200" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.2)" }} onClick={toggleSidePanel}>
        <span className={`transition-transform duration-200 transform block`} ref={toggleIconRef}>
          <ChevronLeftIcon />
        </span>
      </button>
    </>
  )
}

export default Aside
