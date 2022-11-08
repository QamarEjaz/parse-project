import { useState, useEffect } from "react"
import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/outline"
import useMobileDetect from "use-mobile-detect-hook"
import { removeTotalHeathCareName } from "../utils/helpers"
import { useHistory } from "react-router-dom"
import { config } from "../utils/config"
import Map from "./Map"
import { useSelector } from "react-redux"
export default function LocationListing(props) {
  let { locations, onSelectLocation, selectedLocation, goNext } = props
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  )
  const detectMobile = useMobileDetect()
  const [mobileTab, setMobileTab] = useState(1)

  const tabs = [
    {
      index: 1,
      title: "List",
    },
    {
      index: 2,
      title: "Map",
    },
  ]
  return (
    <>
      <div className="w-full border-b-2 border-mobile-grey-300 mb-2 md:hidden text-sm">
        {tabs.map((obj, index) => {
          return (
            <button
              key={index}
              className={
                obj.index == mobileTab
                  ? `w-1/2 border-b-2 inline-block font-bold py-2 transform translate-y-0.5 ${config.app.borderColor} ${config.app.textColor}`
                  : "border-b-2 w-1/2 inline-block font-bold py-2 transform translate-y-0.5"
              }
              onClick={() => setMobileTab(obj.index)}
            >
              {obj.title}
            </button>
          )
        })}
      </div>
      {mobileTab == 1 ? (
        <div className="overflow-y-auto md:mb-5">
          {locations?.map((location) => {
            let locationSelect =
              selectedLocation?.objectId === location?.objectId
            return (
              <div
                className="relative flex flex-col justify-center py-5 border-b border-mobile-grey-200 md:border-b-2 md:border-mobile-grey-200 lg:py-8 text-mobile-grey-600 text-base sm:text-lg lg:text-4xl xl:text-5xl cursor-pointer"
                key={location?.objectId}
                onClick={() => {
                  onSelectLocation(location)
                }}
              >
                {selectedPatient?.preferredLocation?.objectId ===
                location?.objectId ? (
                  <div className="absolute right-8 text-mobile-gray-600">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-3 py-1 rounded dark:bg-green-200 dark:text-green-900 rounded-lg">
                      Home office
                    </span>
                  </div>
                ) : null}
                {locationSelect ? (
                  <div className="absolute right-5">
                    <CheckCircleIcon
                      className={`h-6 w-6 ${
                        locationSelect && config.app.textColor
                      }`}
                    />
                  </div>
                ) : (
                  <div className="absolute right-0 text-mobile-gray-600">
                    <ChevronRightIcon className={`h-6 w-6`} />
                  </div>
                )}
                <div
                  className={`font-bold md:font-medium text-black md:text-mobile-gray-600 flex justify-between items-center locationTextFont ${
                    locationSelect && config.app.textColor
                  }`}
                >
                  {removeTotalHeathCareName(location?.name)}
                </div>
                <p
                  className={`text-lg md:text-md text-mobile-grey-600 ${
                    locationSelect && config.app.textColor
                  }`}
                >
                  {location?.address1}
                </p>
              </div>
            )
          })}
        </div>
      ) : (
        <Map
          locations={locations}
          initialZoom={detectMobile.isMobile() ? 9 : 10}
          onClick={goNext}
          selectedLocation={selectedLocation}
        />
      )}
    </>
  )
}
