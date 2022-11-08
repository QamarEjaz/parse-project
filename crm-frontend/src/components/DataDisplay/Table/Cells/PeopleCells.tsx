import Pill from "../../Pill"

export const NameCell = ({ value }: { value: string }): JSX.Element => {
  return <span className="dark:text-white text-gray-400">{value}</span>
}

export const PeopleCell = ({ value }: { value: string }): JSX.Element => {
  return <span className="inline-flex items-center py-1 float-left border border-transparent text-md cursor-pointer rounded-full dark:text-white text-system-success-900 dark:bg-black-700 bg-system-success-100">{value}</span>
}

export const StatusCell = ({ value }: { value: string }): JSX.Element => {
  return (
    <span className="inline-flex items-center py-1 float-left border border-transparent text-md font-semibold cursor-pointer rounded-full dark:text-white text-system-success-900 dark:bg-black-700 bg-system-success-100 uppercase">
      <Pill label={value ? value?.toString()?.slice(0, 1)?.toUpperCase() + value?.toString()?.slice(1) : "No Status  "} bgClass="bg-emerald-100" textClass="text-emerald-900" />
    </span>
  )
}

export const CreatedCell = ({ value }: { value: Date }): JSX.Element => {
  return (
    <span className="inline-flex items-center py-1 float-left border border-transparent text-md cursor-pointer rounded-full dark:text-white text-system-success-900 dark:bg-black-700 bg-system-success-100">
      {value?.toLocaleString("default", { month: "long" })}
      &nbsp;
      {value?.getDate()}
      ,&nbsp;
      {value?.getFullYear()}
      &nbsp;
      {value?.toLocaleString("default", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}
      &nbsp;
    </span>
  )
}

export const Delete = ({ value }: any): JSX.Element => {
  return (
    <span className="inline-flex items-center py-1 float-left border border-transparent text-md font-semibold cursor-pointer rounded-full dark:text-white text-violet-700 dark:bg-black-700 bg-system-success-100 uppercase" onClick={value}>
      Delete
    </span>
  )
}
