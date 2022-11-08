import { useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Tab } from "@headlessui/react"
import { IAutomateModalProps } from "./AutomateModal.interfaces"
import CreatePolicy from "./CreatePolicy"
import ManagePolicy from "./ManagePolicy"

const AutomateModal = ({ isOpen, closeModal, automateModalSection }: IAutomateModalProps): JSX.Element => {
  const tabs = [
    {
      index: 1,
      title: "Browse",
    },
    {
      index: 2,
      title: "Manage",
    },
  ]

  useEffect(() => {
    setPage(automateModalSection)
    setSelectedIndex(automateModalSection)
  }, [automateModalSection])

  const [selectedIndex, setSelectedIndex] = useState(automateModalSection)
  const [page, setPage] = useState<any>(automateModalSection)
  const [selectedPolicyId, setSelectedPolicyId] = useState<any>("")

  return (
    <Transition appear show={isOpen} as={"div"}>
      <Dialog as="div" className="fixed inset-0 overflow-y-auto z-50" onClose={() => closeModal(false)}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:px-4 sm:p-0">
          <Transition.Child
            as={"div"}
            className="w-full"
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-black-700 rounded-lg text-left overflow-visible transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-4xl sm:w-full" style={{ boxShadow: "rgb(0 0 0 / 10%) 1px 1px 8px 5px" }}>
              <section className="flex flex-col max-w-screen-2xl overflow-hidden sm:pt-40 mx-auto md:pt-0">
                <div className="w-full px-4 py-4 xs:py-20 md:px-10 lg:px-8 2xl:pr-20 2xl:pl-8 border-b border-gray-300">
                  <h1 className="font-medium text-2xl text-gray-700 dark:text-white capitalize">Automations</h1>
                </div>
                <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                  <Tab.List className="flex space-x-8 border-gray-300 border-b relative" style={{ justifyContent: "center" }}>
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.index}
                        className={`${tab.index === page ? "text-indigo-500 border-indigo-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-md`}
                        onClick={() => {
                          setPage(tab.index)
                        }}
                      >
                        {tab.title}
                      </Tab>
                    ))}
                  </Tab.List>
                  {page == 1 ? <CreatePolicy closeModal={closeModal} setSelectedPolicyId={setSelectedPolicyId} selectedPolicyId={selectedPolicyId} setPage={setPage} /> : page == 2 ? <ManagePolicy setPage={setPage} closeModal={closeModal} setSelectedPolicyId={setSelectedPolicyId} /> : null}
                </Tab.Group>
              </section>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
export default AutomateModal
