import { useEffect, useRef, useState } from "react"
import MapGL, { Marker, Popup } from "react-map-gl"
import mapboxgl from "mapbox-gl"
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"

import { locationGeo } from "../utils/mapLocations"
import { config } from "../utils/config"

mapboxgl.workerClass = MapboxWorker

const DEFAULT_ZOOM = 13

export default function Map(props) {
  const {
    locations,
    initialZoom,
    onClick,
    selectedLocation,
    hideOnMobile = false,
  } = props

  const [currentLocation, setCurrentLocation] = useState()
  const [showPopup, setShowPopup] = useState()
  const [viewState, setViewState] = useState()

  const mapRef = useRef()

  useEffect(() => {
    if (!locations || locations?.length === 0) {
      return null
    }
    const getCentralPoint = (arr) => (Math.min(...arr) + Math.max(...arr)) / 2
    
    const longitudes = locations?.map(
      (location) =>
        locationGeo && locationGeo[location?.objectId || location?.id][0]
    )
    const latitudes = locations?.map(
      (location) =>
        locationGeo && locationGeo[location?.objectId || location?.id][1]
    )

    setViewState({
      longitude: getCentralPoint(longitudes),
      latitude: getCentralPoint(latitudes),
      zoom: initialZoom ?? DEFAULT_ZOOM,
    })

    setShowPopup(null)
  }, [locations, initialZoom])

  useEffect(() => {
    if (selectedLocation) {
      mapRef?.current?.flyTo({
        center: locationGeo[selectedLocation?.id || selectedLocation?.objectId],
        zoom: 13,
      })
      setCurrentLocation(selectedLocation)
      setShowPopup(true)
    }
  }, [selectedLocation, locations])

  return (
    <div
      className={`w-full h-full sm:h-1/2 md:h-full md:block md:w-1/2 ${
        hideOnMobile ? "hidden" : "flex"
      }`}
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
                key={`map_marker_${loc?.objectId || loc?.id}`}
                color="#000000"
                longitude={locationGeo[loc?.objectId || loc?.id][0]}
                latitude={locationGeo[loc?.objectId || loc?.id][1]}
                onClick={() => {
                  mapRef.current.flyTo({
                    center: locationGeo[loc?.objectId],
                    zoom: Math.max(initialZoom ?? 0, DEFAULT_ZOOM),
                  })
                  setCurrentLocation(loc)
                  setShowPopup(true)
                }}
              />
            )
          })}
          {showPopup && (
            <Popup
              longitude={
                locationGeo[currentLocation?.objectId || currentLocation?.id][0]
              }
              latitude={
                locationGeo[currentLocation?.objectId || currentLocation?.id][1]
              }
              closeButton={true}
              closeOnClick={false}
              offsetTop={-30}
              onClose={() => setShowPopup(false)}
            >
              <h4>
                <b>{`${currentLocation?.name}:`}</b>
              </h4>
              <h4>{currentLocation?.address}</h4>
              <h4>
                {`${currentLocation?.city}, ${currentLocation?.state} ${currentLocation?.postalCode}`}
              </h4>
              <p>{`${currentLocation?.phone}`}</p>
              {onClick && (
                <button
                  className={`w-full text-mobile-white-100 ${config.app.backgroundColor} rounded uppercase mt-1 p-1 ring-0 focus:ring-0 outline-none`}
                  id={`map-${currentLocation?.id || currentLocation?.objectId}`}
                  onClick={() => onClick(currentLocation || null)}
                >
                  select
                </button>
              )}
            </Popup>
          )}
        </MapGL>
      )}
    </div>
  )
}
