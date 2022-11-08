import Parse from "parse"
import { useState, useEffect } from "react"
import { PlusIcon, TrashIcon } from "@heroicons/react/outline"
import Select from "react-select"
import Icon from "../DataDisplay/Icon"
import { createAutomation, getSinglePolicySuccess, getSourceKeys, getSources } from "../../Store/Automation/actions"
import { useDispatch, useSelector } from "react-redux"
import { dataTypeFilters, dataTypeFiltersProps } from "../../constants/constants"
import TextField from "../Inputs/TextField"
import { toast } from "react-toastify"
import Textarea from "../Inputs/Textarea"
import Button from "../Inputs/Button"

const CreatePolicy = (props: any): JSX.Element => {
  const { closeModal, setPage, selectedPolicyId, setSelectedPolicyId } = props

  const dispatch = useDispatch()

  let sources = useSelector((state: any) => state?.Automation?.sources)
  let sourceKey = useSelector((state: any) => state?.Automation?.sourceKeys)

  const [singlePolicy, setSinglePolicy] = useState<any>()
  const [sourceValue, setSourceValue] = useState<any>(singlePolicy?.source ? singlePolicy?.source : "")
  const [actionValue, setActionValue] = useState<any>(singlePolicy?.actions?.actionName ?? "")
  const [criteriaValues, setCriteriaValues] = useState<any>(singlePolicy?.criterias ?? [{ key: "", operator: "", value: "", priority: "" }])
  const [actionParams, setActionParams] = useState<any>(singlePolicy?.actions?.params ?? [])
  const [inputs, setInputs] = useState<any>(singlePolicy?.actions?.params ?? [])
  const [actions, setActions] = useState<any>([])

  const getSinglePolicy = async () => {
    try {
      let data = await Parse.Cloud.run("getAutomationPolicyData", {
        policyId: selectedPolicyId,
      })
      setSinglePolicy(data)
    } catch (error: any) {
      toast.error(JSON.stringify(error.message))
    }
  }

  useEffect(() => {
    setSourceValue(singlePolicy?.source ?? "")
    setCriteriaValues(singlePolicy?.criterias ?? [{ key: "", operator: "", value: "", priority: "" }])
    setActionValue(singlePolicy?.actions?.actionName ?? "")
    setActionParams(singlePolicy?.actions?.params ?? [])
    setInputs(singlePolicy?.actions?.params ?? [])
  }, [singlePolicy])

  useEffect(() => {
    if (selectedPolicyId) {
      getSinglePolicy()
    }
  }, [])

  useEffect(() => {
    dispatch(getSources())
  }, [])

  useEffect(() => {
    getActions()
    if (sourceValue) dispatch(getSourceKeys(sourceValue?.label))
  }, [sourceValue])

  let handleChange = (i: any, e: any) => {
    let newcriteriaValues = [...criteriaValues]
    if (newcriteriaValues[i][e]) {
      newcriteriaValues[i][e.target.name] = e.target.value
    } else {
      if (e.name === "operator") {
        newcriteriaValues[i].operator = e
        newcriteriaValues[i].value = ""
      } else if (e.name === "key") {
        newcriteriaValues[i].key = e
        newcriteriaValues[i].value = ""
      } else {
        newcriteriaValues[i][e.target.name] = e.target.value
      }
    }
    newcriteriaValues[i].priority = i
    setCriteriaValues(newcriteriaValues)
  }

  let addFormFields = () => {
    setCriteriaValues([...criteriaValues, { key: "", operator: "", value: "", priority: "" }])
  }

  let removeFormFields = (i: any) => {
    let newcriteriaValues = [...criteriaValues]
    newcriteriaValues.splice(i, 1)
    setCriteriaValues(newcriteriaValues)
  }

  // Action Code

  const getActions = async () => {
    const query = new Parse.Query("AutomationActions")
    const getActions = await query.findAll()
    setActions(getActions?.map((obj: any) => obj.toJSON()))
  }

  const getActionRelation = async () => {
    const query = new Parse.Query("AutomationActions")
    const actionParams = await query.get(actionValue?.value)
    let result = await actionParams.relation("params").query().ascending("priority").find()
    setActionParams(
      result?.map((obj: any) => {
        return {
          objectId: obj.id,
          name: obj?.attributes?.name,
          priority: obj?.attributes?.priority,
          fieldType: obj?.attributes?.fieldType,
          value: "",
        }
      })
    )
  }

  let setActionValuefunc = (e: any, i: any) => {
    const actionValue = [...actionParams]
    actionValue[i].value = e.target.value
    setInputs(actionValue)
  }

  useEffect(() => {
    if (actionValue?.value) {
      getActionRelation()
    }
  }, [actionValue])

  let handleSubmit = async (event: any) => {
    event.preventDefault()
    let sourceValidation = criteriaValues?.map((obj: any) => {
      if (obj.key === "" || obj.operator === "") {
        return false
      } else if (obj.operator.getInput === true && obj.value === "") {
        return false
      } else {
        return true
      }
    })
    let actionValidation = inputs?.map((obj: any) => obj.value != "")

    if (sourceValidation.filter((val: any) => !val).length > 0) {
      toast.error("Please fill all the box fields which is created for the source condition")
    } else {
      if (actionValue) {
        if (inputs.length > 0) {
          if (actionValidation.filter((val: any) => !val).length > 0) {
            toast.error("Please add action value")
          } else {
            dispatch(
              createAutomation({
                sourceValue: sourceValue,
                actionValue: actionValue,
                inputs: inputs,
                criteriaValues: criteriaValues,
                setPage: setPage,
                selectedPolicyId: selectedPolicyId,
                setSelectedPolicyId: setSelectedPolicyId,
                setSourceValue: setSourceValue,
                setCriteriaValues: setCriteriaValues,
                setActionValue: setActionValue,
                setActionParams: setActionParams,
                setInputs: setInputs,
              })
            )
          }
        } else {
          toast.error("Please add action value")
        }
      } else {
        toast.error("Please select a action")
      }
    }
  }

  const clearStates = () => {
    dispatch(getSinglePolicySuccess(null))
    setCriteriaValues([{ key: "", operator: "", value: "", priority: "" }])
    setActionValue("")
    setSourceValue("")
    setActionParams([])
    setSelectedPolicyId("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-1 flex flex-col-reverse md:flex-row h-full relative">
        {selectedPolicyId ? (
          <div className="absolute right-5 text-mobile-gray-600 flex" style={{ top: "-32px" }}>
            <button className="dark:text-white text-red-500 text-base" type="button" onClick={() => clearStates()}>
              Clear all
            </button>
          </div>
        ) : null}
        <div className="flex flex-col automationHeight flex-1 w-full px-4 pt-4 pb-5 overflow-auto xs:py-8 md:w-1/2 md:px-8 lg:px-8 lg:pt-5 2xl:pr-8 2xl:pl-8 mb-8 border-r border-gray-300">
          <div className="p-4 mb-5" style={{ boxShadow: "rgb(0 0 0 / 10%) 1px 1px 8px 5px" }}>
            <div className="">
              <Select
                placeholder="Source"
                name="Source"
                defaultValue={{ value: sources[0]?.objectId, label: sources[0]?.name }}
                options={sources?.map((source: any) => {
                  return {
                    value: source?.objectId,
                    label: source?.name,
                  }
                })}
                value={sourceValue}
                onChange={(e) => {
                  setSourceValue(e)
                  setCriteriaValues([{ key: "", operator: "", value: "", priority: "" }])
                }}
              />
            </div>
          </div>
          {criteriaValues?.map((element: any, index: string) => {
            let selectedKey = criteriaValues?.map((obj: any) => obj.key.value)
            let type = element.key.type
            return (
              <div key={index} className="p-4 mb-5" style={{ boxShadow: "rgb(0 0 0 / 10%) 1px 1px 8px 5px" }}>
                <div className="mb-2">
                  <Select
                    placeholder="key"
                    value={element.key || ""}
                    options={sourceKey
                      ?.filter((key: any) => !selectedKey.includes(key.label))
                      .map((source: any) => {
                        return {
                          value: source?.label,
                          label: source?.label,
                          type: source?.value?.type,
                          name: "key",
                        }
                      })}
                    onChange={(e: any) => {
                      handleChange(index, e)
                    }}
                  />
                </div>
                <div className="mb-2 ">
                  {type ? (
                    <Select
                      name="operator"
                      placeholder="operator"
                      value={element.operator || ""}
                      options={dataTypeFilters[type as keyof dataTypeFiltersProps].map((obj: any) => {
                        return {
                          value: obj?.value,
                          label: obj?.value,
                          getInput: obj?.getInput,
                          name: "operator",
                        }
                      })}
                      onChange={(e: any) => {
                        handleChange(index, e)
                      }}
                    />
                  ) : null}
                </div>
                {element.operator.getInput && element.key.type === "Date" ? (
                  <div className="mb-2">
                    <TextField
                      placeholder="YYYY-MM-DD"
                      type="date"
                      name="value"
                      value={element.value || ""}
                      // value={formatDate(value, "YYYY-MM-DD")}
                      onChange={(e) => {
                        handleChange(index, e)
                      }}
                    />
                  </div>
                ) : element.operator.getInput && element.key.type === "Boolean" ? (
                  <>
                    <div className="flex mb-3 mt-3">
                      <div className="flex items-center mr-3">
                        <input name="value" type="radio" value="True" onChange={(e) => handleChange(index, e)} checked={element.value === "True"} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">True</label>
                      </div>
                      <div className="flex items-center">
                        <input name="value" value="False" onChange={(e) => handleChange(index, e)} checked={element.value === "False"} type="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">False</label>
                      </div>
                    </div>
                  </>
                ) : element.operator.getInput ? (
                  <div className="mb-2">
                    <TextField
                      type="text"
                      name="value"
                      value={element.value || ""}
                      onChange={(e) => {
                        handleChange(index, e)
                      }}
                    />
                  </div>
                ) : null}
                {selectedKey?.length != sourceKey?.length ? (
                  <button onClick={() => removeFormFields(index)} className="w-full rounded-md border border-transparent bg-red-100 px-4 py-1 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                    <Icon icon={TrashIcon} fontSize="text-lg" />
                  </button>
                ) : null}
              </div>
            )
          })}
          {sourceValue?.label ? (
            <button type="button" onClick={() => addFormFields()} className="w-32 font-medium text-sm text-gray-700 dark:text-white capitalize">
              <Icon icon={PlusIcon} fontSize="text-sm" classNames="mt-1" /> Add condition
            </button>
          ) : null}
        </div>
        <div className="flex flex-col automationHeight flex-1 w-full px-4 pt-4 pb-5 overflow-auto md:w-1/2 md:px-8 lg:px-8 lg:pt-5 2xl:pr-8 2xl:pl-8 mb-8 border-r border-gray-300">
          <div className="p-4 mb-5" style={{ boxShadow: "rgb(0 0 0 / 10%) 1px 1px 8px 5px" }}>
            <div className="">
              <Select
                placeholder="Select action"
                options={actions?.map((obj: any, index: any) => {
                  return {
                    value: obj?.objectId,
                    label: obj?.name,
                    params: obj,
                    index: index,
                  }
                })}
                value={actionValue}
                onChange={(e) => {
                  setActionValue(e)
                  setInputs([])
                }}
              />
            </div>
          </div>
          <div className="mb-3">
            <ul>
              <li>
                <p className="font-medium text-sm text-gray-700 dark:text-white">
                  - For patients name
                  <b className="ml-2">{`{patient.name}`}</b>
                </p>
              </li>
            </ul>
            {sourceValue?.label === "AppointmentV1" ? (
              <p className="font-medium text-sm text-gray-700 dark:text-white">
                - For appointment provider
                <b className="ml-2">{`{appointment.provider}`}</b>
              </p>
            ) : null}
            <p className="font-medium text-sm text-gray-700 dark:text-white">
              - For patients home office
              <b className="ml-2">{`{patient.office}`}</b>
            </p>
          </div>
          {actionParams?.length > 0 ? (
            <div className="p-4 mb-5" style={{ boxShadow: "rgb(0 0 0 / 10%) 1px 1px 8px 5px" }}>
              {actionParams?.map((obj: any, index: any) => {
                return (
                  <div className="mb-3" key={obj?.objectId}>
                    <p className="mb-1 capitalize">{obj?.name}</p>
                    {obj.fieldType === "textfield" ? <TextField value={obj.value || ""} placeholder={`${obj.name}`} onChange={(e) => setActionValuefunc(e, index)} /> : <Textarea rows={4} value={obj.value || ""} placeholder={`${obj.name}`} onChange={(e) => setActionValuefunc(e, index)} />}
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="p-4 border-t border-gray-300 text-right">
        <button
          type="button"
          className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          onClick={() => {
            closeModal(false)
            clearStates()
          }}
        >
          Close
        </button>
        <Button
          type="submit"
          disabled={sourceValue ? false : true}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {selectedPolicyId ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
export default CreatePolicy
