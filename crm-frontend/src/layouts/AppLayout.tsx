import { Outlet } from "react-router"
import { CalendarIcon, UserGroupIcon, VideoCameraIcon } from "@heroicons/react/outline"

import HorizontalNav from "./HorizontalNav"
import VerticalNav from "./VerticalNav"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setNavbarVertical } from "../Store/Layout/actions"

export interface NavItem {
  id: number
  name: string
  url: string
  icon: any // fix this
  current: boolean
  onClick?: () => {}
}

const navItems: NavItem[] = [
  {
    id: 1,
    name: "Schedule",
    url: "/schedule",
    icon: CalendarIcon,
    current: false,
  },
  {
    id: 2,
    name: "Virtual",
    url: "/virtuals",
    icon: VideoCameraIcon,
    current: false,
  },
  {
    id: 3,
    name: "People",
    url: "/people-management",
    icon: UserGroupIcon,
    current: false,
  },
  // {
  //   id: 4,
  //   name: "Appointments",
  //   url: "/appointments",
  //   icon: CalendarIcon,
  //   current: false,
  // },
]

const AppLayout = (): JSX.Element => {
  const isNavbarVertical = useSelector((state: any) => state?.Layout?.isNavbarVertical)
  const dispatch = useDispatch()

  const toggleNavigation = (): void => {
    dispatch(setNavbarVertical(!isNavbarVertical))
  }

  return (
    <>
      <div className={`relative w-full h-screen flex-col flex overflow-hidden`}>
        {isNavbarVertical ? (
          <VerticalNav navItems={navItems} toggleNavigation={toggleNavigation}>
            <Outlet />
          </VerticalNav>
        ) : (
          <HorizontalNav navItems={navItems} toggleNavigation={toggleNavigation}>
            <Outlet />
          </HorizontalNav>
        )}
      </div>
    </>
  )
}

export default AppLayout
