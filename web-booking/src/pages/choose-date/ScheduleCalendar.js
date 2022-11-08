import React, { useContext, useEffect, useState } from 'react';
import { DatePickerCalendar } from 'react-nice-dates';
import { isEqual } from 'date-fns';
import { enGB } from 'date-fns/locale';

import 'react-nice-dates/build/style.css';

import { store } from '../../store';

import * as actions from '../../utils/actionTypes';
import moment from '../../utils/moment';
import { fetchDisabledScheduleOpening } from '../../utils/actions';

import Loader from '../../components/Loader';

export default function ScheduleCalendar() {
  const { state, dispatch } = useContext(store);

  const [loading, setLoading] = useState(false);
  const [modifiers, setModifiers] = useState({});

  const [date, setDate] = useState(state.date);
  const [currentMonth, setCurrentMonth] = useState(state.date);

  useEffect(() => {
    dispatch({ type: actions.SET_DATE, payload: { date } });
  }, [date]);

  useEffect(() => {
    if (!state.selectedLocation?.id || !state.reason || !currentMonth)
      return '';

    setLoading(true);

    fetchDisabledScheduleOpening(
      state.selectedLocation?.id,
      state.reason,
      currentMonth
    )
      .then((result) => {

        if (result?.data) {
          dispatch({
            type: actions.SET_ALL_SLOTS,
            payload: {
              allSlots: result.data,
            },
          });

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
        setLoading(false);
      });
  }, [currentMonth, state.selectedLocation]);

  return (
    <>
      {loading && (
        <div className='absolute w-full h-full top-0 left-0 flex justify-center items-center z-10 bg-mobile-grey-50 bg-opacity-25'>
          <Loader />
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
    </>
  );
}
