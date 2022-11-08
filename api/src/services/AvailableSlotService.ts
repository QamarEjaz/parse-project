
import moment from 'moment-timezone';
import { LocationV1 } from '../../../core/src/models/LocationV1';
import { ScheduleTemplateV1 } from '../../../core/src/models/ScheduleTemplateV1';
import { ScheduleTemplateReasonV1 } from '../../../core/src/models/ScheduleTemplateReasonV1';
import { AppointmentV1 } from '../../../core/src/models/AppointmentV1';
import { AscendClient } from "./external/AscendClient";

export class AvailableSlotService {
    async retrieveByDateTimeRange(
        location: LocationV1,
        reason: string,
        startDateTimeLocal: moment.Moment,
        endDateTimeLocal: moment.Moment,
        preserveDuplicates: boolean = false,
        useAppointmentsFromAscend: boolean = true,
    ): Promise<{
        [key: string]: ScheduleTemplateV1[];
    }> {
        const scheduleTemplateReason = await new Parse.Query(ScheduleTemplateReasonV1)
            // @ts-ignore
            .equalTo("location", location)
            .equalTo("reason", reason)
            .first({ useMasterKey: true });

        if (!scheduleTemplateReason) {
            return {};
        }

        const scheduleTemplates = await new Parse.Query(ScheduleTemplateV1)
            // @ts-ignore
            .equalTo("reasons", scheduleTemplateReason)
            .equalTo("bookOnline", true)
            // @ts-ignore
            .equalTo("location", location)
            .ascending('start')
            .find({ useMasterKey: true });

        const scheduleTemplatesByDayOfWeek: { [key: string]: ScheduleTemplateV1[] } = {};
        for (const template of scheduleTemplates) {
            if (!scheduleTemplatesByDayOfWeek[template.get("dayOfWeek")]) {
                scheduleTemplatesByDayOfWeek[template.get("dayOfWeek")] = [];
            }
            scheduleTemplatesByDayOfWeek[template.get("dayOfWeek")].push(template);
        }

        const startDateTimeUtc = startDateTimeLocal.clone().tz("UTC");
        const endDateTimeUtc = endDateTimeLocal.clone().tz("UTC");

        const appointments = useAppointmentsFromAscend
            ? await this.retriveAscendAppointmentsForDateRange(
                location.id,
                startDateTimeUtc,
                endDateTimeUtc,
            )
            : await new Parse.Query(AppointmentV1)
                // .include("operatory")
                // @ts-ignore
                .equalTo("location", location)
                .greaterThanOrEqualTo("start", startDateTimeUtc.toDate().toISOString())
                .lessThanOrEqualTo("start", endDateTimeUtc.toDate().toISOString())
                .notEqualTo("status", "BROKEN")
                .ascending("start")
                .find({ useMasterKey: true });

        const appointmentsByDate: { [key: string]: AppointmentV1[] } = {};
        for (const appointment of appointments) {
            const dateString = moment(appointment.get("start")).format("YYYY-MM-DD");
            if (!appointmentsByDate[dateString]) {
                appointmentsByDate[dateString] = [];
            }
            appointmentsByDate[dateString].push(appointment);
        }

        const availableSlotsByDate: { [key: string]: ScheduleTemplateV1[] } = {};

        for (
            let date = startDateTimeLocal.clone();
            date.isBefore(endDateTimeLocal);
            date.add(1, "days")
        ) {
            const dateString = date.format("YYYY-MM-DD");
            const dayOfWeek = date.format("dddd").toUpperCase();

            // Contains all slots initially. The slots that are accupied
            // will be removed from this array.
            const originalTemplatesForDay = scheduleTemplatesByDayOfWeek[dayOfWeek] || [];
            let templatesForDay = originalTemplatesForDay.map(e => {
                const clonedTemplate = ScheduleTemplateV1.fromJSON({
                    className: e.className,
                    ...e.toJSON()
                }) as unknown as ScheduleTemplateV1;
                clonedTemplate.id = e.id;
                return clonedTemplate;
            });
            const appointmentsForDay = appointmentsByDate[dateString] || [];

            for (const [index, schedule] of templatesForDay.entries()) {
                const scheduleStartLocal = moment.tz(`${dateString} ${schedule.get("start")}`, location.get("timeZone"));
                const scheduleEndLocal = moment.tz(`${dateString} ${schedule.get("end")}`, location.get("timeZone"));

                // Remove slot if it appears in the past
                const nowLocal = moment.tz(location.get("timeZone"));
                if(scheduleStartLocal.isBefore(nowLocal)) {
                    delete templatesForDay[index];
                    continue;
                }

                // Remove slot if it doesn't appear between start and end date.
                if (!(
                    scheduleStartLocal.isSameOrAfter(startDateTimeLocal) &&
                    scheduleEndLocal.isSameOrBefore(endDateTimeLocal)
                )) {
                    delete templatesForDay[index];
                    continue;
                }

                for (const appointment of appointmentsForDay) {
                    const appointmentStartLocal = moment(appointment.get("start")).tz(location.get("timeZone"));
                    const appointmentEndLocal = moment(appointment.get("end")).tz(location.get("timeZone"));

                    if (
                        //Stars in the middle of the schedule - ok
                        (appointmentStartLocal.isSameOrAfter(scheduleStartLocal) &&
                            appointmentStartLocal.isBefore(scheduleEndLocal) &&
                            // @ts-ignore
                            appointment.get("operatory").id === schedule.get("operatory").id) ||

                        //Start before and ends after the schedule
                        (appointmentStartLocal.isSameOrBefore(scheduleStartLocal) &&
                            appointmentEndLocal.isAfter(scheduleStartLocal) &&
                            // @ts-ignore
                            appointment.get("operatory").id == schedule.get("operatory").id) ||

                        //Ends in the middle of the schedule
                        (appointmentEndLocal.isAfter(scheduleStartLocal) &&
                            appointmentEndLocal.isSameOrBefore(scheduleEndLocal) &&
                            // @ts-ignore
                            appointment.get("operatory").id == schedule.get("operatory").id)
                    ) {
                        delete templatesForDay[index];
                        break;
                    }

                }
            }

            const availableSlots: ScheduleTemplateV1[] = [];
            for (const template of templatesForDay) {
                if (!template) continue;
                availableSlots.push(template);
            }

            availableSlotsByDate[dateString] = preserveDuplicates
                ? availableSlots
                : [...new Map(availableSlots.map(s => [s.get("start"), s])).values()];
        }

        return availableSlotsByDate;
    }

    private async retriveAscendAppointmentsForDateRange(
        locationId: string,
        startDateTimeUtc: moment.Moment,
        endDateTimeUtc: moment.Moment,
    ): Promise<AppointmentV1[]> {
        const ascendClient = new AscendClient();
        const filtersList = [
            `location.id==${locationId}`,
            `start>=${startDateTimeUtc.toISOString()}`,
            `start<${endDateTimeUtc.toISOString()}`,
            `status!=BROKEN`,
        ];
        const filters = filtersList.join(",");
        let appointments: AppointmentV1[] = [];
        let lastId: string;

        while (true) {
            let ascendCollection = await ascendClient.listAppointmentV1({
                pageSize: 500,
                filters: filters,
                lastId: lastId,
            });

            if (!ascendCollection.data.length) {
                break;
            }

            for (const ascendData of ascendCollection.data) {
                const appointment = new AppointmentV1((ascendData as any));
                appointment.id = ascendData.id;
                appointments.push(appointment);
            }

            lastId = appointments[appointments.length - 1].id;
        }

        return appointments;
    }
}
