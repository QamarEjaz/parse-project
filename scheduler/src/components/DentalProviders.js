import Parse from "parse"
import React, { useEffect, useState } from "react"

export default function DentalProviders(props) {
  const { value, onChange, error, helpertext, name, title } = props
  const [insuranceProviders, setInsuranceProviders] = useState([])

  useEffect(() => {
    const fetchConfigProviders = async () => {
      const config = await Parse.Config.get()
      const insuranceProvidersData = config.get("insuranceProviders")
      setInsuranceProviders(insuranceProvidersData ?? [])
    }
    fetchConfigProviders()
  }, [])

  return (
    <div className="text-mobile-grey-600 mt-3 ">
      { title && <div className="mb-1"> <label> {title} </label> </div> }
      <select
        id="dental-provider"
        name={name}
        className={`w-full py-2 bg-white px-3 placeholder-mobile-grey-400 focus:outline-none shadow-sm border focus:ring-0
         rounded-md transition text-sm ${
          error ? "border border-red-400" : "border-gray-300"
        } `}
        value={value}
        onChange={onChange}
      >
        <option value="">Select Insurance Provider</option>
        {insuranceProviders?.map((op) => (
          <option value={op} key={op}>
            {op}
          </option>
        ))}
      </select>
      {error && <span className="text-sm mt-1 text-red-400">{helpertext}</span>}
    </div>
  )
}
