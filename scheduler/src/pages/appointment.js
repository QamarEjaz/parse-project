import Parse from "parse";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateAppointment from "../features/create-appointment/CreateAppointment";
import CreatePatient from "../features/create-patient/CreatePatient";
import Map from "../features/map/Map";
import { locationGeo } from "../utils/mapLocations";
import { parseConfig } from "../utils/ParseConfig";
import { getLocation } from "../Store/Location/actions";
import Header from "../components/Header";
import { toast } from "react-toastify";

const Appointment = () => {
  let dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isChangedForm, setIsChangedForm] = useState(false);
  const [addressMarker, setAddressMarker] = useState(null);
  const [patientSubscription, setPatientSubscription] = useState();
  const [patient, setPatient] = useState(null)
  const [insuranceInfo, setInsuranceInfo] = useState([])
  const [patientPreferredLocationMarker, setPatientPreferredLocationMarker] = useState(null);
  const [showCreatePatientComponent, setShowCreatePatientComponent] = useState(false);
  const [showPatientAddressMarker, setShowPatientAddressMarker] = useState(null);
  const [patientAddressCoordinates, setPatientAddressCoordinates] = useState(null);
  let locations = useSelector((state) => state?.Location?.locations);
  const [openDisclosure, setOpenDisclosure] = useState([
    { id: "disclosure-patient", isOpen: true },
    { id: "disclosure-location", isOpen: false },
    { id: "disclosure-dateTime", isOpen: false },
    { id: "disclosure-paymentInfo", isOpen: false },
    { id: "disclosure-insuranceInfo", isOpen: false },
    { id: "disclosure-notes", isOpen: false },
  ]);
  const mapRef = useRef();

  const handleDisclosureClick = (id, clickedFromMap) => {
    if (clickedFromMap) {
      setOpenDisclosure(
        openDisclosure.map((d) =>
          d.id === id ? { ...d, isOpen: true } : { ...d, isOpen: false }
        )
      );
    } else {
      setOpenDisclosure(
        openDisclosure.map((d) =>
          d.id === id ? { ...d, isOpen: !d.isOpen } : { ...d, isOpen: false }
        )
      );
      if (selectedLocation && selectedLocation?.name !== 'Select' && mapRef?.current) {
        mapRef?.current?.flyTo({
          center: locationGeo[selectedLocation.objectId],
          zoom: 15,
        });
      }
    }
  };

  const onMapClick = (id) => {
    const location = locations?.find((loc) => loc.objectId === id)
    if (location) {
      setSelectedLocation(location);
    } else {
      toast.error('Select welcome center location for new Patient!')
    }
  };

  useEffect(() => {
    parseConfig();
    dispatch(getLocation(patient));
    if (patient) {
      getPatientInsuranceInfo(patient);
      if (patient?.preferredLocation?.objectId) {
        if (mapRef?.current) {
          setPatientPreferredLocationMarker(patient)
          mapRef?.current?.flyTo({
            center: locationGeo[patient?.preferredLocation?.objectId],
            zoom: 13,
          });
        }
      }
    } else {
      patientSubscription?.unsubscribe();
    }
  }, [patient]);

  const getPatientInsuranceInfo = async (patient) => {
    const insuranceQuery = new Parse.Query("Insurance");
    insuranceQuery.equalTo("patient", patient.objectId);
    const insurance = await insuranceQuery.find();
    setInsuranceInfo(insurance);
  };

  const handlePatientUpdates = async (patient) => {
    const patientJson = patient.toJSON();
    setPatient(patientJson);
  };

  const initializeLiveQueryOnPatient = async (data) => {
    patientSubscription?.unsubscribe();
    const patientQuery = new Parse.Query("PatientV1");

    if (!data?.objectId) {
      patientQuery.equalTo("firstName", data?.firstName);
      patientQuery.equalTo("lastName", data?.lastName);
      patientQuery.equalTo("emailAddress", data?.emailAddress);
      patientQuery.equalTo("dateOfBirth", data?.dateOfBirth);
      patientQuery.equalTo("gender", data?.gender);
      // patientQuery.equalTo("preferredLocation", data?.preferredLocation.objectId);
      patientQuery.equalTo("city", data?.city);
      patientQuery.equalTo("state", data?.state);
      patientQuery.equalTo("address1", data?.address1);
    } else {
      patientQuery.equalTo("objectId", data?.objectId);
    }

    const sub = await patientQuery.subscribe();
    setPatientSubscription(sub);

    sub.on("close", () => {
      console.log("Subscription Closed...");
    });

    sub.on("open", () => {
      console.log("Subscription Opened...");
    });

    sub.on('create', (patient) => {
      console.log('Patient Created', patient);
      handlePatientUpdates(patient);
    });

    sub.on("update", async (patient) => {
      console.log("Patient Updated", patient);
      handlePatientUpdates(patient);
    });

    sub.on("enter", (patient) => {
      console.log("Patient Enter", patient);
      handlePatientUpdates(patient);
    });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col-reverse md:grid grid-cols-2 h-screen md:overflow-hidden pt-24 sm:pt-40 mx-auto md:pt-24">
        <div className="border-t md:border-r md:border-t-0 flex flex-col col-span-1 relative pb-16 md:pb-20 overflow-hidden h-full">
          <div className="flex-1 flex flex-col w-full col-span-1 overflow-auto">
            {!showCreatePatientComponent ? (
              <CreateAppointment
                title="Create Appointment"
                insuranceInfo={insuranceInfo}
                setShowPatientAddressMarker={setShowPatientAddressMarker}
                setPatientAddressCoordinates={setPatientAddressCoordinates}
                handleDisclosureClick={handleDisclosureClick}
                initializeLiveQueryOnPatient={initializeLiveQueryOnPatient}
                setPatientPreferredLocationMarker={
                  setPatientPreferredLocationMarker
                }
                mapRef={mapRef}
                setIsChangedForm={setIsChangedForm}
                setShowCreatePatientComponent={setShowCreatePatientComponent}
                locations={locations}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                setOpenDisclosure={setOpenDisclosure}
                openDisclosure={openDisclosure}
                patient={patient}
                setPatient={setPatient}
              />
            ) : (
              <CreatePatient
                mapRef={mapRef}
                setPatientPreferredLocationMarker={
                  setPatientPreferredLocationMarker
                }
                addressMarker={addressMarker}
                setAddressMarker={setAddressMarker}
                setShowCreatePatientComponent={setShowCreatePatientComponent}
                setIsChangedForm={setIsChangedForm}
                locations={locations}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                setPatient={setPatient}
                initializeLiveQueryOnPatient={initializeLiveQueryOnPatient}
              />
            )}
          </div>
        </div>
        <div className="h-2/5 md:h-full">
          {locations?.length ? (
            <Map
              mapRef={mapRef}
              addressMarker={addressMarker}
              patientPreferredLocationMarker={patientPreferredLocationMarker}
              patientAddressCoordinates={patientAddressCoordinates}
              locations={locations}
              initialZoom={10}
              handleDisclosureClick={handleDisclosureClick}
              showPatientAddressMarker={showPatientAddressMarker}
              onClick={onMapClick}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Appointment;
