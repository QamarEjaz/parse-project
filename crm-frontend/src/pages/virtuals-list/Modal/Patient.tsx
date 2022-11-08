import Avatar from "../../../components/DataDisplay/Avatar"
import { formatDate, getAgeInYears, getName } from "../../../utils/helpers"
import { PatientItem } from "../WaitingQueue/WaitingQueue.interface"

import VIP from "../../../assets/images/vip-1.png"

const Patient = ({ patient }: { patient: PatientItem }): JSX.Element => {
  return (
    <div className="relative flex justify-center p-5 pb-3">
      <div className="flex items-center flex-col">
        <Avatar image={patient?.profileImage} size="xlarge" className="shadow text-gray-700 bg-gray-100 dark:text-white dark:bg-black-900" firstName={patient?.firstName}></Avatar>
        <div className="mt-3 relative flex items-center">
          {!patient?.is_vip ? <img src={VIP} alt="VIP" className="absolute -left-9 h-6 w-6" /> : null}
          <div className="text-center dark:text-white">
            <span className="text-xl font-semibold">{getName(patient)}</span>
            <span className="text-xs text-gray-700 dark:text-white ml-2">({getAgeInYears(patient?.dateOfBirth)} yo)</span>
          </div>
        </div>
      </div>
      <div className="text-sm absolute top-5 right-5 text-right">
        <div className="text-blue-500 mb-2">
          <span className="font-semibold text-lg">Metlife </span>
          <span className="text-xs">(active until 04/24/23)</span>
        </div>
        <div className="dark:text-white text-sm">Last Visit: {formatDate(patient?.lastVisitDate, "MM/DD/YYYY")}</div>
      </div>
    </div>
  )
}

export default Patient
