export const FollowUpCell = ({ value }: { value: string }) => {
  return (
    <div className="whitespace-nowrap text-sm flex justify-center items-center mr-8">
      <span className="font-bold dark:text-white text-gray-400">{value}</span>
    </div>
  )
}

export const OriginCell = ({ value }: { value: string }) => {
  return (
    <div className="whitespace-nowrap text-sm">
      <div className="flex items-center text-gray-400 uppercase">{value}</div>
    </div>
  )
}

export const StatusCell = ({ value }: { value: string }) => {
  return (
    <div className="whitespace-nowrap text-sm">
      <span className="inline-flex items-center px-4 py-1 float-left border border-transparent text-md font-semibold cursor-pointer rounded-full dark:text-white text-system-success-900 dark:bg-black-700 bg-system-success-100 uppercase">{value ? "NEW" : "EXISTING"}</span>
    </div>
  )
}
