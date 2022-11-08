import React, { useEffect, useRef, useState } from 'react';
import InputField from './InputField';

// const loadGoogleMapScript = (callback) => {
//   if (
//     typeof window.google === 'object' &&
//     typeof window.google.maps === 'object'
//   ) {
//     callback();
//   } else {
//     const googleMapScript = document.createElement('script');
//     googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&map_ids=f956f2176e23bb43&libraries=places`;
//     window.document.body.appendChild(googleMapScript);
//     googleMapScript.addEventListener('load', callback);
//   }
// };

const GPlace = ({
  setAddress,
  setCity,
  setFormState,
  setZip,
  setGPlace,
  gPlace,
  error,
}) => {
  const placeInputRef = useRef(null);
  // const [loadMap, setLoadMap] = useState(false);

  // useEffect(() => {
  //   loadGoogleMapScript(() => {
  //     setLoadMap(true);
  //   });
  // }, []);

  useEffect(() => {
    // if (loadMap) {
    const initPlaceAPI = () => {
      let autocomplete = new window.google.maps.places.Autocomplete(
        placeInputRef.current
      );
      new window.google.maps.event.addListener(
        autocomplete,
        'place_changed',
        function () {
          let place = autocomplete.getPlace();
          setGPlace(place);
          if (!place) return;

          let address = place.name;
          let city = '';
          let state = '';
          let postalCode = '';

          place.address_components.forEach((ac) => {
            ac.types.forEach((t) =>
              t === 'locality' ? (city = ac.long_name) : ''
            );

            ac.types.forEach((t) =>
              t === 'administrative_area_level_1' ? (state = ac.short_name) : ''
            );

            ac.types.forEach((t) =>
              t === 'postal_code' ? (postalCode = ac.long_name) : ''
            );
          });

          setGPlace(place);
          setAddress(address);
          setCity(city);
          setFormState(state);
          setZip(postalCode);
        }
      );
    };

    initPlaceAPI();

    if (gPlace) placeInputRef.current.value = gPlace.formatted_address;
    // }
  }, []);

  return (
    <InputField
      name='address'
      placeholder='Search address or add manually below'
      innerRef={placeInputRef}
      error={error}
    />
  );
};

export default GPlace;
