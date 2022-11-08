import { useState, useEffect } from "react"
import { Tab } from "@headlessui/react"
import classNames from "classnames"
import { useDispatch } from "react-redux"
import { ChevronRightIcon } from "@heroicons/react/outline"
import PageContainer from "../../components/PageContainer"
import NewPatient from "./NewPatient"
import ReturningPatient from "./ReturningPatient"
import Verify from "../verify"
import PageTitle from "../../components/PageTitle"
import { config } from "../../utils/config"
import { getFormType } from "../../Store/Auth/actions"

export default function Phone() {
  const dispatch = useDispatch()
  let pageTitle = "How can we help?"
  const tabs = [
    {
      index: 1,
      title: "New Patient Exam",
      description: "I'm new to Total Health Dental Care",
    },
    {
      index: 2,
      title: "Existing Patient Appointment",
      description: "I've been to Total Health Dental Care before",
    },
  ]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [verifications, setVerifications] = useState(0)
  const [page, setPage] = useState(0)

  return (
    <>
      {verifications == 0 ? (
        <PageContainer
          leftContent={
            <>
              {!page > 0 ? (
                <PageTitle title={pageTitle} />
              ) : (
                <button className="mb-4" onClick={() => setPage(0)}>
                  <img
                    src="../assets/imgs/left-arrow (1).png"
                    alt="Back button"
                  />
                </button>
              )}
              <Tab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
                {!page > 0 ? (
                  <Tab.List className="flex flex-col">
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.index}
                        className={({ selected }) =>
                          classNames(
                            selected
                              ? `${config.app.borderColor} ${config.app.textColor}`
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-gray-300",
                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg outline-none "
                          )
                        }
                        onClick={() => {
                          setPage(tab.index)
                          dispatch(getFormType(tab.index))
                        }}
                      >
                        <div className="relative flex flex-col justify-center items-start pr-10 space-y-2">
                          <h1 className="text-2xl font-medium md:text-3xl">
                            {tab.title}
                          </h1>
                          <p className="text-sm text-gray-500">
                            {tab.description}
                          </p>
                          <ChevronRightIcon className="absolute right-2 w-5" />
                        </div>
                      </Tab>
                    ))}
                  </Tab.List>
                ) : null}
                {page == 1 ? (
                  <NewPatient setVerifications={setVerifications} />
                ) : page == 2 ? (
                  <ReturningPatient setVerifications={setVerifications} />
                ) : null}
              </Tab.Group>
            </>
          }
        />
      ) : (
        <Verify setVerifications={setVerifications} />
      )}
    </>
  )
}
