import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MultiValue } from "react-select"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import Button from "../../../../components/Inputs/Button"
import TabItem from "../../../../components/Navigation/TabItem"
import Appointment from "./Appointment"
import PatientInfo from "./PatientInfo"
import TreatmentPlan from "./TreatmentPlan"
import Patient from "./Patient"
import { IAppointment, ICellData } from "../../schedule-template/Template.interfaces"
import { Operatory } from "../../../../Types/OperatoryTypes"
import Parse from "parse"
import { addAppointment, deleteAppointment, updateAppointment, updatePatientInAppts } from "../../../../Store/Appointment/actions"
import { updatePatientInfo } from "../../../../Store/Patient/actions"
import Dialog from "../../../../components/Feedback/Dialog"
import { IOption } from "../../../../components/Inputs/Select/Select.interfaces"
import { IOption as IMultiOption } from "../../../../components/Inputs/MultiSelect/MultiSelect.interfaces"
import { formatDate, getTimeOptions } from "../../utils"
import { APPT_STATUS_OPTIONS } from "../../../../utils/SelectOptions"
import useMultiSelectOptions from "../../../../hooks/useMultiSelectOptions"
import useSelectOptions from "../../../../hooks/useSelectOptions"

const tabItems = [
  { id: 1, name: "Appointment" },
  { id: 2, name: "Patient Info" },
  { id: 3, name: "Treatment Plan" },
]

export interface IDefaultForm {
  status: IOption
  other: string
  operatory: IOption
  provider: IOption
  date: Date
  start: IOption
  end: IOption
  chiefConcern: string
  teamMembers: IMultiOption[]
  notes: string
  patientTypes: MultiValue<IMultiOption>
  setPatientTypes: (options: MultiValue<any>) => void
  levelNeeds: string
  socialHistory: string
  isVip: boolean
  firstName: string
  lastName: string
  preferredName: string
  emailAddress: string
  phones: []
  gender: string
  dateOfBirth: Date
  patientStatus: string
  firstVisitDate: string
  lastVisitDate: string
  ssn: string
  address1: string
  city: string
  state: string
  postalCode: string
}

interface IGeneralModalProps {
  location: any
  handleClose?: () => void
  patient?: any
  appointment: IAppointment | null
  selectedCell: ICellData | null
  operatories: Operatory[]
}

const timeOptions = [...getTimeOptions()]

const statusArray = APPT_STATUS_OPTIONS.map((status) => ({ id: status.id.toString(), value: status.value, name: status.label }))

