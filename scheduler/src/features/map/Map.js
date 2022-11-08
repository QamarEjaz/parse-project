import React, { useEffect, useState } from "react";
import MapGL, { Marker, Popup } from "react-map-gl";
import mapboxgl from "mapbox-gl";
// import Geocoder from "react-map-gl-geocoder";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { locationGeo } from "../../utils/mapLocations";
import { config } from "../../utils/config";

import "mapbox-gl/dist/mapbox-gl.css";
import { formatPhoneNumber } from "../../utils/helpers";


mapboxgl.workerClass = MapboxWorker;

const DEFAULT_ZOOM = 13;

export default function Map(props) {
  const {
    locations,
    initialZoom,
    onClick,
    mapRef,
    patientPreferredLocationMarker,
    addressMarker,
    handleDisclosureClick,
    patientAddressCoordinates,
    showPatientAddressMarker
  } = props;

  const [currentLocation, setCurrentLocation] = useState();
  const [showPopup, setShowPopup] = useState();
  const [showAddressPopup, setShowAddressPopup] = useState();
  const [viewState, setViewState] = useState();

  useEffect(() => {
    if (!locations || locations.length === 0) {
      return null;
    }
    const getCentralPoint = (arr) => (Math.min(...arr) + Math.max(...arr)) / 2;

    const longitudes = locations?.map(
      (location) =>
        locationGeo && locationGeo[location.objectId || location.id][0]
    );
    const latitudes = locations?.map(
      (location) =>
        locationGeo && locationGeo[location.objectId || location.id][1]
    );

    setViewState({
      longitude: getCentralPoint(longitudes),
      latitude: getCentralPoint(latitudes),
      zoom: initialZoom ?? DEFAULT_ZOOM,
    });

    setShowPopup(null);
    setShowAddressPopup(null);
  }, [locations, initialZoom]);

  return (
    <div
      className="w-full h-full"
    >
      {viewState && (
        <MapGL
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v10"
        >
          {locations?.map((loc) => {
            return (
              <Marker
                key={`map_marker_${loc.objectId || loc.id}`}
                color="#000000"
                longitude={locationGeo[loc.objectId || loc.id][0]}
                latitude={locationGeo[loc.objectId || loc.id][1]}
                onClick={() => {
                  mapRef.current.flyTo({
                    center: locationGeo[loc.objectId],
                    zoom: Math.max(initialZoom ?? 0, DEFAULT_ZOOM),
                  });
                  setCurrentLocation(loc);
                  setShowPopup(true);
                }}
              />
            );
          })}
          {
            addressMarker && 
                <Marker
                  color={`${patientPreferredLocationMarker !== null ? '#62b144' : '#a7a7a7' }`}
                  longitude={addressMarker[0]}
                  latitude={addressMarker[1]}
                  onClick={() => {
                    mapRef.current.flyTo({
                      center: [addressMarker[0], addressMarker[1]],
                      zoom: Math.max(initialZoom ?? 0, DEFAULT_ZOOM),
                    });
                  }}
                />
          }
          {
            showPatientAddressMarker && patientAddressCoordinates && (
              <Marker
                color= '#3498db'
                longitude={patientAddressCoordinates[0]}
                latitude={patientAddressCoordinates[1]}
                onClick={() => {
                  mapRef.current.flyTo({
                    center: patientAddressCoordinates,
                    zoom: Math.max(initialZoom ?? 0, DEFAULT_ZOOM),
                  });
                  setShowAddressPopup(true);
                }}
              />
            )
          }
          {
            patientPreferredLocationMarker && 
                <Marker
                  key={`map_marker_${locationGeo.objectId ?? locationGeo.id}`}
                  color= '#62b144'
                  longitude={locationGeo[patientPreferredLocationMarker?.preferredLocation?.objectId][0]}
                  latitude={locationGeo[patientPreferredLocationMarker?.preferredLocation?.objectId][1]}
                  onClick={() => {
                    mapRef.current.flyTo({
                      center: [locationGeo[patientPreferredLocationMarker?.preferredLocation?.objectId][0],
                        locationGeo[patientPreferredLocationMarker?.preferredLocation?.objectId][1]],
                      zoom: Math.max(initialZoom ?? 0, DEFAULT_ZOOM),
                    });
                    setCurrentLocation(patientPreferredLocationMarker?.preferredLocation);
                    setShowPopup(true);
                  }}
                />
          }
          {showPopup && currentLocation && (
            <Popup
              longitude={
                locationGeo[currentLocation?.objectId || currentLocation?.id || patientPreferredLocationMarker?.preferredLocation?.attributes?.id ][0]
              }
              latitude={
                locationGeo[currentLocation?.objectId || currentLocation?.id || patientPreferredLocationMarker?.preferredLocation?.attributes?.id][1]
              }
              closeButton={true}
              closeOnClick={false}
              offsetTop={-30}
              onClose={() => setShowPopup(false)}
            >
              <h4>
                <b>{`${currentLocation?.name ?? currentLocation?.attributes?.name }:`}</b>
              </h4>
              <h4>{currentLocation?.address ?? currentLocation?.attributes?.address}</h4>
              <h4>
                {`${currentLocation?.city ?? currentLocation?.attributes?.city}, 
                ${currentLocation.state ?? currentLocation?.attributes?.state} 
                ${currentLocation?.postalCode ?? currentLocation?.attributes?.postalCode}`}
              </h4>
              <p>{`${ formatPhoneNumber(currentLocation?.phone ?? currentLocation?.attributes?.phone)}`}</p>
              {
                patientPreferredLocationMarker && 
                patientPreferredLocationMarker?.preferredLocation?.objectId === currentLocation?.objectId && 
                // patientPreferredLocationMarker?.preferredLocation?.objectId === currentLocation?.id || currentLocation?.objectId &&
                <div className="text-[#62b144]"> <i>Patient's Preferred Location</i> </div>
              }
              {onClick && (
                <button
                  className={`w-full text-mobile-white-100 bg-indigo-700 hover:bg-indigo-800 text-white ${config.app.backgroundColor} rounded mt-2 p-1 ring-0 focus:ring-0 outline-none`}
                  id={`map-${currentLocation.id || currentLocation.objectId}`}
                  onClick={ () => {
                    mapRef.current.flyTo({
                      center: locationGeo[currentLocation.objectId],
                      zoom: Math.max(initialZoom ?? 0, DEFAULT_ZOOM),
                    });
                    handleDisclosureClick('disclosure-location', true);
                    onClick(currentLocation.objectId ?? currentLocation.id)} }
                  >
                  Select
                </button>
              )}
            </Popup>
          )}

          { showAddressPopup && 
             <Popup
             longitude={
              patientAddressCoordinates[0]
             }
             latitude={
              patientAddressCoordinates[1]
             }
             closeButton={true}
             closeOnClick={false}
             offsetTop={-30}
             onClose={() => setShowAddressPopup(false)}
           >
               <div className="text-[#3498db]"> <i>Patient Address</i> </div>

           </Popup>
          }
        </MapGL>
      )}
    </div>
  );
}