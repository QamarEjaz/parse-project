import React, { Fragment, useEffect } from "react"
import shortid from "shortid"
import classNames from "classnames"

import { Menu, Transition } from "@headlessui/react"
import Icon from "../Icon"

import { IDropdownNavDesktop } from "./DropdownNavDesktop.interfaces"
import { IDropdownProps } from "./Dropdown.interfaces"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getPolicyList } from "../../../Store/Automation/actions"

const NavItem = ({ items, children, ...props }: IDropdownProps): JSX.Element => {
  const getNavSingleItem = (item: IDropdownNavDesktop, index: number): JSX.Element => {
    const dispatch = useDispatch()
    let activePolicy = useSelector((state: any) => state?.Automation?.policyList)

    useEffect(() => {
      dispatch(getPolicyList())
    }, [])

    return (
      <React.Fragment key={shortid.generate()}>
        <Menu.Item>
          {({ active }) => {
            if (item?.url) {
              return (
                <Link onClick={() => props?.onChange?.(item)} to={item?.url || "#"} className={classNames(active || item?.current ? "dark:bg-black-700 bg-gray-100 dark:text-white text-gray-900" : "dark:text-black-600 text-gray-700", " px-4 py-2 text-sm flex items-center w-full")}>
                  {item.icon && <Icon icon={item.icon} fontSize="text-2xl" classNames="mr-3" />}
                  {item.name}
                </Link>
              )
            }
            return (
              <button onClick={item.onClick} className={classNames(active || item?.current ? "dark:bg-black-700 bg-gray-100 dark:text-white text-gray-900" : "dark:text-black-600 text-gray-700", " px-4 py-2 text-sm flex items-center w-full")}>
                {item.count ? <span className="w-7 h-7 mr-3 w-full h-full border rounded-full py-1">{activePolicy?.filter((name: any) => name.isActive == true).length}</span> : item.icon ? <Icon icon={item.icon} fontSize="text-2xl" classNames="mr-3" /> : ""}
                {item.name}
              </button>
            )
          }}
        </Menu.Item>

        {/* Divider */}
        {index !== items.length - 1 && <div className={`w-full border-t my-1 border-gray-100 dark:border-black-700`}></div>}
      </React.Fragment>
    )
  }

  return (
    <Menu as="div" className="inline-block text-left w-full">
      <div>{children}</div>

      <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
        <Menu.Items className={`absolute z-30 mt-2 w-56 rounded-md shadow-lg bg-white border dark:bg-black-900 dark:border-transparent`} style={props.menuStyles}>
          <div className="py-1">
            {items.map((item: IDropdownNavDesktop, index: number) => {
              return <React.Fragment key={index}>{getNavSingleItem(item, index)}</React.Fragment>
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default NavItem