const GeneralModal = ({ location, patient, appointment, operatories, selectedCell, handleClose }: IGeneralModalProps): JSX.Element => {
  const [activeTabItem, setActiveTabItem] = useState("Appointment")
  const dispatch = useDispatch()

  const [deleteApptModalOpen, setDeleteApptModalOpen] = useState(false)

  const [isDeletingAppt, setIsDeletingAppt] = useState(false)

  const date = useSelector((state: any) => state?.Schedule?.date)
  const providers = useSelector((state: any) => state?.Appointment?.providers)
  const patientTypes = useSelector((state: any) => state?.Patient?.patientTypes)

  const operatoriesArray = useMemo(() => operatories.map((opt, index) => ({ id: index.toString(), value: opt.objectId, name: opt.shortName })), [operatories])
  const [patientTypeArray] = useMultiSelectOptions(patientTypes)
  const [teamMembersTypeArray] = useMultiSelectOptions(appointment?.teamMembers || [])
  const [providersArray] = useSelectOptions(providers || [])

  const handleSave = async (): Promise<void> => {
    const values = getValues()
    let { status, other, operatory, provider, date, start, end, chiefConcern, teamMembers, notes, patientTypes, levelNeeds, socialHistory, firstName, lastName, preferredName, emailAddress, gender, dateOfBirth, patientStatus, firstVisitDate, lastVisitDate, ssn, address1, city, state, postalCode } =
      values
    /**
     * React Hook Form
     *   1: React hook form state have same name and dirty properties for each field
     *   2: That's why I destructure properties from dirty object and rename them by using _ at the start of each property.
     */
    let {
      status: _status,
      other: _other,
      operatory: _operatory,
      provider: _provider,
      date: _date,
      start: _start,
      end: _end,
      chiefConcern: _chiefConcern,
      teamMembers: _teamMembers,
      notes: _notes,
      patientTypes: _patientTypes,
      levelNeeds: _levelNeeds,
      socialHistory: _socialHistory,
      firstName: _firstName,
      lastName: _lastName,
      preferredName: _preferredName,
      emailAddress: _emailAddress,
      phones: _phones,
      gender: _gender,
      dateOfBirth: _dateOfBirth,
      patientStatus: _patientStatus,
      firstVisitDate: _firstVisitDate,
      lastVisitDate: _lastVisitDate,
      ssn: _ssn,
      address1: _address1,
      city: _city,
      state: _state,
      postalCode: _postalCode,
    } = dirtyFields
    /**
     * Appointment Payload
     */
    let appointmentPayload = { status, operatory, provider, other, date, start, end, chiefConcern, teamMembers: teamMembers.map((t) => t.id), notes }

    await new Promise(function (resolve) {
      if (appointment) {
        if (!_status && !_operatory && !_provider && !_other && !_date && !_start && !_end && !_chiefConcern && !_teamMembers && !_notes) {
          resolve(true)
          return
        }
        dispatch(
          updateAppointment({
            ...appointmentPayload,
            patient,
            location,
            id: appointment.objectId,
            callback: () => {
              handleClose?.()
              resolve(true)
            },
          })
        )
      } else {
        dispatch(
          addAppointment({
            ...appointmentPayload,
            patient,
            location,
            callback: () => {
              handleClose?.()
              resolve(true)
            },
          })
        )
      }
    })
      .then(() => {
        if (!_patientTypes && !_levelNeeds && !_socialHistory && !_firstName && !_lastName && !_preferredName && !_emailAddress && !_phones && !_gender && !_dateOfBirth && !_patientStatus && !_firstVisitDate && !_lastVisitDate && !_ssn && !_address1 && !_city && !_state && !_postalCode) {
          return null
        }

        dispatch(
          updatePatientInfo({
            patientTypes: patientTypes?.map((object) => object.value),
            levelNeeds: levelNeeds,
            socialHistory: socialHistory,
            firstName: firstName,
            lastName: lastName,
            preferredName: preferredName,
            emailAddress: emailAddress,
            phones: _phones,
            gender: gender,
            dateOfBirth: dateOfBirth,
            patientStatus: patientStatus,
            firstVisitDate: firstVisitDate,
            lastVisitDate: lastVisitDate,
            ssn: ssn,
            address1: _address1,
            city: _city,
            state: _state,
            postalCode: _postalCode,
            patient: patient,
            success: (updatedPatient: any) => {
              dispatch(updatePatientInAppts({ id: updatedPatient?.id, ...updatedPatient?.attributes }))
            },
          })
        )
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  const handleDeleteAppointment = (): void => {
    setIsDeletingAppt(true)
    dispatch(
      deleteAppointment({
        id: appointment?.objectId,
        callback: () => {
          setIsDeletingAppt(false)
          handleClose?.()
        },
      })
    )
  }

  const pushQueue = (): void => {
    Parse.Cloud.run("addVirtualQueue", { appointmentId: appointment?.objectId, patientId: patient?.id, channelName: `Appointment for ${appointment?.objectId}` }).then(function (result) {
      console.log(result, "appointment pushed to virtual queue")
      toast.success("Patient pushed to Virtual Queue")
    })
  }

  const getApptStatus = (): IOption => {
    if (appointment) {
      return statusArray.find((status) => status.value.toUpperCase() === appointment.status) || { id: "6", value: "UNCONFIRMED", name: "Unconfirmed" }
    }
    return { id: "6", value: "UNCONFIRMED", name: "Unconfirmed" }
  }

  const getApptTimeRange = (time: "start" | "end"): IOption => {
    if (time === "start") {
      if (appointment) {
        return timeOptions.find((time) => time.value === formatDate(appointment.start, "hh:mmA")) || timeOptions[0]
      }
      if (selectedCell) {
        return timeOptions.find((time) => time.value === formatDate(selectedCell.start, "hh:mmA")) || timeOptions[0]
      }
      return timeOptions[0]
    } else {
      if (appointment) {
        return timeOptions.find((time) => time.value === formatDate(appointment.end, "hh:mmA")) || timeOptions[6]
      }
      if (selectedCell) {
        return timeOptions.find((time) => time.value === formatDate(selectedCell.end, "hh:mmA")) || timeOptions[6]
      }
      return timeOptions[6]
    }
  }

  const getApptOperatory = (): IOption => {
    if (appointment) {
      return operatoriesArray.find((opt) => opt.value === appointment?.operatory?.objectId) || operatoriesArray[0]
    } else if (selectedCell) {
      return operatoriesArray.find((opt) => opt.value === selectedCell?.operatory?.objectId) || operatoriesArray[0]
    } else {
      return operatoriesArray[0]
    }
  }

  const getProvider = (): any => {
    if (appointment) {
      return providersArray.find((prov: IOption) => prov.value === appointment?.provider?.id) || providersArray[0]
    } else {
      return providersArray[0]
    }
  }

  const {
    control: control,
    getValues: getValues,
    setValue: setValue,
    handleSubmit,
    formState: { isDirty: isDirty, dirtyFields, errors, isSubmitting },
  } = useForm<IDefaultForm>({
    mode: "onChange",
    defaultValues: {
      status: getApptStatus(),
      other: appointment?.other ? appointment?.other : "",
      operatory: getApptOperatory(),
      provider: getProvider(),
      date: appointment?.start ? new Date(appointment.start) : selectedCell?.start ? new Date(selectedCell.start) : new Date(date),
      start: getApptTimeRange("start"),
      end: getApptTimeRange("end"),
      chiefConcern: appointment?.chiefConcern ? appointment?.chiefConcern : "",
      teamMembers: teamMembersTypeArray,
      notes: appointment?.note || "",
      patientTypes: patient?.patientTypes ? patientTypeArray.filter((pType: IOption) => patient?.patientTypes.find((typeID: string) => pType.id === typeID)) : [],
      levelNeeds: patient?.level_needs ? patient?.level_needs : "",
      socialHistory: patient?.social_history ? patient?.social_history : "",
      isVip: patient?.isVip ? patient?.isVip : false,
      firstName: patient?.firstName ? patient?.firstName : " ",
      lastName: patient?.lastName ? patient?.lastName : " ",
      preferredName: patient?.preferredName ? patient?.preferredName : "Not Provided",
      gender: patient?.gender ? patient?.gender : " ",
      dateOfBirth: patient?.dateOfBirth ? patient?.dateOfBirth : " ",
      patientStatus: patient?.patientStatus ? patient?.patientStatus : " ",
      firstVisitDate: patient?.firstVisitDate ? patient?.firstVisitDate : " ",
      // lastVisitDate: patient?.lastVisitDate ? patient?.lastVisitDate : "Not Available",
      ssn: patient?.ssn ? patient?.ssn : "Not Provided",
      emailAddress: patient?.emailAddress ? patient?.emailAddress : " ",
      phones: patient?.phones ? patient?.phones : " ",
      address1: patient?.address1 ? patient?.address1 : " ",
      city: patient?.city ? patient?.city : " ",
      state: patient?.state ? patient?.state : " ",
      postalCode: patient?.postalCode ? patient?.postalCode : " ",
    },
  })
  console.log("patient", patient)

  useEffect(() => {
    setValue("provider", getProvider())
  }, [providersArray])

  return (
    <>
      <div className="pt-0 px-5 pb-5 flex-1 h-full overflow-y-auto overflow-x-hidden w-full">
        <div className="mt-6 mb-5 space-y-5 max-w-4xl">
          <Patient patient={patient} />
          <div className="space-x-2">
            {tabItems.map((tab) => (
              <TabItem onClick={(): void => setActiveTabItem(tab.name)} key={tab.id} text={tab.name} active={tab.name === activeTabItem} />
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit(handleSave)}>
          <div className="mb-20">
            <div className={`max-w-4xl w-full ${activeTabItem === "Appointment" ? "block" : "hidden"}`}>
              <Appointment control={control} errors={errors} operatoriesArray={operatoriesArray} providersArray={providersArray} teamMembersTypeArray={teamMembersTypeArray} appointment={appointment} />
            </div>
            <div className={`max-w-4xl w-full ${activeTabItem === "Patient Info" ? "block" : "hidden"}`}>
              <PatientInfo patientControl={control} patientTypeArray={patientTypeArray} />
            </div>

            <div className={`max-w-4xl w-full ${activeTabItem === "Treatment Plan" ? "block" : "hidden"}`}>
              <TreatmentPlan />
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4 space-x-3 bg-white dark:bg-black-800 border-t dark:border-black-900">
            <div className="space-x-3 flex">
              <Button type="submit" variant="contained" color="gray-dark" loading={isSubmitting} disabled={!isDirty}>
                Save
              </Button>
              <Button variant="outlined" color="gray" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="outlined" color="gray" onClick={pushQueue}>
                Push to VirtualQueue
              </Button>
            </div>
            {appointment ? (
              <div>
                <Button variant="contained" color="red" onClick={(): void => setDeleteApptModalOpen(true)}>
                  Delete
                </Button>
              </div>
            ) : null}
          </div>
        </form>
      </div>
      <Dialog
        variant={Dialog.variant.WARNING}
        open={deleteApptModalOpen}
        setOpen={setDeleteApptModalOpen}
        primaryButtonLoading={isDeletingAppt}
        title="Delete Appointment"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        description="Are you sure want to delete this appointment?"
        onClickPrimaryButton={(): void => {
          handleDeleteAppointment()
        }}
        onClickSecondaryButton={(): void => {
          setDeleteApptModalOpen(false)
        }}
      ></Dialog>
    </>
  )
}

export default GeneralModal
