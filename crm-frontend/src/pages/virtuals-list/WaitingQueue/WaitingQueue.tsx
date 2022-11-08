import Parse from "parse"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Tab } from "@headlessui/react"
import { LinkIcon } from "@heroicons/react/outline"
import { toast } from "react-toastify"
import classNames from "classnames"

import { getRandomString } from "../../../utils/helpers"
import { getPateintQueue, setAppointmentTableSubscription } from "../../../Store/Virtual/actions"

import Button from "../../../components/Inputs/Button"
import Icon from "../../../components/DataDisplay/Icon"
// import Table from "../../../components/DataDisplay/Table"
import PeopleTable from "../../../components/DataDisplay/Table"
import VirtualWaitingService from "../../../components/DataDisplay/Table/Services/VirtualWaiting.service"
import VirtualUpcomingService from "../../../components/DataDisplay/Table/Services/VirtualUpcoming.service"
import VirtualActiveService from "../../../components/DataDisplay/Table/Services/VirtualActive.service"
import { PatientCell, DetailsCell, TeamCell, ChiefConcernCell, SocialHistoryCell, Level4Cell, ActionCell, KickCell } from "../../../components/DataDisplay/Table/Cells/WaitingQueueCells"
import Container from "../Modal/Container"

import { PatientQueueItem } from "./WaitingQueue.interface"
import useSubscription from "../Subscriptions/useSubscription"
import usePatientSubscription from "../Subscriptions/usePatientSubscription"
import useAppointmentSubscription from "../Subscriptions/useAppointmentSubscription"
import { useQueryClient } from "@tanstack/react-query"
// import useSubscription2 from "../Subscriptions/useSubscription2"

