import { ICheckboxProps } from "./Checkobx.interfaces"
import "../../../index.css"

const Checkbox = ({ label, id, name, onChange, checked, defaultChecked }: ICheckboxProps): JSX.Element => {
  return (
    <>
      {label ? (
        <>
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                type="checkbox"
                id={id || "checkbox1"}
                aria-describedby="comments-description"
                name={name || "checkbox1"}
                className="mr-2 dark:bg-transparent accent-emerald-500/25 border-2 border-gray-300 rounded h-5 w-5 p-0.5"
                defaultChecked={defaultChecked}
                checked={checked}
                onChange={onChange}
              />
            </div>
            <div className="ml-1 text-sm">
              <label htmlFor={id} className="font-medium dark:text-white text-gray-600 text-sm md:text-base">
                {label}
              </label>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                type="checkbox"
                id={id || "checkbox1"}
                aria-describedby="comments-description"
                name={name || "checkbox1"}
                className="mr-2 dark:bg-transparent accent-emerald-500/25 border-2 border-gray-300 rounded h-5 w-5 p-0.5"
                defaultChecked={defaultChecked}
                checked={checked}
                onChange={onChange}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Checkbox