import { Fragment, useMemo, useState } from "react"
import { Dialog, Menu, Transition } from "@headlessui/react"
import { ChevronLeftIcon, CogIcon, MenuAlt2Icon, MoonIcon, PhotographIcon, SearchCircleIcon, XIcon, LogoutIcon } from "@heroicons/react/outline"
import shortid from "shortid"
import { useDispatch } from "react-redux"
import classNames from "classnames"

import Avatar from "../components/DataDisplay/Avatar"
import Dropdown from "../components/DataDisplay/Dropdown"
import Icon from "../components/DataDisplay/Icon"

import Assets from "../constants/AssetsConstants"

import { NavItem } from "./AppLayout"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"
import { logout } from "../Store/Auth/actions"
import { BsToggleOn } from "react-icons/bs"
import PatientSelect from "../components/Inputs/PatientSelect"

export default function VerticalLayout({ navItems, children, toggleNavigation }: { navItems: NavItem[]; children?: JSX.Element; toggleNavigation: () => void }): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
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
        icon: BsToggleOn,
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

  return (
    <div className="relative w-full h-screen flex flex-row overflow-hidden">
      {/* Narrow sidebar */}
      <div>
        <div className="hidden h-full w-28 dark:bg-black-900 border-r dark:border-0 bg-white overflow-y-auto md:block z-50">
          <div className="w-full h-full py-6 flex flex-col items-center">
            <div className="flex-shrink-0 flex items-center">
              <a href="/">
                <img className="h-12 w-auto logo" src={Assets.APP_LOGO} alt="Total Health" />
              </a>
            </div>
            <div className="flex-1 flex flex-col justify-start mt-6 w-full px-2 space-y-1 capitalize">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.url}
                  // onClick={null}
                  className={classNames(
                    item.url === location.pathname ? "dark:bg-black-700 dark:text-white bg-gray-100 text-gray-800" : "dark:text-black-600 text-gray-600 dark:hover:bg-black-700 dark:hover:text-white hover:text-gray-800",
                    "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium hover:bg-gray-100 capitalize text-center"
                  )}
                >
                  <item.icon className="h-6 w-6 capitalize" aria-hidden="true" />
                  <span className="mt-2">{item.name}</span>
                </Link>
              ))}
              <div style={{ marginTop: "auto" }}>
                <Dropdown
                  // onChange={handleDropdown}
                  items={dropdownOptions}
                  variant="nav-desktop"
                  menuStyles={{
                    left: "8rem",
                    right: "auto",
                    bottom: "1.75rem",
                    transformOrigin: "bottom left",
                  }}
                >
                  <Menu.Button className="w-full">
                    <div className={classNames("text-gray-600 dark:hover:bg-black-700 hover:bg-gray-100 dark:hover:text-white hover:text-gray-700 group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium")}>
                      <Avatar image={null} className="text-gray-700 bg-transparent border border-gray-300 text-xl dark:text-white" firstName="Abdul" size="user" />
                    </div>
                  </Menu.Button>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="md:hidden" onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-30 flex">
            <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <div className="relative max-w-xs w-full dark:bg-black-900 bg-white pt-5 pb-4 flex-1 flex flex-col">
                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="absolute top-1 right-0 -mr-14 p-1">
                    <button className="focus:ring-2 focus:ring-white p-2 text-white rounded-full border w-10 h-10 text-lg" onClick={() => setMobileMenuOpen(false)}>
                      <Icon icon={XIcon} />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 px-4 flex items-center">{/* <img className="h-12 w-auto logo" src={logo} alt="Workflow" /> */}</div>
                <div className="mt-5 flex-1 h-0 px-2 overflow-y-auto">
                  <nav className="h-full flex flex-col space-y-2">
                    {navItems.map((item, index) => (
                      <Link
                        key={shortid.generate()}
                        // href={item.href}
                        // onClick={item.name === "schedule" ? handleAppointmentClose : item.onClick ? item.onClick : null}
                        to={item.url || "#"}
                        onClick={item.onClick && item.onClick}
                        className={classNames(
                          item.url === location.pathname ? "dark:bg-black-700 dark:text-white bg-gray-100 text-gray-800" : "dark:text-black-600 text-gray-600 dark:hover:bg-black-700 hover:bg-gray-100 dark:hover:text-white hover:text-gray-800",
                          "group py-4 px-3 rounded-md flex items-center text-md font-medium capitalize"
                        )}
                      >
                        <item.icon className={classNames(item.url === location.pathname ? "dark:text-white text-gray-800" : "dark:text-black-600 text-gray-600 group-hover:text-gray-800 dark:group-hover:text-white", "mr-3 h-6 w-6")} aria-hidden="true" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    <div className="relative w-full capitalize mt-auto">
                      <Dropdown
                        // onChange={handleDropdown}
                        variant="nav-mobile"
                        items={dropdownOptions}
                        menuStyles={{ transformOrigin: "top" }}
                      >
                        <Menu.Button className="w-full">
                          <div className={classNames("dark:text-black-600 text-gray-600 dark:hover:bg-black-700 hover:bg-gray-100 dark:hover:text-white hover:text-gray-800 group py-4 px-3 rounded-md flex items-center text-md font-medium")}>
                            <Avatar firstName={"Abdul"} className="w-7 h-7 mr-3 border  p-4" image={null} />
                            Abdul Rehman
                          </div>
                        </Menu.Button>
                      </Dropdown>
                    </div>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Content area */}
      <div className="flex-1 flex flex-col w-full">
        <header className="w-full hidden sm:block">
          <div className="relative z-100 flex-shrink-0 h-16 dark:bg-black-800 bg-white border-b border-gray-200 dark:border-black-900 shadow-sm flex">
            <button type="button" className="border-r border-gray-200 dark:border-black-900 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 flex items-center justify-center md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 flex justify-between items-center px-2">
              <div className="w-full dark:text-white">
                <PatientSelect
                  rowClickAble={false}
                  nonEditable
                  borderLess
                  iconClassName="h-6 w-6"
                  avatarClassName="dark:bg-black-900 w-6 h-6"
                  className="h-15 dark:bg-black-800"
                  // onChange={handleSelectPatient}
                />
                <span className="hidden opacity-0 h-6 w-6 h-15 dark:bg-black-800"></span>
                <span className="hidden opacity-0 dark:bg-black-900"></span>
              </div>
            </div>
          </div>
        </header>
        <header className="w-full sm:hidden">
          <div className="relative z-100 flex-shrink-0 h-16 bg-white border-b border-gray-200 dark:border-black-800 dark:bg-black-700 shadow-sm flex">
            <button type="button" className="border-r border-gray-200 px-4 text-gray-500 dark:text-gray-200 dark:border-black-800 flex items-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex-1 flex justify-between px-4 sm:px-6">
              <div className="flex items-center justify-between w-full">
                <h2 className="font-bold text-xl dark:text-white capitalize">{location.pathname.replace("/", "")}</h2>

                <div className="ml-3 max-w-xs w-full dark:text-white">
                  <PatientSelect rowClickAble={false} nonEditable onChange={() => null} placeholder="Search Patient" />
                </div>
              </div>
            </div>

            {/* <div className="ml-auto w-44 flex items-center mr-5">
              <div className="w-full">
                <Select options={locationsArray} value={locationsArray.find((l) => l.id === location?.id)} valueKey="name" defaultValue={0} onChange={updateLocation} key="id" />
              </div>
            </div> */}
          </div>
        </header>

        {/* Main content */}
        <div className={`flex-1 flex items-stretch overflow-hidden relative main`}>
          <main className="flex-1 overflow-y-auto relative p-5">{children}</main>
        </div>
      </div>
    </div>
  )
}
