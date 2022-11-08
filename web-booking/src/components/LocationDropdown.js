import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';

import { store } from '../store';
import * as actions from '../utils/actionTypes';
import { config } from '../utils/config';

export default function LocationDropdown() {
  const { state, dispatch } = useContext(store);
  const [selectedOption, setSelectedOption] = useState('');

  const options = state.locations.map((l) => ({ value: l.id, label: l.name }));

  const handleChange = (value) => setSelectedOption(value);

  useEffect(() => {
    const selectedLocation = state.isNewPatient
      ? state.aptLocation
      : state.location;

    if (selectedLocation) {
      setSelectedOption({
        value: selectedLocation.id,
        label: selectedLocation.name,
      });
    }
  }, []);

  useEffect(() => {
    if (!selectedOption) return;

    let loc = state.locations.find((l) => l.id === selectedOption.value);
    if (!loc) return;

    dispatch({
      type: actions.SET_SELECTED_LOCATION,
      payload: {
        selectedLocation: { ...loc },
      },
    });
  }, [selectedOption]);

  return (
    <Select
      name='location'
      value={selectedOption}
      options={options}
      onChange={handleChange}
      className='react-select-container'
      classNamePrefix='react-select'
      isDisabled={state.isNewPatient}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: '#eee',
          primary: config.app.brandColor,
        },
      })}
    />
  );
}
