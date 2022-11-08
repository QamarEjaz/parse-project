import * as React from "react"
import { ScheduleComponent, Day, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject, DragAndDrop, Resize, DragEventArgs, ResizeEventArgs, CellClickEventArgs } from "@syncfusion/ej2-react-schedule"
import moment from "moment"
import AppointmentCard from "./AppointmentCard"

import { formatDate, mobileAndTabletCheck, updateHeaderRow, updateTimeSlots } from "../utils"

// CSS
import "./index.css"
import { Operatory } from "../../../Types/OperatoryTypes"
import { IAppointment, IConfirmationModalInfo, IEventTemplate, IRoomData, IScheduleTemplateProps } from "./Template.interfaces"
import { useDispatch, useSelector } from "react-redux"
import ConfirmationModal from "../modals/confirmation"
import { updateAppointment } from "../../../Store/Appointment/actions"

/* ------------------------------------------------------------------------ */
/* ------------------------------ Class: ScheduleTemplate ----------------- */

function getRoomData(appointments: IAppointment[], operatories: Operatory[]): IRoomData[] {
  return appointments.map((apt: IAppointment): IRoomData => {
    const operatory: Operatory | undefined = operatories.find((op: Operatory) => op.objectId === apt.operatory.objectId)

    return {
      Id: apt.objectId,
      StartTime: moment(apt.start).toDate(),
      EndTime: moment(apt.end).toDate(),
      RoomId: apt.operatory.objectId,
      AppointmentBackground: operatory?.className || "bg-appointment-green",
      Appointment: apt,
      RecurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA,SU;INTERVAL=1;COUNT=1;",
    }
  })
}

let scheduleObj

