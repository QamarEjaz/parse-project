import { Operatory } from "../../../Types/OperatoryTypes"
import moment from "../../../utils/moment"
import { IOption } from "../../../components/Inputs/Select/Select.interfaces"
import { IAppointment } from "../schedule-template/Template.interfaces"

export const mobileAndTabletCheck = () => {
  let check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4)
      )
    )
      check = true
  })(window.navigator.userAgent || window.navigator.vendor)
  return check
}
export const formatDate = (val: string | Date, format = "MM.DD.YYYY", formatFrom = "") => {
  if (!val) return ""

  if (format === "diffForHumans") return moment(val).fromNow()

  return moment(val, formatFrom).format(format)
}
export const validateEmail = (inputText?: string) => {
  if (!inputText) return false
  var email_filter = new RegExp(/^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)
  if (email_filter.test(inputText)) {
    return true
  } else {
    return false
  }
}
export const diffInTwoDateInMinutes = (start: string | number, end: string | number) => {
  // start time and end time
  var startTime = moment(start)
  var endTime = moment(end)

  // calculate total duration
  var duration = moment.duration(endTime.diff(startTime))

  // duration in hours
  // var hours = parseInt(duration.asHours())

  // duration in minutes
  var minutes = duration.asMinutes()

  return minutes
}

export const getAgeInYears = ({ dateOfBirth }: { dateOfBirth: string }) => {
  if (dateOfBirth) return `${Math.floor((new Date().getTime() - new Date(dateOfBirth).getTime()) / 1000 / 60 / 60 / 24 / 365.25)}`
  else return ""
}

export const getName = (nameObj: { firstName?: string; lastName?: string }) => {
  let name = ""
  if (nameObj?.firstName) {
    name += nameObj?.firstName
  }
  if (nameObj?.lastName) {
    name += " "
    name += nameObj?.lastName
  }
  return name
}
export const getTimeOptions = () => {
  let counter = 0
  let time: IOption[] = []
  let minutes = ["00", "10", "20", "30", "40", "50"]

  while (counter < 24) {
    const count = counter
    minutes.map((min) => {
      let format = `${count < 10 ? `0${count}` : count}: ${min}`
      format = formatDate(`${format}`, "hh:mmA", "HH:mm")
      time.push({
        id: `${time.length}`,
        name: format,
        value: format,
      })
      return null
    })
    counter++
  }

  return time
}

export const updateTimeSlots = (): void => {
  const timeSlots = document.querySelectorAll(".e-time-slots")
  let count = 0
  timeSlots.forEach((slot) => {
    if (slot.innerHTML?.length > 0) {
      if (slot.innerHTML.includes("major-time-slot") || slot.innerHTML.includes("minor-time-slot")) return
      slot.innerHTML = `<div class="major-time-slot">${slot.innerHTML.replace(":00", "")}</div>`
      count = 0
    } else {
      if (slot.innerHTML.includes("major-time-slot") || slot.innerHTML.includes("minor-time-slot")) return
      count++
      slot.innerHTML = `<div class="minor-time-slot">${count + "0"}</div>`
    }
  })
}
export const updateHeaderRow = (operatories: Operatory[]): void => {
  const headerRow = document.querySelector(".e-header-row")

  if (headerRow) {
    headerRow.innerHTML = operatories
      .map((opt) => {
        return `<td colspan="1" class="e-resource-cells e-disable-dates">
          <div>
            <div>
              <div class="text-xl font-semibold dark:text-white">${opt?.shortName}</div>
              ${opt.name ? `<div class="dark:text-gray-200">${opt.name}</div>` : ""}
            </div>
          </div>
        </td>`
      })
      .join("")
  }
}

export const addAppointment = (appointment: IAppointment, queryClient: any, date: any, location: any, providers: any, apptStatus: any): void => {
  const apptQueryData: any = queryClient.getQueryData(["schedule-appts", date, location, providers, apptStatus])

  if (!apptQueryData?.data?.find((appt: IAppointment) => appointment?.objectId === appt?.objectId)) {
    queryClient.setQueriesData(["schedule-appts"], (prevAppts: any) => {
      if (prevAppts?.data) return { data: [...prevAppts.data, appointment] }
    })
    return
  }
  queryClient.setQueriesData(["schedule-appts"], (prevAppts: any) => {
    const appts = prevAppts.data

    return {
      data: appts?.map?.((appt: IAppointment) => {
        if (appointment.objectId === appt.objectId) {
          return { ...appointment }
        }
        return appt
      }),
    }
  })
}

export const updateAppointment = (updatedAppt: IAppointment, queryClient: any, date: any, location: any, providers: any, apptStatus: any): void => {
  const apptQueryData: any = queryClient.getQueryData(["schedule-appts", date, location, providers, apptStatus])

  if (apptQueryData?.data?.find((appt: IAppointment) => updatedAppt?.objectId === appt?.objectId))
    queryClient.setQueriesData(["schedule-appts"], (prevAppts: any) => {
      const appts = prevAppts.data

      return {
        data: appts?.map?.((appt: IAppointment) => {
          if (updatedAppt.objectId === appt.objectId) {
            return { ...appt, ...updatedAppt }
          }
          return appt
        }),
      }
    })
}

export const deleteAppointment = (deletedAppt: IAppointment, queryClient: any, date: any, location: any, providers: any, apptStatus: any): void => {
  const apptQueryData: any = queryClient.getQueryData(["schedule-appts", date, location, providers, apptStatus])

  if (apptQueryData?.data?.find((appt: IAppointment) => deletedAppt?.objectId === appt?.objectId))
    queryClient.setQueriesData(["schedule-appts"], (prevAppts: any) => {
      return { data: prevAppts?.data?.filter?.((appt: IAppointment) => appt.objectId !== deletedAppt.objectId) }
    })
}
