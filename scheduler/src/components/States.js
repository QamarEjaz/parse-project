import Parse from "parse"
import React, { useEffect, useState } from "react"

export default function States(props) {
  const { value, onChange, error, helpertext, name, title } = props
  const [insuranceStates, setInsuranceStates] = useState([])

  useEffect(() => {
    const fetchConfigProviders = async () => {
      const config = await Parse.Config.get()
      const statesDate = config.get("states")
      setInsuranceStates(statesDate ?? [])
    }
    fetchConfigProviders() 
  }, [])

  return (
    <div className="text-mobile-grey-600 mt-3">
      { title && <div className="mb-1"> <label> {title} </label> </div> }

      <select
        name={name}
        className={`w-full py-2 bg-white px-3 placeholder-mobile-grey-400 text-sm rounded-md border border focus:ring-0 p-2 ${
          error ? "border border-red-400" : "border-gray-300"
        }`}
        value={value}
        onChange={onChange}
      >
        <option value="">Select state</option>
        {insuranceStates?.map((op) => (
          <option value={op} key={op}>
            {op}
          </option>
        ))}
      </select>
      {error && <span className="text-sm mt-1 text-red-400">{helpertext}</span>}
    </div>
  )
}