const ScheduleTemplate: React.FC<IScheduleTemplateProps> = ({ operatories, appointments, updateLocalAppointment, showApptInfo, setIsCreatingAppt, setSelectedAppt, setSelectedCell }): JSX.Element => {
  const date = useSelector((state: any) => state.Schedule.date)
  const dispatch = useDispatch()

  const [confirmationModalInfo, setConfirmationModalInfo] = React.useState<IConfirmationModalInfo>({
    open: false,
    oldOperatory: null,
    newOperatory: null,
    oldStartTime: null,
    oldEndTime: null,
    newStartTime: null,
    newEndTime: null,
    updateBtnLoading: false,
    handleUpdate: () => null,
    handleCancel: () => null,
  })

  function eventTemplate({ StartTime, EndTime, Appointment, AppointmentBackground }: IEventTemplate): JSX.Element {
    return <AppointmentCard StartTime={StartTime} EndTime={EndTime} Appointment={Appointment} AppointmentBackground={AppointmentBackground} showApptInfo={showApptInfo} />
  }

  const handleDragStart = (args: any): void => {
    if (mobileAndTabletCheck() ? false : args.event?.event?.buttons !== 1) {
      args.cancel = true
      return
    }
  }

  const handleDragStop = (args: DragEventArgs): void => {
    args.cancel = true
    const operatory = operatories.find((opt) => opt.objectId === args.data.RoomId)

    const fromTime = new Date(args.data.StartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace(" ", "")
    const toTime = new Date(args.data.EndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace(" ", "")
    let fdate = "",
      start = "",
      end = ""
    fdate = formatDate(date, "YYYY-MM-DD")
    start = `${fdate} ${moment(fromTime, ["h:mmA"]).format("HH:mm")}`
    end = `${fdate} ${moment(toTime, ["h:mmA"]).format("HH:mm")}`

    const data = {
      id: args.data.Id,
      start,
      end,
      operatory_id: operatory?.objectId,
      provider_id: args.data.ProviderId,
      local: {
        selectedDate: date,
      },
    }

    if (
      args.data.Appointment.operatory.id === { ...args.data.Appointment.operatory, id: operatory?.objectId }.id &&
      new Date(args.data.Appointment.end).toLocaleTimeString() === new Date(args.data.EndTime).toLocaleTimeString() &&
      new Date(args.data.StartTime).toLocaleTimeString() === new Date(args.data.Appointment.start).toLocaleTimeString()
    ) {
      return
    }

    updateLocalAppointment({
      objectId: data.id,
      start: data.start,
      end: data.end,
      operatory: {
        objectId: operatory?.objectId || "123",
        ascend_id: operatory?.ascend_id || "",
        name: operatory?.name || "",
        shortName: operatory?.shortName || "",
        active: operatory?.active || true,
      },
    })

    setConfirmationModalInfo({
      oldStartTime: args.data.Appointment.start,
      oldEndTime: args.data.Appointment.end,
      newStartTime: args.data.StartTime,
      newEndTime: args.data.EndTime,
      oldOperatory: args.data.Appointment.operatory,
      newOperatory: {
        objectId: operatory?.objectId || "123",
        ascend_id: operatory?.ascend_id || "",
        name: operatory?.name || "",
        shortName: operatory?.shortName || "",
        active: operatory?.active || true,
      },
      updateBtnLoading: false,
      open: true,
      handleUpdate: () => {
        setConfirmationModalInfo((prevInfo) => ({ ...prevInfo, updateBtnLoading: true }))
        dispatch(
          updateAppointment({
            status: { value: args.data?.Appointment?.status },
            date: new Date(date),
            start: { value: args.data.StartTime },
            end: { value: args.data.EndTime },
            notes: args?.data?.Appointment?.note,
            teamMembers: args?.data?.Appointment?.teamMembers,
            other: args?.data?.Appointment?.other,
            operatory: { value: operatory?.objectId },
            callback: () => {
              setConfirmationModalInfo((prevInfo) => ({ ...prevInfo, open: false }))
            },
            id: args?.data?.Id,
          })
        )
      },
      handleCancel: () => {
        updateLocalAppointment(args?.data?.Appointment)

        args.cancel = true
        setConfirmationModalInfo((prevInfo) => ({ ...prevInfo, open: false }))
      },
    })
  }

  const handleResizeStart = (args: ResizeEventArgs): void => {
    if (mobileAndTabletCheck() ? false : args.event?.buttons !== 1) {
      args.cancel = true
      return
    }
  }

  const handleResizeStop = (args: ResizeEventArgs): void => {
    args.cancel = true
    const fromTime = new Date(args.data.StartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace(" ", "")
    const toTime = new Date(args.data.EndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace(" ", "")
    let fdate = "",
      start = "",
      end = ""
    fdate = formatDate(date, "YYYY-MM-DD")
    start = `${fdate} ${moment(fromTime, ["h:mmA"]).format("HH:mm")}`
    end = `${fdate} ${moment(toTime, ["h:mmA"]).format("HH:mm")}`

    const data = {
      id: args.data.Id,
      start,
      end,
      local: {
        selectedDate: date,
      },
    }

    if (new Date(args.data.Appointment.end).toLocaleTimeString() === new Date(args.data.EndTime).toLocaleTimeString() && new Date(args.data.StartTime).toLocaleTimeString() === new Date(args.data.Appointment.start).toLocaleTimeString()) {
      return
    }

    updateLocalAppointment({ objectId: data?.id, start: data.start, end: data.end })

    setConfirmationModalInfo({
      oldStartTime: args.data.Appointment.start,
      oldEndTime: args.data.Appointment.end,
      newStartTime: args.data.StartTime,
      newEndTime: args.data.EndTime,
      oldOperatory: null,
      newOperatory: null,
      open: true,
      updateBtnLoading: false,
      handleUpdate: () => {
        setConfirmationModalInfo((prevInfo) => ({ ...prevInfo, updateBtnLoading: true }))
        dispatch(
          updateAppointment({
            status: { value: args.data?.Appointment?.status },
            date: new Date(date),
            start: { value: args.data.StartTime },
            end: { value: args.data.EndTime },
            notes: args?.data?.Appointment?.note,
            teamMembers: args?.data?.Appointment?.teamMembers,
            other: args?.data?.Appointment?.other,
            callback: () => {
              setConfirmationModalInfo((prevInfo) => ({ ...prevInfo, open: false }))
            },
            id: args?.data?.Id,
          })
        )
      },
      handleCancel: () => {
        updateLocalAppointment(args?.data?.Appointment)

        args.cancel = true
        setConfirmationModalInfo((prevInfo) => ({ ...prevInfo, open: false }))
      },
    })
  }

  const handleApptClick = (args: any): void => {
    args.cancel = true

    setIsCreatingAppt(true)
    setSelectedAppt(args?.event?.Appointment || null)
  }

  const handleCellClick = (args: CellClickEventArgs): void => {
    args.cancel = true

    const operatory = operatories[args.groupIndex || 0]

    setIsCreatingAppt(true)
    setSelectedCell({
      start: moment(args?.startTime).format(),
      end: moment(args?.endTime).format(),
      operatory,
    })
  }

  return (
    <>
      <ConfirmationModal
        operatories={operatories}
        updateBtnLoading={confirmationModalInfo.updateBtnLoading}
        open={confirmationModalInfo.open}
        handleUpdate={confirmationModalInfo.handleUpdate}
        handleCancel={confirmationModalInfo.handleCancel}
        oldOperatory={confirmationModalInfo.oldOperatory}
        newOperatory={confirmationModalInfo.newOperatory}
        oldStartTime={confirmationModalInfo.oldStartTime}
        oldEndTime={confirmationModalInfo.oldEndTime}
        newStartTime={confirmationModalInfo.newStartTime}
        newEndTime={confirmationModalInfo.newEndTime}
      />
      <div className="flex e-scheduler">
        <div id="custom-schedule" className="schedule-control-section flex-1 relative">
          <div className="w-full control-section">
            <div className="content-wrapper">
              <div className="schedule-overview">
                <div className={`overview-content pr-3 sm:pr-5 relative ${mobileAndTabletCheck() ? "responsive-scheduler" : ""}`}>
                  <ScheduleComponent
                    key={operatories?.length}
                    id="scheduler"
                    cssClass="schedule-overview"
                    width="100%"
                    currentView="Day"
                    height={"calc(100vh - 64px)"}
                    ref={(schedule): ScheduleComponent | null => {
                      scheduleObj = schedule
                      return scheduleObj
                    }}
                    selectedDate={date}
                    navigating={(): void => {
                      setTimeout(() => {
                        updateHeaderRow(operatories)
                        updateTimeSlots()
                      }, 100)
                    }}
                    group={{
                      resources: ["MeetingRoom"],
                      enableCompactView: false,
                    }}
                    // timezone={process.env.REACT_APP_TIMEZONE}
                    timeScale={{
                      enable: true,
                      interval: 60,
                      slotCount: 6,
                    }}
                    created={(): void => {
                      updateTimeSlots()
                      updateHeaderRow(operatories || [])
                    }}
                    workHours={{
                      highlight: true,
                      start: "08:00",
                      end: "18:00",
                    }}
                    eventSettings={{
                      dataSource: getRoomData(appointments, operatories),

                      /* @ts-ignore:disable-next-line */
                      template: eventTemplate,
                    }}
                    dragStart={handleDragStart}
                    dragStop={handleDragStop}
                    resizeStart={handleResizeStart}
                    resizeStop={handleResizeStop}
                    eventClick={handleApptClick}
                    cellClick={handleCellClick}
                    showHeaderBar={false}
                  >
                    <ResourcesDirective>
                      <ResourceDirective field="RoomId" title="MeetingRoom" name="MeetingRoom" dataSource={operatories} textField="shortName" idField="objectId" colorField="bgColor"></ResourceDirective>
                    </ResourcesDirective>
                    <ViewsDirective>
                      <ViewDirective option="Day" />
                    </ViewsDirective>
                    <Inject services={[Day, Resize, DragAndDrop]} />
                  </ScheduleComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(ScheduleTemplate)
