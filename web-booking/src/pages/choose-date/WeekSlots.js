import React from 'react';

import moment from '../../utils/moment';
import { formatDate, getWeekDates } from '../../utils/helpers';
import SlotButton from '../../components/SlotButton';

const WeekSlots = ({
  slots,
  selectedSlot,
  isNextWeek = false,
  onSelectSlot,
}) => {
  if (!slots) return '';

  let availableSlots = Object.keys(slots).filter(
    (key) =>
      key >= moment().format('YYYY-MM-DD') &&
      slots[key].is_available &&
      getWeekDates(isNextWeek).includes(key)
  );

  return (
    <>
      {availableSlots.length === 0 && (
        <small className='text-mobile-grey-500'>No available slot.</small>
      )}

      {availableSlots.map((key) => (
        <div
          className='flex flex-col border-b-2 border-mobile-grey-100 mb-3'
          key={key}
        >
          <label className='text-sm font-bold mb-2'>
            {formatDate(key, 'dddd - M/D')}
          </label>

          <div className='flex space-x-2 my-2 overflow-x-auto hide-scrollbar'>
            {slots[key].slots.length === 0 && (
              <small className='text-mobile-grey-500'>No available slot.</small>
            )}

            {slots[key].slots.map((slot, i) => (
              <div key={i} className='flex space-x-3'>
                <SlotButton
                  value={slot.start}
                  key={slot.schedule_template_id}
                  onClick={() => onSelectSlot(slot, key)}
                  isSelected={
                    slot.schedule_template_id ===
                    selectedSlot?.schedule_template_id
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default WeekSlots;
