import { ChevronRightIcon } from "@heroicons/react/outline"
import { JsxElement } from "typescript"
import { formatDate } from "../../../../utils/helpers"
import Avatar from "../../Avatar"
import Counter from "../../Counter"
import Icon from "../../Icon"
import kick from "../../../../assets/images/kick.png"

export const PatientCell = ({
  value,
}: {
  value: any // fix this
}): JSX.Element => {
  return (
    <div className="whitespace-nowrap text-sm">
      <div className="flex items-center text-gray-500 uppercase space-x-3 dark:text-white">
        <Avatar firstName={value?.firstName} image={value?.profile_image} className="border w-10 h-10"></Avatar>
        <span>
          {value?.firstName} {value?.lastName}
        </span>
      </div>
    </div>
  )
}

export const DetailsCell = ({
  value,
  row,
}: {
  value: any // fix this
  row: any // fix this
}): JSX.Element => {
  const location = row.original?.appointment?.attributes?.location?.attributes?.name ?? ""
  return (
    <div className="whitespace-nowrap text-sm">
      {value ? (
        <div className="flex flex-col text-gray-500 dark:text-gray-300">
          <div className="font-bold">{location}</div>
          <div className="text-xs">
            {formatDate(value?.start, "hh:mm a")} {formatDate(new Date(), "MM/DD/YYYY") === formatDate(value?.start, "MM/DD/YYYY") ? "Today" : `| ${formatDate(value?.start, "MM/DD/YYYY")}`}
          </div>

          <div className="flex text-xs">
            waiting for <Counter start={row.original.createdAt} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const TeamCell = ({ value }: { value: any }): JSX.Element => {
  return (
    <div className="whitespace-nowrap text-sm">
      <div className="flex items-center text-gray-500 uppercase space-x-3 dark:text-white">
        <Avatar firstName={value?.attributes.firstName} image={value?.profile_image} className="border w-8 h-8"></Avatar>
        <span>
          {value?.attributes.firstName} {value?.attributes.lastName}
        </span>
      </div>
    </div>
  )
}

export const ChiefConcernCell = ({ value }: { value: any }): JSX.Element => {
  return (
    <div className="whitespace-pre-wrap text-sm w-44">
      <div className="flex items-center text-gray-400 uppercase text-ellipsis-3lines">{value}</div>
    </div>
  )
}

export const SocialHistoryCell = ({ value }: { value: any }): JSX.Element => {
  return (
    <div className="whitespace-pre-wrap text-sm w-44">
      <div className="flex items-center text-gray-400 uppercase text-ellipsis-3lines">{value}</div>
    </div>
  )
}

export const Level4Cell = ({ value }: { value: any }): JSX.Element => {
  return (
    <div className="whitespace-pre-wrap text-sm w-44">
      <div className="flex items-center text-gray-400 uppercase text-ellipsis-3lines" title={value}>
        {value}
      </div>
    </div>
  )
}

// fix any
export const ActionCell = ({ row, column }: { row: any; column: any }): JSX.Element => {
  return (
    <div className="whitespace-nowrap text-sm">
      <div className="flex items-center text-gray-400">
        {/* Discuss with Team: Bind prepare virtual event */}
        <button className="text-blue-500 flex items-center" onClick={(): void => column.onClick(row.original)}>
          <span> Prepare for virtual</span> <Icon classNames="text-xl ml-1 text-blue-400" icon={ChevronRightIcon}></Icon>
        </button>
      </div>
    </div>
  )
}

export const KickCell = ({ row, column }: { row: any; column: any }): JSX.Element => {
  return (
    <div className="whitespace-nowrap text-sm">
      <div className="items-center flex justify-end">
        <button className="flex items-center" onClick={(): void => column.onClick(row.original)}>
          <span className="text-xl object-contain">
            <img src={kick} />
          </span>
        </button>
      </div>
    </div>
  )
}
