import React, { useEffect, useRef, useState } from "react";
import TextField from "./TextField";

const GPlace = ({
  setAddress,
  setCity,
  setFormState,
  setZip,
  setGPlace,
  placeInputRef,
  gPlace,
  error,
  label,
  formState,
  setCheckLocation,
  id = "address-field",
  mapRef,
  setAddressMarker
}) => {
  const [test, setTest] = useState("");
  useEffect(() => {
    const initPlaceAPI = () => {
      let autocomplete = new window.google.maps.places.Autocomplete(
        placeInputRef.current,
        { componentRestrictions: { country: "us" } }
      );
      setAddress(formState?.defaultValues?.address);
      setCity(formState?.defaultValues?.city);
      setFormState(formState?.defaultValues?.state);
      setZip(formState?.defaultValues?.postalCode);
      new window.google.maps.event.addListener(
        autocomplete,
        "place_changed",
        function () {
          let place = autocomplete.getPlace();

          setAddressMarker([place.geometry.location.lng(), place.geometry.location.lat()])
          if (place) {
            if (mapRef?.current) {
              mapRef?.current?.flyTo({
                center: [place.geometry.location.lng(), place.geometry.location.lat()],
                zoom: 13,
              });
            }
          }
          setCheckLocation(!place ? { name: "" } : "");
          if (!place) return;

          let address = place.formatted_address;
          let city = "";
          let state = "";
          let postalCode = "";

          place.address_components.forEach((ac) => {
            ac.types.forEach((t) =>
              t === "locality" ? (city = ac.long_name) : ""
            );

            ac.types.forEach((t) =>
              t === "administrative_area_level_1" ? (state = ac.short_name) : ""
            );

            ac.types.forEach((t) =>
              t === "postal_code" ? (postalCode = ac.long_name) : ""
            );
          });

          // setGPlace(place);
          setAddress(address);
          setCity(city);
          setFormState(state);
          setZip(postalCode);
        }
      );
    };

    initPlaceAPI();

    if (gPlace) placeInputRef.current.value = gPlace.formatted_address;
  }, [test]);

  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className={`block text-sm font-medium transition-colors ${
            error ? "text-red-500" : "text-gray-700"
          } mb-1`}
        >
          {label}
        </label>
      ) : null}
      <TextField
        name="address"
        placeholder=""
        id={id}
        inputRef={placeInputRef}
        error={error}
        onChange={(e) => setTest(e.target.value)}
      />
    </div>
  );
};

export default GPlace;
