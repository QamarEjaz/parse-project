import { useEffect, useRef, useState } from "react"
import Parse from "parse"
import { useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { ChevronLeftIcon } from "@heroicons/react/outline"

import { getSinglePatientQueue } from "../../Store/Virtual/actions"

import ActivePatientCard from "./ActivePatientCard"
import VirtualPlayer from "./VirtualPlayer"

export default function Virtuals(): JSX.Element {
  const dispatch = useDispatch()
  const params = useParams()

  const toggleButtonRef = useRef<HTMLDivElement>(null)
  const sidePanelRef = useRef<HTMLDivElement>(null)
  const toggleIconRef = useRef<HTMLDivElement>(null)
  const openContentRef = useRef<HTMLDivElement>(null)

  // need improvements
  const patientQueueData = useSelector((state: any) => state?.Virtual.virtual)
  console.log('PQD >>> ', patientQueueData)
  const [patientQueue, setPatientQueue] = useState<any>(patientQueueData?.virtualCall) // bug
  console.log('PQ >>> ', patientQueueData?.virtualCall?.toJSON?.())

  const openSidePanel = (): void => {
    toggleIconRef.current?.classList.add("rotate-180")
    sidePanelRef.current?.classList.replace("w-4", "w-96")
    openContentRef.current?.classList.replace("hidden", "block")
    toggleButtonRef.current?.classList.replace("right-4", "right-96")
  }

  const closeSidePanel = (): void => {
    toggleIconRef.current?.classList.remove("rotate-180")
    sidePanelRef.current?.classList.replace("w-96", "w-4")
    openContentRef.current?.classList.replace("block", "hidden")
    toggleButtonRef.current?.classList.replace("right-96", "right-4")
  }

  const toggleSidePanel = (): void => {
    if (sidePanelRef.current?.classList.contains("w-96") /* if open */) {
      closeSidePanel()
    } else {
      openSidePanel()
    }
  }

  useEffect(() => {
    dispatch(getSinglePatientQueue(params.id))
  }, [patientQueue])

  return (
    <div className="custom-h-screen flex relative -m-5">
      <section className="h-full flex-1 dark:text-white">
        <VirtualPlayer patientQueue={patientQueue} agoraToken={patientQueueData?.agoraToken} />
      </section>

      <div className="absolute top-4 right-96 z-10 transition-all duration-300" ref={toggleButtonRef}>
        <button className="w-8 h-8 rounded-full p-2 relative -right-4 dark:bg-black-900 dark:text-white border border-transparent dark:border-black-400 bg-white hover:bg-gray-50 text-primary transition duration-200" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.2)" }} onClick={toggleSidePanel}>
          <span className={"rotate-180 transition-transform duration-200 transform block"} ref={toggleIconRef}>
            <ChevronLeftIcon />
          </span>
        </button>
      </div>

      <div id="schedule-aside" className={"h-full overflow-auto relative d-flex bg-white dark:bg-black-800 dark:border-black-900 border-l transition-all duration-300 w-96"} ref={sidePanelRef}>
        <div className="block px-4 py-6" ref={openContentRef}>
          {patientQueueData?.virtualCall && <ActivePatientCard patientQueue={patientQueueData?.virtualCall?.toJSON?.() ? patientQueueData?.virtualCall?.toJSON?.() : {}} />}
        </div>
      </div>
    </div>
  )
}
