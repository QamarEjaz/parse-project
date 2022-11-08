import React from "react"
import { SearchIcon } from "@heroicons/react/outline"

interface IUsersFilterProps {
  onClickFilterCallback?: (e: string) => void
  defaultKeyword?: string
}

const UsersFilter = ({ onClickFilterCallback, defaultKeyword }: IUsersFilterProps): JSX.Element => {
  const [keyword, setKeyword] = React.useState(defaultKeyword)
  const onKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setKeyword(e.target.value)
    onClickFilterCallback && onClickFilterCallback(e.target.value)
  }
  return (
    <div className="flex justify-center">
      <div className="">
        <label className="flex gap-x-2 items-baseline w-full">
          <div className="relative flex-grow focus-within:z-10 flex rounded-md border border-gray-300 dark:border-black-900">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="flex-shrink-0 h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              onChange={onKeywordChange}
              value={keyword}
              type="text"
              name="desktop-search-candidate"
              id="desktop-search-candidate"
              className="py-2.5 dark:bg-black-800 focus:outline-none dark:text-white h-full focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-md pl-10 sm:block sm:text-sm border-gray-300"
              placeholder="Search"
            />
          </div>
        </label>
      </div>
    </div>
  )
}

export default UsersFilter
