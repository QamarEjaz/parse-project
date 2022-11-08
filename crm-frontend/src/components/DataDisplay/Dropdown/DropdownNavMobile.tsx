import { Fragment } from "react"
import shortid from "shortid"
import classNames from "classnames"

import { Menu, Transition } from "@headlessui/react"
import Icon from "../Icon"

import { IDropdownNavDesktop } from "./DropdownNavDesktop.interfaces"
import { IDropdownProps } from "./Dropdown.interfaces"
import { Link } from "react-router-dom"

const Responsive = ({ items, children, ...props }: IDropdownProps): JSX.Element => {
  return (
    <Menu as="div" className={`inline-block text-left w-full`}>
      <div>{children}</div>

      <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="block mt-2 md:hidden w-full" style={props.menuStyles}>
          {items.map((item: IDropdownNavDesktop, index: number) => {
            if (item?.url) {
              return (
                <div key={shortid.generate()}>
                  <Link
                    onClick={() => props?.onChange?.(item)}
                    key={shortid.generate()}
                    to={item?.url || "#"}
                    className={
                      (classNames(item.current ? "dark:bg-black-700 bg-gray-100 dark:text-white text-gray-800" : "dark:text-black-600 text-gray-600"),
                      "cursor-pointer text-gray-600 dark:hover:text-white hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-black-700 group py-3 px-3 rounded-md flex items-center text-sm font-medium w-full")
                    }
                    aria-current="page"
                  >
                    {item.icon ? <Icon icon={item.icon} fontSize="text-2xl" classNames="mr-3"></Icon> : null}
                    {item.name}
                  </Link>
                </div>
              )
            }
            return (
              <div key={shortid.generate()}>
                <button
                  onClick={() => item?.onClick?.()}
                  key={shortid.generate()}
                  className={
                    (classNames(item.current ? "dark:bg-black-700 bg-gray-100 dark:text-white text-gray-800" : "dark:text-black-600 text-gray-600"),
                    "cursor-pointer text-gray-600 dark:hover:text-white hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-black-700 group py-3 px-3 rounded-md flex items-center text-sm font-medium w-full")
                  }
                  aria-current="page"
                >
                  {item.icon ? <Icon icon={item.icon} fontSize="text-2xl" classNames="mr-3"></Icon> : null}
                  {item.name}
                </button>
              </div>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Responsive
