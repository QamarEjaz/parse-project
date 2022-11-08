import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Menu, Popover, Transition } from "@headlessui/react"
import { ChevronLeftIcon, ChevronRightIcon, CogIcon, MenuIcon, MoonIcon, XIcon, LogoutIcon, PlusIcon } from "@heroicons/react/outline"
import classNames from "classnames"
import shortid from "shortid"
import { useDispatch, useSelector } from "react-redux"

import Dropdown from "../components/DataDisplay/Dropdown"
import Icon from "../components/DataDisplay/Icon"
import Avatar from "../components/DataDisplay/Avatar"

import Assets from "../constants/AssetsConstants"

import { NavItem } from "./AppLayout"
import { Link, useLocation } from "react-router-dom"
import { logout } from "../Store/Auth/actions"

import { BsToggleOff } from "react-icons/bs"
import { formatDate } from "../utils/helpers"
import { DatePickerCalendar } from "react-nice-dates"
import { enGB } from "date-fns/locale"
import PatientSelect from "../components/Inputs/PatientSelect"
import Button from "../components/Inputs/Button"
import { nextDate, prevDate, setDate } from "../Store/Schedule/actions"
import { setLocation } from "../Store/Appointment/actions"
import Select from "../components/Inputs/Select"
import { getLocation } from "../Store/Appointment/actions"
import useLocationsSelect from "../hooks/useLocationsSelect"
import AutomateModal from "../components/AutomateComponents/AutomateModal"
import { getPolicyList, getSinglePolicySuccess } from "../Store/Automation/actions"

