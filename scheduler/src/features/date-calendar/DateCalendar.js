import { enGB } from "date-fns/locale";
import { DatePickerCalendar } from "react-nice-dates";

import "react-nice-dates/build/style.css";

export default function DateCalendar({ date = new Date(), setDate }) {
  return (
    <>
      <DatePickerCalendar
        date={date}
        onDateChange={setDate}
        //   onMonthChange={setCurrentMonth}

        locale={enGB}
        minimumDate={new Date()}
      />
    </>
  );
}
