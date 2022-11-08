import React, { useEffect, useRef, useState } from "react";
import {
  SearchIcon,
  XIcon
} from "@heroicons/react/outline";

import {
  formatDate,
  formatPhoneNumber,
} from "../../utils/helpers";
import Parse from "parse";

import Spinner from "../../components/Spinner";
import Button from "../../components/Form/Button";
import { toast } from "react-toastify";

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

export default function PatientSearch({
  onChange,
  className,
  placeholder,
  selectedPatient,
  setSelectedPatient,
  applyParentWidth,
  error,
  helperText,
  label,
  onClickPatientBtn,
  query,
  setQuery,
  handleMapMarker,
  setPatientPreferredLocationMarker
}) {
  const phoneNumber = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePatientBtn, setShowCreatePatientBtn] = useState(false);

  const fetchAutocompletePredictions = async (value) => {
    const data = value.split(" ");

    setLoading(true);

    const firstNameQuery = new Parse.Query("PatientV1");
    const lastNameQuery = new Parse.Query("PatientV1");
    const emailAddressQuery = new Parse.Query("PatientV1");
    const phoneNumberQuery = new Parse.Query("Contact");

    let mainQuery;
    let lastName;
    let firstName;
    let result;
    const phone = parseInt(value);
    if (data.length <= 1) {
      firstNameQuery.contains("firstName", value || " ");
      lastNameQuery.contains("lastName", value || " ");
      emailAddressQuery.startsWith("emailAddress", value || " ");
      if (!Number.isInteger(phone)) {
        //FIRST NAME OR LAST NAME OR PHONE NUMBER OR EMAIL ADDRESS
        mainQuery = Parse.Query.or(
          firstNameQuery,
          lastNameQuery,
          emailAddressQuery
        );
      } else {
        mainQuery = phoneNumberQuery
          .equalTo("phone", value || "")
          .include("patient");
      }
    } else if (data.length > 1) {
      //First AND LAST NAME
      firstName = data[0];
      lastName = data[1];
      lastName = lastName.toLowerCase();
      firstNameQuery.fullText("firstName", firstName);
      mainQuery = Parse.Query.and(firstNameQuery);
    }

    if (data.length > 1) {
      result = await mainQuery.findAll().then((results) => {
        let arrayOfPatients = [];
        results.forEach((patient) => {
          let lastNameToCheck = patient.get("lastName");
          lastNameToCheck = lastNameToCheck.toLowerCase();
          if (lastNameToCheck.indexOf(lastName) !== -1) {
            arrayOfPatients.push(patient);
          }
        });
        return arrayOfPatients;
      });
    } else {
      result = await mainQuery.findAll();
    }

    if (Number.isInteger(phone)) {
      const clonedCopyOfResult = [];
      result.forEach((obj) => {
        clonedCopyOfResult.push(obj.get("patient"));
      });
      result = clonedCopyOfResult;
    }

    const patientsArray = result
      ?.map((patient) => {
        const patientJSON = patient?.toJSON();
        patientJSON.id = patientJSON.objectId;
        // console.log(patientJSON);
        // patientJSON.phone = patientJSON.phones[0]?.number;
        return patient.toJSON();
      })
      .filter((patient) => patient.firstName || patient.lastName);
    setFilteredOptions(patientsArray);
    if(patientsArray.length<1){
      toast.error("Patient does not exist with these details")
    }
    setLoading(false);
  };

  const [shouldSearch, setShouldSearch] = useState(true);

  const handleChange = (e) => {
    setShowCreatePatientBtn(false);
    setQuery(e.target.value);
    setShouldSearch(true);
  };

  const handleSelectedChange = (option) => {
    // setPatientPreferredLocationMarker(option);
    // handleMapMarker(option.preferredLocation.objectId);
    setShouldSearch(false);
    setSelectedPatient(option);
    onChange && onChange(option);
    setQuery(`${option.firstName} ${option.lastName}`);
    setFilteredOptions([]);
  };

  useEffect(() => {
    if (query && shouldSearch) {
      const delay = setTimeout(() => fetchAutocompletePredictions(query), 1500);
      return () => clearTimeout(delay);
    }
  }, [query, shouldSearch]);



  return (
    <>
      <input id="patient-search" ref={phoneNumber} className="hidden" />
      {label ? (
        <label
          className={`block text-sm font-medium transition-colors ${
            error ? "text-red-500" : "text-gray-700"
          } mb-1`}
        >
          {label}
        </label>
      ) : null}
      <div className={applyParentWidth ? "" : "relative"}>
        <div className={`relative flex items-center`}>
          <input
            value={query}
            onChange={handleChange}
            className={`w-full rounded-md ${
              selectedPatient ? "pl-10" : "pl-10"
            } py-2 pr-10  dark:text-black border ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-700"
            } bg-white dark:bg-black-900 dark:border-black-900 shadow-sm focus:outline-none focus:ring-2 dark:focus:ring-offset-black-700 focus:ring-offset-2 transition text-sm ${className} `}
            placeholder={
              placeholder
                ? placeholder
                : `Search for a patient by name, email or phone`
            }
          />
          {selectedPatient && (
            <>
              {selectedPatient?.profile_image ? (
                <div
                  className={`w-6 h-6 rounded-full flex absolute top-1/2 transform -translate-y-1/2 left-2.5 bg-cover`}
                  style={{
                    backgroundImage: `url(${selectedPatient?.profile_image})`,
                  }}
                ></div>
              ) : (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center absolute capitalize left-2.5 bg-gray-800 text-white`}
                >
                  {selectedPatient.firstName[0]}
                </div>
              )}
            </>
          )}
          {!selectedPatient ? (
            <div className="pointer-events-none absolute flex justify-center left-3 text-gray-400 text-lg">
              <SearchIcon className="w-5 h-5" />
            </div>
          ) : null}
          {loading ? (
            <div className="absolute top-1/2 transform -translate-y-1/2 right-3">
              <Spinner className="w-6 h-6" />
            </div>
          ) : null}
          {(query.length > 0 || filteredOptions.length > 0) && !loading ? (
            <button
              onClick={() => {
                setSelectedPatient(null);
                setQuery("");
                onChange && onChange(null);
                setFilteredOptions([]);
                setPatientPreferredLocationMarker(null);
              }}
              className="absolute inset-y-0 right-1 flex items-center rounded-r-md px-2 focus:outline-none"
            >
              <XIcon
                className={`h-5 w-5 text-gray-400 dark:text-white-200`}
                aria-hidden="true"
              />
            </button>
          ) : null}

          {helperText ? (
            <div className="text-xs text-red-500 absolute -bottom-5">
              {helperText}
            </div>
          ) : null}
        </div>
        <div className={`w-full mt-4 sm:w-full sm:max-w-full z-30 absolute`}>
          {filteredOptions.length > 0 ? (
            <div className="overflow-auto  border max-h-96 shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-black-700">
                <thead className="bg-gray-50 dark:bg-black-900">
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-2 pl-4 pr-2 text-left text-sm font-semibold text-gray-900 dark:text-black sm:pl-6"
                    >
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-black"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-black"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-black"
                    >
                      DOB
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-black-700 bg-white  dark:bg-black-900">
                  {filteredOptions
                    .filter((patient) => patient.patientStatus !== "INACTIVE")
                    .map((option) => (
                      <tr
                        key={option.id ?? option.objectId}
                        onClick={() => handleSelectedChange(option)}
                        className={`${
                          selectedPatient && selectedPatient.id === option.id
                            ? "bg-blue-200 dark:bg-black-800 "
                            : ""
                        }  cursor-pointer hover:bg-blue-50 dark:hover:bg-black-800 
                                `}
                      >
                        <td className="whitespace-nowrap py-2 pl-3 pr-3 text-sm text-black-500 dark:text-black-200 sm:pl-6 flex items-center">
                          <>
                            {option?.profile_image ? (
                              <div
                                className="w-6 h-6 rounded-full bg-cover"
                                style={{
                                  backgroundImage: `url(${option?.profile_image})`,
                                }}
                              ></div>
                            ) : (
                              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-800 text-white">
                                {option.firstName[0]}
                              </div>
                            )}
                          </>
                          <span className="ml-2">
                            {option.firstName} {option.lastName}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-black-500 dark:text-black-200">
                          {formatPhoneNumber(option.phone)}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-black-500 dark:text-black-200">
                          {option.emailAddress}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-black-500 dark:text-black-200">
                          {formatDate(option.dateOfBirth, "MM/DD/YYYY")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : 
          query?.length && showCreatePatientBtn ? (
            <div className="overflow-auto  border max-h-96 shadow rounded-lg bg-white py-6">
              <div className="min-w-full flex justify-center">
                <Button
                  type="submit"
                  variant="contained"
                  color="indigo"
                  onClick={onClickPatientBtn}
                >
                  Create a Patient
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
