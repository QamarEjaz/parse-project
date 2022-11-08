import { useEffect } from "react"
import { TrashIcon, PencilIcon } from "@heroicons/react/outline"
import { BsToggleOff, BsToggleOn } from "react-icons/bs"
import { deletePolicy, getPolicyList, getSinglePolicy, policyStatus } from "../../Store/Automation/actions"
import { useDispatch, useSelector } from "react-redux"

const ManagePolicy = (props: any): JSX.Element => {
  const { closeModal, setPage, setSelectedPolicyId } = props
  const dispatch = useDispatch()

  let policy = useSelector((state: any) => state?.Automation?.policyList)

  useEffect(() => {
    dispatch(getPolicyList())
  }, [])

  return (
    <>
      <div className="flex-1 flex flex-col-reverse md:flex-row h-full">
        <div className="flex flex-col automationHeight flex-1 w-full px-4 pt-4 pb-5 overflow-auto xs:py-8 md:w-1/2 md:px-8 lg:px-8 lg:pt-5 2xl:pr-8 2xl:pl-8 mb-8 border-r border-gray-300">
          {policy.length > 0 ? (
            <>
              {policy?.map((obj: any, index: string) => {
                return (
                  <div key={index} className="p-4 mb-5 relative" style={{ boxShadow: "rgb(0 0 0 / 10%) 1px 1px 8px 5px" }}>
                    <p>{obj.name}</p>
                    <p className="dark:text-white text-gray-500 text-xs">
                      Executed Count: <b>{obj.executedCount}</b>
                    </p>
                    <div className="absolute right-5 top-7 text-mobile-gray-600 flex">
                      <button
                        type="button"
                        onClick={() => {
                          // dispatch(getSinglePolicy({ policyId: obj.objectId, setPage: setPage }))
                          setSelectedPolicyId(obj.objectId)
                          setPage(1)
                        }}
                      >
                        <PencilIcon className={`h-4 w-4`} />
                      </button>
                      <button type="button" onClick={() => dispatch(deletePolicy(obj.objectId))}>
                        <TrashIcon className={`h-4 w-4 ml-2`} />
                      </button>
                      <button type="button" onClick={() => dispatch(policyStatus({ policyId: obj.objectId, isActive: !obj.isActive }))}>
                        {obj.isActive ? <BsToggleOn className={`h-4 w-5 ml-2`} /> : <BsToggleOff className={`h-4 w-5 ml-2`} />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <p className="font-medium text-lg text-gray-700 dark:text-white text-center mt-10">No policy avaliable</p>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-gray-300 text-right">
        <button
          type="button"
          className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          onClick={() => closeModal(false)}
        >
          Close
        </button>
      </div>
    </>
  )
}
export default ManagePolicy
