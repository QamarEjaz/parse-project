import { useState } from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import PageContainer from "../../components/PageContainer";
import Verify from "../verify";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { config } from "../../utils/config";

export default function Phone() {
  let pageTitle = "How can we help?";
  const tabs = [
    {
      title: "New Patient Appointment",
      description: "I'm new to Total Health Dental Care",
    },
    {
      title: "Existing Patient Appointment",
      description: "I've been to Total Health Dental Care before",
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [verifications, setVerifications] = useState(0);

  return (
    <>
      {verifications == 0 ? (
        <PageContainer
          leftContent={
            <>
              <div className="page-title">
                <h1 className={`text-left ${config.app.textColor} `}>
                  {pageTitle}
                </h1>
              </div>
              <Tab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
                <Tab.List className="flex flex-col">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab}
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? `${config.app.borderColor} ${config.app.textColor}`
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg outline-none"
                        )
                      }
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
              </Tab.Group>
            </>
          }
        />
      ) : (
        <Verify />
      )}
    </>
  );
}
