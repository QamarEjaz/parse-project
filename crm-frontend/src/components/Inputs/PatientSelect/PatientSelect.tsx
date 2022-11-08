import { useEffect, useState } from "react"
import EllipsisProgress from "../../Feedback/Progress/Ellipsis"
import { IPatientSelectProps, IPatient } from "./PatientSelect.interfaces"
import { formatDate, validateEmail } from "../../../pages/schedule/utils"
import * as Parse from "parse"

import { SearchIcon, XIcon } from "@heroicons/react/outline"
import Icon from "../../DataDisplay/Icon"

import { useDispatch, useSelector } from "react-redux"

export default function PatientSelect({ onChange, placeholder, borderLess, className, iconClassName, tableContainerClassName, avatarClassName, rowClickAble = true }: IPatientSelectProps): JSX.Element {
  const [filteredOptions, setFilteredOptions] = useState<IPatient[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const [query, setQuery] = useState("")
  const [selectedPerson, setSelectedPerson] = useState<IPatient>()
  const [shouldSearch, setShouldSearch] = useState(true)

  const fetchAutocompletePredictions = async (value?: any) => {
    let inputType = value
    const data = value.split(" ")
    console.log("data: ", data.length)
    let onlyNumbersAndSpecial = /^(?=.*?[1-9])[0-9()-]+$/gm

    setLoading(true)

    const firstNameQuery = new Parse.Query("PatientV1")
    const lastNameQuery = new Parse.Query("PatientV1")
    const emailAddressQuery = new Parse.Query("PatientV1")
    if (data.length <= 1) {
      firstNameQuery.fullText("firstName", value! || " ")

      lastNameQuery.fullText("lastName", value! || " ")

      emailAddressQuery.startsWith("emailAddress", value! || " ")
    } else if (data.length > 1) {
      //fullname
      let fn = data[0]
      let ln = data[1]
      console.log(fn, ln)
      firstNameQuery.fullText("firstName", fn! || " ")
      lastNameQuery.fullText("lastName", ln! || " ")
      emailAddressQuery.startsWith("emailAddress", value!)
    }

    const mainQuery = Parse.Query.and(Parse.Query.or(firstNameQuery, lastNameQuery, emailAddressQuery))
    mainQuery
      .findAll()
      .then(function (results) {})
      .catch(function (error) {})

    const result = await mainQuery.findAll()
    const patientsArray = result
      ?.map((patient: any): IPatient => {
        return {
          id: patient?.id,
          firstName: patient?.attributes?.firstName,
          lastName: patient?.attributes?.lastName,
          dateOfBirth: patient?.attributes?.dateOfBirth,
          address1: patient?.attributes?.address1,
          profile_image: null,
          social_history: patient?.attributes?.socialHistory,
          level_needs: patient?.attributes?.levelNeeds,
          types: patient?.attributes?.types,
          patientTypes: patient?.attributes?.patientTypes,
          patientStatus: patient?.attributes?.patientStatus,
          emailAddress: patient?.attributes?.emailAddress,
          phone: patient?.attributes?.phones?.[0].number,
        }
      })
      .filter((patient: IPatient) => patient.firstName || patient.lastName)
    setFilteredOptions(patientsArray)
    setLoading(false)
  }

  const onClickAutocompletePrediction = (option: IPatient) => {
    setShouldSearch(false)
    setSelectedPerson(option)
    onChange && onChange(option)
    setQuery(`${option.firstName} ${option.lastName}`)
    setFilteredOptions([])
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event?.target?.value)
    setShouldSearch(true)
    if (!event?.target?.value) {
      setSelectedPerson(undefined)
    }
  }

  useEffect(() => {
    if (query && shouldSearch) {
      const delay = setTimeout(() => fetchAutocompletePredictions(query), 500)
      return () => clearTimeout(delay)
    }
  }, [query, shouldSearch])

  return (
    <>
      <div className="relative">
        <div className={`relative flex items-center`}>
          <input
            value={query}
            onChange={handleChange}
            className={`w-full rounded-md ${selectedPerson ? "pl-10" : "pl-10"} py-2 pr-10  dark:text-white ${
              !borderLess ? "border border-gray-300 bg-white dark:bg-black-900 dark:border-black-900 shadow-sm focus:outline-none focus:ring-2 dark:focus:ring-offset-black-700 focus:ring-offset-2 focus:ring-gray-500" : "focus:outline-none"
            }  ${className} sm:text-sm`}
            placeholder={placeholder ? placeholder : `Search patient by name, email or phone number`}
          />
          {selectedPerson && (
            <>
              {selectedPerson?.profile_image ? (
                <div
                  className={`w-6 h-6 rounded-full flex absolute top-1/2 transform -translate-y-1/2 left-2.5 bg-cover ${avatarClassName}`}
                  style={{
                    backgroundImage: `url(${selectedPerson?.profile_image})`,
                  }}
                ></div>
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center absolute capitalize left-2.5 bg-primary dark:bg-black-700 text-white ${avatarClassName}`}>{selectedPerson.firstName[0] && selectedPerson.lastName[0]}</div>
              )}
            </>
          )}
          {!selectedPerson ? (
            <div className="pointer-events-none absolute flex justify-center left-3 text-gray-500 text-lg">
              <Icon icon={SearchIcon}></Icon>
            </div>
          ) : null}
          {loading && (
            <div className="absolute top-1/2 transform -translate-y-1/2 right-6">
              <div className="h-full w-full flex items-center justify-center">
                <div className="spinner-wrapper">
                  <EllipsisProgress color="gray-600" />
                </div>
              </div>
            </div>
          )}
          {query.length > 0 || filteredOptions.length > 0 ? (
            <button
              onClick={() => {
                setQuery("")
                onChange && onChange(null)
                setSelectedPerson(undefined)
                setFilteredOptions([])
              }}
              className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
            >
              <XIcon className={`h-5 w-5 ${iconClassName} text-gray-400 dark:text-gray-200`} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <div className={tableContainerClassName ? tableContainerClassName : `w-full mt-2 sm:w-full sm:max-w-full z-30 absolute`}>
          {filteredOptions.length > 0 ? (
            <div className="overflow-auto  border max-h-96 shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-black-700">
                <thead className="bg-gray-50 dark:bg-black-900">
                  <tr>
                    <th scope="col" className="whitespace-nowrap py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      Patient
                    </th>
                    <th scope="col" className="whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Email
                    </th>
                    <th scope="col" className="whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      DOB
                    </th>
                    <th scope="col" className="whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-black-700 bg-white  dark:bg-black-900">
                  {filteredOptions
                    .filter((patient) => patient.patientStatus !== "INACTIVE")
                    .map((option) => (
                      <tr
                        key={option.id}
                        onClick={() => (rowClickAble ? onClickAutocompletePrediction(option) : null)}
                        className={`${selectedPerson && selectedPerson.id === option.id ? "bg-blue-200 dark:bg-black-800 " : ""}  ${rowClickAble ? " cursor-pointer hover:bg-blue-50 dark:hover:bg-black-800 " : ""}  `}
                      >
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-200 sm:pl-6 flex items-center">
                          <>
                            {option?.profile_image ? (
                              <div
                                className="w-6 h-6 rounded-full bg-cover"
                                style={{
                                  backgroundImage: `url(${option?.profile_image})`,
                                }}
                              ></div>
                            ) : (
                              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-800 dark:bg-black-700 text-white">{option.firstName[0]}</div>
                            )}
                          </>
                          <span className="ml-2">
                            {option.firstName} {option.lastName}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 dark:text-gray-200">{option.emailAddress}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 dark:text-gray-200">{formatDate(option.dateOfBirth, "MM/DD/YYYY")}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 dark:text-gray-200">{option.phone}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
