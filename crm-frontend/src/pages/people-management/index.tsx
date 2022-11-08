import { useState } from "react"
import classNames from "classnames"
import { Tab } from "@headlessui/react"
import "react-toastify/dist/ReactToastify.css"

import Button from "../../components/Inputs/Button"
import Dialog from "../../components/Feedback/Dialog"
import PeopleTable from "../../components/DataDisplay/Table"
import PeopleTableService from "../../components/DataDisplay/Table/Services/PeopleTable.service"
import PeopleSetTableService from "../../components/DataDisplay/Table/Services/PeopleSetTable.service"
import { NameCell, PeopleCell, StatusCell, CreatedCell, Delete } from "../../components/DataDisplay/Table/Cells/PeopleCells"

const PeopleManagement = (): JSX.Element => {
  // Tab States
  const tabs = ["All People", "People Set"]
  const [activeTab, setActiveTab] = useState(0)

  // Dialog States
  const [openAddPeopleModal, setOpenAddPeopleModal] = useState(false)
  const [openAddPeopleSetModal, setOpenAddPeopleSetModal] = useState(false)

  const peopleColumns = [
    {
      Header: "Name",
      accessor: "name",
      Cell: NameCell,
    },
    {
      Header: "User Name",
      accessor: "username",
      Cell: PeopleCell,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: StatusCell,
    },
    {
      Header: "Created",
      accessor: "createdAt",
      Cell: CreatedCell,
    },
    {
      Header: "",
      accessor: "delete",
      Cell: Delete,
    },
  ]

  const peopleSetColumns = [
    {
      Header: "Name",
      accessor: "name",
      Cell: NameCell,
    },
    {
      Header: "People Set",
      accessor: "locations",
      Cell: PeopleCell,
    },
    {
      Header: "Features",
      accessor: "features",
      Cell: StatusCell,
    },
    {
      Header: "Created",
      accessor: "createdAt",
      Cell: CreatedCell,
    },
    {
      Header: "",
      accessor: "delete",
      Cell: Delete,
    },
  ]

  return (
    <>
      <section className="min-w-0 flex-1 h-full flex flex-col dark:bg-black-700 overflow-hidden lg:order-last relative">
        <div className="flex items-center justify-between">
          <h2 className="hidden text-3xl font-bold  dark:text-white sm:block">People</h2>
        </div>

        <div className="mt-5 flex flex-1 h-full flex-col">
          <div className="flex justify-between items-center">
            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
              <Tab.List className="flex space-x-8">
                {tabs.map((tab) => (
                  <Tab key={tab} className={({ selected }): string => classNames(selected ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm outline-none")}>
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>
            <Button
              variant="contained"
              color="indigo-light"
              onClick={(): void => {
                activeTab === 0 ? setOpenAddPeopleModal((prev: any) => !prev) : setOpenAddPeopleSetModal((prev: any) => !prev)
              }}
            >
              {activeTab === 0 ? "Add People" : "Add People Set"}
            </Button>
          </div>

          <div className="mt-5 relative flex flex-1 h-full flex-col">
            <div className={`absolute top-0 left-0 right-0 bottom-0 flex flex-1 h-full flex-col ${activeTab === 0 ? "opacity-1 z-20" : "opacity-0 z-10"}`}>
              <PeopleTable tableId="people-table" columns={peopleColumns} fetchUsersData={PeopleTableService} queryKey="users" />
            </div>
            <div className={`absolute top-0 left-0 right-0 bottom-0 flex flex-1 h-full flex-col ${activeTab === 1 ? "opacity-1 z-20" : "opacity-0 z-10"}`}>
              <PeopleTable tableId="people-set-table" columns={peopleSetColumns} fetchUsersData={PeopleSetTableService} queryKey="patients" />
            </div>
          </div>
        </div>
      </section>
      <Dialog
        variant={Dialog.variant.PEOPLE}
        open={openAddPeopleModal}
        setOpen={setOpenAddPeopleModal}
        title="Add People"
        primaryButtonText="Send by Email"
        secondaryButtonText="Cancel"
        onClickPrimaryButton={(): void => {
          setOpenAddPeopleModal((prev) => !prev)
        }}
        onClickSecondaryButton={(): void => {
          setOpenAddPeopleModal((prev) => !prev)
        }}
      />

      <Dialog
        variant={Dialog.variant.PEOPLESET}
        open={openAddPeopleSetModal}
        setOpen={setOpenAddPeopleSetModal}
        title="Add a People Set"
        primaryButtonText="Create People Set"
        secondaryButtonText="Cancel"
        // onClickPrimaryButton={() => {
        //   setOpenAddPeopleSetModal((prev) => !prev);
        // }}
        // onClickSecondaryButton={() => {
        //   setOpenAddPeopleSetModal((prev) => !prev);
        // }}
      />
    </>
  )
}
export default PeopleManagement
