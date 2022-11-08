import React, { useEffect, useState } from "react";
import { DatePickerCalendar } from "react-nice-dates";
import { isEqual } from "date-fns";
import { enGB } from "date-fns/locale";
import moment from "moment";

import "react-nice-dates/build/style.css";

import { fetchDisabledScheduleOpening } from "../../services/schedule-service";
import Spinner from "../../components/Spinner";

export default function DatePicker({
  date = new Date(),
  setDate,
  selectedLocation,
  reason,
  disabled,
}) {
  const [loading, setLoading] = useState(false);
  const [modifiers, setModifiers] = useState({});

  const [currentMonth, setCurrentMonth] = useState(date);

  useEffect(() => {
    // let location = state.isNewPatient
    //   ? state.aptLocation.id
    //   : state.location.id;

    if (!selectedLocation?.id || !reason || !currentMonth || disabled) return;
    // console.log(state.selectedLocation, state.reason, currentMonth);

    setLoading(true);

    fetchDisabledScheduleOpening(selectedLocation?.id, reason, currentMonth)
      .then((result) => {
        // console.log("fetchDisabledScheduleOpening: ", result);

        if (result?.data) {
          let dates = [];
          Object.keys(result.data).forEach((key) => {
            if (!result.data[key].is_available) {
              dates.push(key);
            }
          });

          let mods = {
            disabled: (date) => {
              const isDisabled = dates.some((dateToDisable) =>
                isEqual(moment(dateToDisable).toDate(), date)
              );

              return isDisabled;
            },
          };
          setModifiers(mods);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log("fetchDisabledScheduleOpening error: ", error?.response);
        setLoading(false);
      });
  }, [currentMonth, selectedLocation, reason, disabled]);

  return (
    <div className={`${disabled ? "pointer-events-none" : ""}`}>
      {disabled && !loading ? (
        <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center z-10 bg-gray-100 bg-opacity-80"></div>
      ) : null}
      {loading && (
        <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center z-10 bg-gray-100 bg-opacity-25 backdrop-blur-sm">
          <Spinner className="w-10 h-10" />
        </div>
      )}

      <DatePickerCalendar
        date={date}
        month={currentMonth}
        onDateChange={setDate}
        onMonthChange={setCurrentMonth}
        locale={enGB}
        minimumDate={new Date()}
        modifiers={modifiers}
      />
    </div>
  );
}