const HorizontalLayout = ({ navItems, children, toggleNavigation }: { navItems: NavItem[]; children?: JSX.Element; toggleNavigation: () => void }): JSX.Element => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [addAutomate, setAddAutomate] = useState(false)
  const [automateModalSection, setAutomateModalSection] = useState<any>()
  // const [automateCount, setAutomateCount] = useState<any>(0)
  const dispatch = useDispatch()
  // let activePolicy = useSelector((state: any) => state?.Automation?.policyList)

  // useEffect(() => {
  //   dispatch(getPolicyList())
  // }, [])
  // useEffect(() => {
  //   setAutomateCount(activePolicy?.filter((name: any) => name.isActive == true).length)
  // }, [automateCount])

  const dropdownOptions = useMemo(
    () => [
      {
        id: 1,
        name: "Settings",
        icon: CogIcon,
        url: "",
        current: false,
        onClick: () => null,
      },
      {
        id: 2,
        name: "Dark Mode",
        icon: MoonIcon,
        url: "",
        current: false,
        onClick: () => null,
      },
      {
        id: 3,
        name: "Navbar Style",
        icon: BsToggleOff,
        url: "",
        current: false,
        onClick: () => toggleNavigation(),
      },
      {
        id: 4,
        name: "Logout",
        icon: LogoutIcon,
        url: "",
        current: false,
        onClick: () => dispatch(logout()),
      },
    ],
    []
  )
  const automateDropdown = useMemo(
    () => [
      {
        id: 1,
        name: "Active Automation",
        url: "",
        count: true,
        current: false,
        onClick: () => {
          setAddAutomate(true)
          setAutomateModalSection(2)
        },
      },
      {
        id: 1,
        name: "Add automate",
        icon: PlusIcon,
        url: "",
        count: "",
        current: false,
        onClick: () => {
          setAddAutomate(true)
          setAutomateModalSection(1)
          dispatch(getSinglePolicySuccess(null))
        },
      },
    ],
    []
  )

  return (
    <>
      <div className="relative flex flex-col z-50 h-16">
        <div className={`transform ${isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto " : "-translate-y-5 opacity-0 pointer-events-none"} block lg:hidden  transition duration-300 absolute w-full shadow bg-white top-16 left-0 dark:bg-black-700 dark:text-white`}>
          <div className={`transform transition duration-300 absolute w-full shadow bg-white left-0 dark:bg-black-700 dark:text-white`}>
            <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.url || "#"}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(item.url === location.pathname ? "bg-gray-700 text-white" : "dark:hover:bg-black-800 hover:bg-gray-50", "rounded-md py-2 px-3 text-base font-medium flex items-center dark:text-gray-200 capitalize")}
                >
                  <Icon icon={item.icon} fontSize="text-xl" />
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
                <div className="flex-shrink-0">
                  <Avatar firstName={"Abdul"} className="w-10 h-10 border p-4" image={null} />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">Abdul Rehman</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-white">abdul@hellodrh.com</div>
                </div>
              </div>
              <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
                {dropdownOptions.map((item) => (
                  <div className="capitalize" onClick={() => setIsMenuOpen(false)} key={shortid.generate()}>
                    {item?.url ? (
                      <Link to={item?.url} key={item.id} className={"dark:hover:bg-black-800 hover:bg-gray-50 w-full rounded-md py-2 px-3 text-base font-medium text-gray-500  dark:text-gray-200 hover:text-gray-900 flex items-center capitalize"}>
                        <Icon icon={item.icon} fontSize="text-xl" />
                        <span className="ml-2">{item.name}</span>
                      </Link>
                    ) : (
                      <button onClick={() => item?.onClick()} key={item.id} className={"dark:hover:bg-black-800 hover:bg-gray-50 w-full rounded-md py-2 px-3 text-base font-medium text-gray-500  dark:text-gray-200 hover:text-gray-900 flex items-center capitalize"}>
                        <Icon icon={item.icon} fontSize="text-xl" />
                        <span className="ml-2">{item.name}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={`transform ${isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto " : "-translate-y-5 opacity-0 pointer-events-none"} hidden lg:block transition duration-300 absolute w-full shadow bg-white top-16 left-0 dark:bg-black-700 dark:text-white`}>
          <div className="mx-auto px-4 sm:px-5 grid grid-cols-2 h-17 lg:h-auto">
            <div className="py-6 pr-4">
              <h3 className="text-xl font-semibold mb-4 dark:text-white text-gray-500">Pages</h3>
              <ul className="grid grid-rows-5 grid-flow-col grid-cols-2 gap-2">
                {navItems.map((item, index) => (
                  <li className="capitalize" onClick={() => setIsMenuOpen(false)} key={shortid.generate()}>
                    <Link
                      key={item.id}
                      to={item.url}
                      className={`rounded-md flex items-center py-2 px-3 group ${item.url === location.pathname ? "text-primary bg-gray-100 dark:text-white dark:bg-black-800" : "text-gray-500 dark:text-gray-200 dark:hover:bg-black-800 hover:bg-gray-100 hover:text-primary"}  transition duration-100`}
                    >
                      <Icon icon={item.icon} fontSize="text-3xl" />
                      <span className="font-medium ml-3">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex h-16 justify-center items-center w-full mx-auto px-4 py-3.5 sm:px-5 border-b">
          <div className="w-full relative flex items-center justify-between">
            <div className="flex">
              <div className="flex items-center flex-1">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="rounded-md -mx-2 p-2 hidden lg:inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-black-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                >
                  <span className="sr-only">Open menu</span>
                  {isMenuOpen ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
                </button>
                <Link to="/" className="block lg:ml-5 mr-5">
                  <img className="block h-10 sm:h-12 logo" src={Assets.APP_LOGO} alt="Total Health Dental Care" />
                </Link>
                <h2 className="block lg:hidden font-bold text-xl dark:text-white capitalize">{location.pathname.replace("/", "")}</h2>
                <div className={`ml-5 lg:ml-0 w-52 lg:w-64 relative`}>
                  <PatientSelect rowClickAble={false} nonEditable tableContainerClassName={"patient-table-container z-30 absolute mt-2"} onChange={() => null} placeholder="Search Patient" />
                  <div className="hidden opacity-0 pointer-events-none patient-table-container z-30 absolute mt-2"></div>
                </div>
                <div className="font-normal text-sm">
                  <CalendarDate />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between lg:hidden">
              <button onClick={() => setIsMenuOpen((prevState) => !prevState)} className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-black-800 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                <span className="sr-only">Open menu</span>
                {isMenuOpen ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
              </button>
            </div>
            <div className="ml-auto">
              <Dropdown
                variant="nav-desktop"
                items={automateDropdown}
                menuStyles={{
                  left: "auto",
                  right: "40px",
                  top: "3rem",
                  transformOrigin: "top right",
                }}
              >
                <Menu.Button as="div" className="inline-block">
                  <Button variant="contained" className="text-base sm:text-base px-6" color="indigo" style={{ padding: "6px 33px" }} rounded>
                    <div className="flex items-center">
                      <span className="ml-2">Automate</span>
                    </div>
                  </Button>
                </Menu.Button>
              </Dropdown>
              <AutomateModal automateModalSection={automateModalSection} isOpen={addAutomate} closeModal={setAddAutomate} />
            </div>
            <div className="hidden lg:flex items-center capitalize">
              {/* Desktop menu */}
              <div>
                <Dropdown
                  variant="nav-desktop"
                  items={dropdownOptions}
                  menuStyles={{
                    left: "auto",
                    right: "0",
                    top: "3rem",
                    transformOrigin: "top right",
                  }}
                >
                  <Menu.Button className="inline-block">
                    <div className="ml-5 flex items-center">
                      <div className="h-8 w-8 rounded-full focus:outline-none focus:ring-2 dark:focus:ring-offset-black-700 focus:ring-gray-500 focus:ring-offset-2">
                        <Avatar firstName={"Abdul"} className="w-full h-full border" image={null} />
                      </div>
                    </div>
                  </Menu.Button>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex h-full">
          <div className="flex-1 flex items-stretch overflow-hidden">
            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-5 relative">{children}</main>
          </div>
        </div>
      </div>
    </>
  )
}

export default HorizontalLayout

const CalendarDate = (): JSX.Element => {
  const buttonRef = useRef(null)
  const date = useSelector((state: any) => state?.Schedule.date)
  const dispatch = useDispatch()

  const scheduleLocation = useSelector((state: any) => state?.Appointment?.location)

  useEffect(() => {
    dispatch(getLocation())
  }, [])

  const appointment = useSelector((state: any) => state?.Appointment)

  const [locationArrayState] = useLocationsSelect(appointment?.locations || [])

  if (window.location.pathname !== "/schedule") return <></>

  return (
    <div className="ml-5 hidden md:flex items-center">
      <div className=" space-x-1 flex-shrink-0 flex">
        <button onClick={(): { type: string } => dispatch(prevDate())} className="hover:bg-gray-100 transition-colors duration-200 text-lg w-7 h-7 flex justify-center items-center rounded-full">
          <Icon icon={ChevronLeftIcon} />
        </button>
        <button onClick={(): { type: string } => dispatch(nextDate())} className="hover:bg-gray-100 transition-colors duration-200 text-lg w-7 h-7 flex justify-center items-center rounded-full">
          <Icon icon={ChevronRightIcon} />
        </button>
      </div>

      <div className="ml-1 sm:ml-3 xl:ml-5 mr-2 hidden lg:block w-56">
        <Select value={scheduleLocation} options={locationArrayState} onChange={(event: any) => dispatch(setLocation(event))} key="id" />
      </div>
      <Popover className=" relative ml-1 mr-5">
        {({ open }) => (
          <>
            <Popover.Button className={" hover:bg-gray-100 dark:hover:bg-black-800 px-4 py-1 transition-colors duration-200 rounded-md"} ref={buttonRef}>
              <div className="font-medium text-xl text-gray-700 dark:text-white capitalize w-36">{formatDate(date, "MMM D, YYYY")}</div>
            </Popover.Button>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="translate-y-1.5 opacity-30" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
              <Popover.Panel className="absolute -top-2 bg-white dark:bg-black-800 rounded-lg left-1/2 z-10 mt-3 transform -translate-x-1/2 w-64">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black-1000 ring-opacity-5 p-4">
                  <DatePickerCalendar date={new Date(date)} onDateChange={(date): { type: string; payload: Date } | null => (date ? dispatch(setDate(date)) : null)} locale={enGB} />
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <div className="hidden lg:block">
        <Button variant="outlined" color="gray" onClick={(): { type: string; payload: Date } => dispatch(setDate(new Date()))}>
          Today
        </Button>
      </div>
    </div>
  )
}
