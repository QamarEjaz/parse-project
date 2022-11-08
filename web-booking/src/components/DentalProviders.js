import Parse from "parse"
import React, { useEffect, useState } from "react"

export default function DentalProviders(props) {
  const { value, onChange, error, helpertext, name } = props
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
    <div className="text-mobile-grey-600 my-3 md:my-5">
      <select
        id="dental-provider"
        name={name}
        className={`w-full py-3 px-3 placeholder-mobile-grey-400 bg-gray-100 focus:outline-none lg:text-xl rounded-md border-0 focus:ring-0 ${
          error ? "border border-red-400" : "border-transparent"
        }`}
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
