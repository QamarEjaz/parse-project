import { IRowAnimationProps } from "./RowAnimation.interfaces"

const RowAnimation = ({ count }: IRowAnimationProps): JSX.Element => {
  return (
    <tr className="animate-pulse" role={"row"}>
      {count.map((c, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm flex-1" role="cell">
          <div className="flex items-center">
            <div className="h-3 bg-gray-200 dark:bg-black-700 w-48 rounded-full"></div>
          </div>
        </td>
      ))}
    </tr>
  )
}

export default RowAnimation