const WaitingQueue = (): JSX.Element => {
  const virtualWaitingQueryKey = "virtual-waiting"
  const virtualUpcomingQueryKey = "virtual-upcoming"
  const virtualActiveQueryKey = "virtual-active"
  const dispatch = useDispatch()

  let virtualCallList = useSelector((state: any) => state?.Virtual.virtuals)
  const virtualAppointmentSubscription = useSelector((state: any) => state?.Virtual.virtualAppointmentSubscription)
  const virtualPeopleSubscription = useSelector((state: any) => state?.Virtual.virtualPeopleSubscription)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [patientQueue, setPatientQueue] = useState<any>(virtualCallList)
  const [showVirtualPopup, setShowVirtualPopup] = useState(false)
  const [removeSuccess, setRemoveSuccess] = useState(false)
  const [waitingQueueCount, setWaitingQueueCount] = useState(0)
  const [upcomingQueueCount, setUpcomingQueueCount] = useState(0)
  const [activeQueueCount, setActiveQueueCount] = useState(0)
  const apptCount = useRef<number | null | undefined>(null)

  const queryClient = useQueryClient()

  /**
   * Columns
   */

  const waitingQueueCells = [
    { Header: "Patient", Cell: PatientCell, accessor: "patient.attributes" },
    { Header: "Details", Cell: DetailsCell, accessor: "appointment.attributes" },
    { Header: "Team", Cell: TeamCell, accessor: "appointment.attributes.provider" }, // need to identify accessor
    {
      Header: "Chief Concern",
      Cell: ChiefConcernCell,
      accessor: "appointment.attributes.chiefConcern",
    },
    {
      Header: "Social History",
      Cell: SocialHistoryCell,
      accessor: "patient.attributes.socialHistory",
    },
    { Header: "Level 4", Cell: Level4Cell, accessor: "patient.attributes.levelNeeds" },
    {
      Header: "",
      Cell: ActionCell,
      accessor: "action",
      onClick: (value: PatientQueueItem) => hanldePrepareVirtual(value),
    },
    {
      Header: "",
      Cell: KickCell,
      accessor: "RemoveAction",
      onClick: (value: PatientQueueItem) => handleRemoveVirtual(value),
    },
  ]

  const activeQueueCells = [
    { Header: "Patient", Cell: PatientCell, accessor: "patient.attributes" },
    { Header: "Details", Cell: DetailsCell, accessor: "appointment.attributes" },
    { Header: "Team", Cell: TeamCell, accessor: "appointment.attributes.provider" }, // need to identify accessor
    {
      Header: "Chief Concern",
      Cell: ChiefConcernCell,
      accessor: "appointment.attributes.chiefConcern",
    },
    {
      Header: "Social History",
      Cell: SocialHistoryCell,
      accessor: "patient.attributes.socialHistory",
    },
    { Header: "Level 4", Cell: Level4Cell, accessor: "patient.attributes.levelNeeds" },
    {
      Header: "",
      Cell: KickCell,
      accessor: "RemoveAction",
      onClick: (value: PatientQueueItem) => handleRemoveVirtual(value),
    },
  ]

  /**
   * Subscription queries/handlers for Virtual Table and its descendant tables(AppointmentV1, PatientV1)
   */
  useSubscription()

  const handleWaitingQueueData = (value: any): void => {
    setWaitingQueueCount(value?.data?.results?.length > 0 ? value?.data?.results?.length : 0)

    if (!value?.data || apptCount === value?.data?.results?.length) return

    useAppointmentSubscription(virtualAppointmentSubscription, queryClient, dispatch, [virtualWaitingQueryKey, virtualUpcomingQueryKey, virtualActiveQueryKey])
    usePatientSubscription(virtualPeopleSubscription, queryClient, dispatch, [virtualWaitingQueryKey, virtualUpcomingQueryKey, virtualActiveQueryKey])
  }

  const handleUpcomingQueueData = (value: any): void => {
    setUpcomingQueueCount(value?.data?.results?.length ? value?.data?.results?.length : 0)

    if (!value?.data || apptCount === value?.data?.results?.length) return

    useAppointmentSubscription(virtualAppointmentSubscription, queryClient, dispatch, [virtualWaitingQueryKey, virtualUpcomingQueryKey, virtualActiveQueryKey])
    usePatientSubscription(virtualPeopleSubscription, queryClient, dispatch, [virtualWaitingQueryKey, virtualUpcomingQueryKey, virtualActiveQueryKey])
  }

  const handleActiveQueueData = (value: any): void => {
    setActiveQueueCount(value?.data?.results?.length ? value?.data?.results?.length : 0)

    if (!value?.data || apptCount === value?.data?.results?.length) return

    useAppointmentSubscription(virtualAppointmentSubscription, queryClient, dispatch, [virtualWaitingQueryKey, virtualUpcomingQueryKey, virtualActiveQueryKey])
    usePatientSubscription(virtualPeopleSubscription, queryClient, dispatch, [virtualWaitingQueryKey, virtualUpcomingQueryKey, virtualActiveQueryKey])
  }

  if (virtualCallList?.length && virtualCallList[0]?.id) {
    virtualCallList = virtualCallList.map((item: PatientQueueItem) => ({ ...item.attributes, id: item.id }))
  }

  useEffect(() => {
    if (removeSuccess) {
      setPatientQueue(virtualCallList)
      setRemoveSuccess(false)
    }
  }, [removeSuccess, virtualCallList])

  const handleVirtualLink = (): void => {
    let url = `${process.env.REACT_APP_VIRTUAL_BASE_URL}/${getRandomString()}`
    window.navigator.clipboard.writeText(url)
    toast.success("Virtual link created and copied successfully.")
  }

  const handleRemoveVirtual = (value: any): void => {
    try {
      Parse.Cloud.run("crmVirtualCallKickPatient", { virtualCallId: value.id })
      setRemoveSuccess(true)
    } catch (error) {
      console.log(error)
      setRemoveSuccess(false)
    }
  }

  // fix any
  const hanldePrepareVirtual = (value: any): void => {
    setPatientQueue(value)
    setShowVirtualPopup(true)
  }

  useEffect(() => {
    dispatch(getPateintQueue())
  }, [patientQueue])

  return (
    <div className="flex flex-1 flex-col mr-6 h-full dark:text-white col-span-6">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex justify-between items-center mb-5">
          <div className="flex justify-center items-center relative">
            <TabItem>Waiting Queue ({waitingQueueCount})</TabItem>
            <TabItem>Upcoming ({upcomingQueueCount})</TabItem>
            <TabItem>Active ({activeQueueCount})</TabItem>
          </div>

          <div className="flex">
            <Button onClick={handleVirtualLink} variant="contained" className="text-base sm:text-base h-10 px-6" color="indigo" style={{ padding: "0 24px" }} rounded>
              <div className="flex items-center">
                <Icon icon={LinkIcon} />
                <span className="ml-2">Create virtual link</span>
              </div>
            </Button>
          </div>
        </Tab.List>

        <div className="mt-5 relative flex flex-1 h-full flex-col">
          <div className={`absolute top-0 left-0 right-0 bottom-0 flex flex-1 h-full flex-col ${selectedIndex === 0 ? "opacity-1 z-20" : "opacity-0 z-10"}`}>
            <PeopleTable tableId="virtual-waiting-table" columns={waitingQueueCells} getData={handleWaitingQueueData} fetchUsersData={VirtualWaitingService} queryKey={virtualWaitingQueryKey} />
          </div>
          <div className={`absolute top-0 left-0 right-0 bottom-0 flex flex-1 h-full flex-col ${selectedIndex === 1 ? "opacity-1 z-20" : "opacity-0 z-10"}`}>
            <PeopleTable tableId="virtual-upcoming-table" columns={waitingQueueCells} getData={handleUpcomingQueueData} fetchUsersData={VirtualUpcomingService} queryKey={virtualUpcomingQueryKey} />
          </div>
          <div className={`absolute top-0 left-0 right-0 bottom-0 flex flex-1 h-full flex-col ${selectedIndex === 2 ? "opacity-1 z-20" : "opacity-0 z-10"}`}>
            <PeopleTable tableId="virtual-active-table" columns={activeQueueCells} getData={handleActiveQueueData} fetchUsersData={VirtualActiveService} queryKey={virtualActiveQueryKey} />
          </div>
        </div>
      </Tab.Group>

      <Container open={showVirtualPopup} setOpen={(): void => setShowVirtualPopup((prev) => !prev)} patientQueue={patientQueue!} setPatientQueue={setPatientQueue} />
    </div>
  )
}

export default WaitingQueue

const TabItem = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <Tab className={({ selected }): string => classNames(selected ? "border-indigo-500 text-indigo-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300", "whitespace-nowrap py-4 px-5 border-b-2 font-medium text-sm outline-none")}>{children}</Tab>
}
