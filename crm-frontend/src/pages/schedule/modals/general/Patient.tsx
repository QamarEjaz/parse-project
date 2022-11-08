import Avatar from "../../../../components/DataDisplay/Avatar"
import Button from "../../../../components/Inputs/Button"
import { formatDate, getAgeInYears, getName } from "../../utils"
import { BellIcon, ChatAltIcon, ClipboardListIcon, PhoneIcon } from "@heroicons/react/solid"
import Dialog from "../../../../components/Feedback/Dialog"
import { useState } from "react"

interface IPatient {
  profile_image: string | null
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string | number
  vip: boolean
  uid: string
  id: string
}
interface IPatientProps {
  patient: IPatient
}

const Patient = ({ patient }: IPatientProps): JSX.Element => {
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div className={`flex items-center flex-1 justify-between`}>
          <div className="flex items-center">
            <div>
              <Avatar image={patient.profile_image} firstName={patient?.firstName} size="medium" bg="bg-gray-100 dark:bg-black-900" text="text-xl text-black dark:text-white" />
            </div>
            <div className="ml-5 text-gray-400 text-sm space-y-1">
              <h2 className="sm:w-56 whitespace-nowrap text-ellipsis overflow-hidden capitalize font-bold text-xl text-black-1000 dark:text-white md:text-xl md:w-full md:max-w-sm 2xl:text-2xl">
                {getName({
                  firstName: patient?.firstName,
                  lastName: patient?.lastName,
                })}{" "}
                {patient?.vip && <span className="bg-yellow-100 text-xs px-2 py-0.5 uppercase rounded-md dark:bg-black-900"> VIP </span>}
              </h2>
              {patient?.dateOfBirth && (
                <div className="dark:text-gray-300">{`${formatDate(patient?.dateOfBirth, "DD/MM/YYYY")} (${getAgeInYears({
                  dateOfBirth: patient?.dateOfBirth,
                })} years old) `}</div>
              )}
              <div className="flex space-x-4 dark:text-gray-300">
                <button className="inline-block" onClick={(): void => setNotificationModalOpen(true)}>
                  <BellIcon className="text-sm w-5" />
                </button>
                <button className="inline-block">
                  <ChatAltIcon className="text-sm w-5" />
                </button>
                {patient?.phone && (
                  <a href={`tel:${patient?.phone}`} className="inline-block">
                    <PhoneIcon className="text-sm w-5" />
                  </a>
                )}
                <button className="inline-block">
                  <ClipboardListIcon className="text-sm w-5" />
                </button>
              </div>
            </div>
          </div>
          <a className="ml-5 2xl:ml-0 self-end lg:self-auto" href={`${process.env.REACT_APP_DENTRIX_URL}/pm#/patient/overview/${patient?.id}`} target="_blank" rel="noreferrer">
            <Button variant="outlined" color="gray">
              View in Ascend
            </Button>
          </a>
        </div>
      </div>
      <Dialog variant={Dialog.variant.NOTIFICATION} title="Send Notification" open={notificationModalOpen} setOpen={setNotificationModalOpen} />
    </>
  )
}

export default Patient
