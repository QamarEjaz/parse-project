import { ITabItemProps } from "./TabItem.interfaces"

const TabItem = ({ text, active, onClick }: ITabItemProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-semibold rounded-md dark:hover:bg-black-900 hover:bg-gray-50 dark:hover:text-white focus:outline-none focus:ring-2 dark:focus:ring-offset-black-700 focus:ring-offset-2 focus:ring-gray-500 ${
        active ? "dark:text-white dark:bg-black-900 bg-gray-50" : "dark:text-black-600"
      } sm:px-4 sm:py-1 sm:text-base`}
    >
      {text}
    </button>
  )
}

export default TabItem
