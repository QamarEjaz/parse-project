import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Parse from "parse";
import { DatePickerCalendar } from "react-nice-dates";
import { enGB } from "date-fns/locale";
import { isEqual } from "date-fns";
import Button from "../../components/Form/Button";
import TextArea from "../../components/Form/TextArea";
import { formatDate, formatPhoneNumber } from "../../utils/helpers";
import PatientSearch from "../patient-search/PatientSearch";
import { Select } from "../../components/Form/Select";
import FormErrors from "../../components/Form/FormErrors";
import { successLog } from "../../services/patient-service";
import { useCallback } from "react";
import DatePicker from "../date-picker/DatePicker";
import moment from "moment";
import Loader from "../../components/Loader";
import SlotButton from "../../components/SlotButton";
import { useDispatch,useSelector } from "react-redux";
import { locationGeo } from "../../utils/mapLocations";
import { toast } from "react-toastify";
import { CreatePatientAppointment } from "../../Store/Appointment/actions";
import { Disclosure, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Modal from "./modal/popup";
import InsuranceForm from "./Insurance";
import Geocode from "react-geocode";
import { parseConfig } from "../../utils/ParseConfig";
import { timeSlotAndLocationSuccess } from "../../Store/Location/actions";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);

const CreateAppointment = ({
  className,
  handleChangeTab,
  handleDisclosureClick,
  initializeLiveQueryOnPatient,
  insuranceInfo,
  locations,
  mapRef,
  openDisclosure,
  patient,
  selectedLocation,
  setIsChangedForm,
  setPatient,
  setPatientAddressCoordinates,
  setPatientPreferredLocationMarker,
  setSelectedLocation,
  setShowCreatePatientComponent,
  setShowPatientAddressMarker,
  tabs,
  title
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const [insuranceBtn, setInsuranceBtn] = useState(false);
  const [creditCardBtn, setCreditCardBtn] = useState(false);
  const [openApptDialog, setOpenApptDialog] = useState(false);
  const [homeOfficeWarning, setHomeOfficeWarning] = useState(true);
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [monthTimeSlots, setMonthTimeSlots] = useState({});
  const [timeSlotLoader, setTimeSlotLoader] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dispatch = useDispatch();

  const timeSlotChoosen = useSelector((state) => state?.Location?.timeSloteAndLocation)

  const {
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    setError: setFormError,
    clearErrors,
    control,
    formState,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      location: { id: 1, value: null, name: "Select" },
      date: new Date(),
      note: "",
      reason: "Other",
    },
  });

  const createSuccessLog = useCallback(async (data, count) => {
    try {
      await successLog(data);
      count = 0;
    } catch (error) {
      count += 1;
      if (count <= 2) {
        createSuccessLog(data, count);
      }
    }
  }, []);

  const onSubmit = async () => {
    if (selectedLocation.value === null || !patient) {
      toast.error("Please select all fields");
    } else {
      if (
        selectedLocation?.objectId !== patient?.preferredLocation?.id &&
        homeOfficeWarning
      ) {
        setOpenApptDialog(true);
        return;
      }
      setLoading(true);
      const data = {
        patientId: patient?.id ?? patient.objectId,
        locationId: selectedLocation?.objectId,
        date: moment(date).format("YYYY-MM-DD"),
        start: timeSlotChoosen?.start,  //time slot value that is store in Redux
        generatedBy: "web",
        note: note,
        setLoading: setLoading,
        handleDiscard: handleDiscard,
      };

      try {
        dispatch(CreatePatientAppointment(data));
        // setBtn(true);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const handleDiscard = () => {
    resetFields();
    setDate(new Date());
    setCurrentMonth(new Date());
    setMonthTimeSlots({});
    setTimeSlot([]);
    setSelectedSlot(null);
    setError(null);
    setTimeSlotLoader(false);
    setPatient(formState?.defaultValues?.patient);
    setQuery("");
    setPatientPreferredLocationMarker(null);
    setShowPatientAddressMarker(null);
    setValue("location", {
      id: 1,
      value: "",
      name: "Select",
    });
  };

  const updateLocationField = (location) => {
    setFormError("location", null);
    setValue("location", {
      id: location?.objectId,
      value: location?.objectId,
      name: location?.name,
    });
  };

  const selectOptions =
    locations?.length > 0 &&
    locations?.map((location) => ({
      id: location?.objectId,
      value: location?.objectId,
      name: location?.name,
    }));

  const resetFields = () => {
    reset({
      date: null,
      note: "",
      reason: "Other",
      location: selectedLocation?.objectId
        ? {
            id: selectedLocation?.objectId,
            value: selectedLocation?.objectId,
            name: selectedLocation?.name,
          }
        : { id: 1, value: null, name: "Select" },
    });
  };

  useEffect(() => {
    if (patient) {
      if (!patient.insuranceInfo) {
      }

      if (patient?.location?.objectId) {
        setSelectedLocation(patient?.location);

        if (patient?.patientStatus === "NEW") {
          return setValue("location", {
            id: 1,
            value: "",
            name: "Select",
          });
        }
        updateLocationField(patient?.location);
      }
    }
  }, [patient]);

  useEffect(() => {
    if (selectedLocation?.objectId) {
      updateLocationField(selectedLocation);
    }
    // eslint-disable-next-line
  }, [selectedLocation]);

  useEffect(() => {
    setSelectedLocation(formState?.defaultValues?.location);
  }, []);

  useEffect(() => {
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(date);
    }
    setSelectedSlot(null);
  }, [date]);

  const modifiers = useMemo(() => {
    setDate(currentMonth);
    let dates = [];
    Object.keys(monthTimeSlots).forEach((key) => {
      if (!monthTimeSlots[key].length) {
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

    return mods;
  }, [monthTimeSlots]);

  const bookingTimeSlots = async () => {
    const isPatientNew = patient?.hasCompletedAppointment;
    const isRemoteLocation = selectedLocation?.isRemote;
    const reasonForBooking = patient?.hasCompletedAppointment
      ? "Teeth Cleaning"
      : "Other";
    try {
      setTimeSlotLoader(true);
      const getTimeSlote = await Parse.Cloud.run(
        "bookingSlotsRetrieveByDateRange",
        {
          locationId: selectedLocation.objectId,
          reason: reasonForBooking,
          startDateTime: moment(currentMonth)
            .startOf("month")
            .format("YYYY-MM-DD 00:00"),
          endDateTime: moment(currentMonth)
            .endOf("month")
            .format("YYYY-MM-DD 23:59:59"),
          useFromAscend: true,
        }
      );
      setMonthTimeSlots(getTimeSlote);
      setTimeSlotLoader(false);
    } catch (error) {
      setTimeSlotLoader(false);
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (selectedLocation && selectedLocation?.id !== 1 && patient) {
      bookingTimeSlots();
    }
  }, [currentMonth, selectedLocation]); //TIME_SLOT_AVAILABILITY

  useEffect(() => {
    setIsChangedForm(formState?.isDirty);
  }, [formState, setIsChangedForm]);

  useEffect(() => {
    if (date) {
      setTimeSlot(monthTimeSlots[formatDate(date, "YYYY-MM-DD")]);
    }
  }, [date, monthTimeSlots]);

  const sendInsuranceSms = async () => {
    if (patient) {
      setInsuranceBtn(true);
      try {
        await Parse.Cloud.run("sendUpdatePatientInsuranceNotification", {
          patientId: patient?.id ?? patient?.objectId,
        });
        setInsuranceBtn(false);
        toast.success("SMS sent successfully");
      } catch (error) {
        setInsuranceBtn(false);
        toast.error(JSON.stringify(error.message));
      }
    } else {
      toast.error("Please Select a Patient first to send Sms");
    }
  };

  const sendCreditCardSms = async () => {
    if (patient) {
      setCreditCardBtn(true);
      try {
        const patient_id = patient.id || patient.objectId;

        await Parse.Cloud.run("sendUpdatePatientCreditCardNotification", {
          patientId: patient_id,
        });
        setCreditCardBtn(false);
        toast.success("SMS sent successfully");
      } catch (error) {
        setCreditCardBtn(false);
        toast.error(JSON.stringify(error.message));
      }
    } else {
      toast.error("Please Select a Patient first to send Sms");
    }
  };

  const checkDisclosure = (id) => {
    const disc = openDisclosure.filter((d) => d.id === id);
    return disc[0].isOpen;
  };

  const getCoordinatesFromAddress = async (patient) => {
    Geocode.fromAddress(patient?.address1).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;

        setPatientAddressCoordinates([lng, lat]);
        setShowPatientAddressMarker(true);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const saveSlot = async (slot) =>{
    dispatch(timeSlotAndLocationSuccess(slot))
  }

  useEffect(()=>{
    saveSlot(selectedSlot)
  },[selectedSlot])

  const patientCardComponent = (patient) => {
    return (
      <>
        <div className="mt-3 mb-3 flex justify-center">
          <div className="relative w-full px-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md dark:bg-white">
            <button
              className="absolute -top-3 -right-3 rounded-r-md"
              onClick={() => {
                setPatient(null);
                setQuery("");
                resetFields();
                setPatientPreferredLocationMarker(null);
                setShowPatientAddressMarker(null);
              }}
            >
              <XCircleIcon className="h-6 w-6 fill-red-500" />
            </button>
            <div className="flex justify-between">
              <h5 className="mt-2 text-xl font-bold capitalize tracking-tight text-gray-900 dark:text-black">
                {patient?.firstName} {patient?.lastName}
              </h5>
              <div className="mt-3 text-mobile-gray-600">
                <span className="bg-green-300 text-green-900 text-xs font-semibold mr-2 px-3 py-1 dark:bg-green-300 dark:text-green-900 rounded-full">
                  {patient?.patientStatus}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 mb-2 content-center">
              <p className="font-normal text-black dark:text-black">Email:</p>
              <p className="font-normal text-gray-700 dark:text-black truncate hover:text-clip">
                {patient?.emailAddress ? patient?.emailAddress : "N/A"}
              </p>
              <p className="font-normal text-gray-700 dark:text-black">
                Phone#
              </p>
              <p className="font-normal text-gray-700 dark:text-black">
                {patient?.phones && patient?.phones.length
                  ? formatPhoneNumber(patient?.phones[0].number)
                  : "N/A"}
              </p>
              <p className="font-normal text-gray-700 dark:text-black">
                Date of birth:
              </p>
              <p className="font-normal text-gray-700 dark:text-black">
                {patient?.dateOfBirth ? patient?.dateOfBirth : "N/A"}
              </p>
              <p className="font-normal text-gray-700 dark:text-black">
                Address:
              </p>
              <p className="font-normal text-gray-700 dark:text-black truncate hover:text-clip">
                {patient?.address1 ? patient?.address1 : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <form className="flex flex-col flex-1" onSubmit={handleSubmit(onSubmit)}>
      <div className={`flex-1 w-full flex flex-col ${className}`}>
        <div className="mx-auto w-full max-w-3xl w-full px-4 py-12">
          <div className="pb-8 text-gray font-bold text-xl lg:text-3xl">
            {title}
          </div>
          <div className="rounded-2xl bg-white shadow-md border">
            <div className="px-6 py-6">
              <Disclosure defaultOpen={checkDisclosure("disclosure-patient")}>
                <>
                  <Disclosure.Button
                    className={`${
                      checkDisclosure("disclosure-patient")
                        ? "bg-[#62B144] text-white"
                        : "bg-gray-100 text-gray-600"
                    } flex items-center  hover:text-white w-full justify-between rounded-lg px-4 py-3 text-left text-lg font-medium hover:bg-[#529638] focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}
                    aria-expanded={checkDisclosure("disclosure-patient")}
                    onClick={() => handleDisclosureClick("disclosure-patient")}
                  >
                    <span>Patient</span>

                    <ChevronDownIcon
                      className={`${
                        checkDisclosure("disclosure-patient")
                          ? "h-5 w-5 rotate-180 transform text-white"
                          : "h-5 w-5"
                      }`}
                    />
                  </Disclosure.Button>
                  <Transition
                    show={checkDisclosure("disclosure-patient")}
                    enter="transition duration-400 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-200 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 grid grid-cols-1">
                      {!patient ? (
                        <Controller
                          name="patient"
                          control={control}
                          render={({ field }) => {
                            const { onChange } = field;
                            return (
                              <PatientSearch
                                mapRef={mapRef}
                                setPatientPreferredLocationMarker={
                                  setPatientPreferredLocationMarker
                                }
                                onClickPatientBtn={() =>
                                  handleChangeTab(
                                    tabs.find(
                                      (tab) => tab.name === "Create Patient"
                                    ).id
                                  )
                                }
                                query={query}
                                setQuery={setQuery}
                                error={formState?.errors?.patient}
                                helperText={formState?.errors?.patient?.message}
                                selectedPatient={patient}
                                setSelectedPatient={(patient) => {
                                  setPatient(patient);
                                  getCoordinatesFromAddress(patient);
                                  onChange(
                                    patient?.id || patient?.objectId || ""
                                  );
                                  initializeLiveQueryOnPatient(patient);
                                }}
                              />
                            );
                          }}
                        />
                      ) : (
                        patientCardComponent(patient)
                      )}
                      {!patient ? (
                        <>
                          <span className="my-1 text-lg justify-self-center">
                            or
                          </span>
                          <Button
                            type="button"
                            className="py-3 px-6 bg-[#62B144] hover:bg-[#529638] text-white font-bold rounded-full relative mt-1"
                            onClick={() => {
                              setShowCreatePatientComponent(true);
                              handleDiscard();
                              setSelectedLocation(null);
                            }}
                          >
                            Create new Patient
                          </Button>
                        </>
                      ) : null}
                    </Disclosure.Panel>
                  </Transition>
                </>
              </Disclosure>
              {patient && (
                <>
                  <Disclosure as="div" className="mt-2">
                    <>
                      <Disclosure.Button
                        className={`${
                          checkDisclosure("disclosure-location")
                            ? "bg-[#62B144] text-white"
                            : "bg-gray-100 text-gray-600"
                        } flex items-center  hover:text-white w-full justify-between rounded-lg px-4 py-3 text-left text-lg font-medium hover:bg-[#529638] focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}
                        aria-expanded={checkDisclosure("disclosure-location")}
                        onClick={() =>
                          handleDisclosureClick("disclosure-location")
                        }
                      >
                        <span>Location</span>

                        <ChevronDownIcon
                          className={`${
                            checkDisclosure("disclosure-location")
                              ? "h-5 w-5 rotate-180 transform text-white"
                              : "h-5 w-5"
                          }`}
                        />
                      </Disclosure.Button>
                      <Transition
                        show={checkDisclosure("disclosure-location")}
                        enter="transition duration-400 ease-in"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-200 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                          <Controller
                            name="location"
                            control={control}
                            render={({ field }) => {
                              const { name, value, onChange } = field;
                              if (locations?.length > 0) {
                                return (
                                  <Select
                                    preferredLocation={
                                      patient?.preferredLocation
                                        ? patient?.preferredLocation
                                        : "not selected"
                                    }
                                    setOpen={setOpenApptDialog}
                                    error={formState?.errors?.location?.type}
                                    helperText={
                                      formState?.errors?.location?.message
                                    }
                                    options={selectOptions}
                                    label="Location"
                                    name={name}
                                    value={value}
                                    onChange={(selected) => {
                                      setSelectedLocation(
                                        locations?.length > 0 &&
                                          locations.find(
                                            (loc) =>
                                              loc?.objectId === selected.value
                                          )
                                      );
                                      if (mapRef?.current) {
                                        mapRef?.current?.flyTo({
                                          center: locationGeo[selected.value],
                                          zoom: 13,
                                        });
                                      }
                                      onChange(selected);
                                    }}
                                  />
                                );
                              }
                            }}
                          />
                        </Disclosure.Panel>
                      </Transition>
                    </>
                    {/* )} */}
                  </Disclosure>
                  {selectedLocation?.name !== "Select" && (
                    <Disclosure as="div" className="mt-2">
                      <>
                        <Disclosure.Button
                          className={`${
                            checkDisclosure("disclosure-dateTime")
                              ? "bg-[#62B144] text-white"
                              : "bg-gray-100 text-gray-600"
                          } flex items-center  hover:text-white w-full justify-between rounded-lg px-4 py-3 text-left text-lg font-medium hover:bg-[#529638] focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}
                          aria-expanded={checkDisclosure("disclosure-dateTime")}
                          onClick={() =>
                            handleDisclosureClick("disclosure-dateTime")
                          }
                        >
                          <span>Date & Time</span>

                          <ChevronDownIcon
                            className={`${
                              checkDisclosure("disclosure-dateTime")
                                ? "h-5 w-5 rotate-180 transform text-white"
                                : "h-5 w-5"
                            }`}
                          />
                        </Disclosure.Button>
                        <Transition
                          show={checkDisclosure("disclosure-dateTime")}
                          enter="transition duration-400 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-200 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            <div className="col-span-2 grid items-start grid-cols-1 sm:grid-cols-2 mt-4 gap-x-4 sm:gap-x-6 gap-y-6">
                              <div
                                className={`md:col-span-2 lg:col-span-1 border border-gray-300 ${
                                  formState?.errors?.date
                                    ? "border-red-500"
                                    : ""
                                } p-1 rounded-md overflow-scroll`}
                              >
                                <div>
                                  <Controller
                                    name="date"
                                    control={control}
                                    render={({ field }) => {
                                      const { value, onChange } = field;
                                      return (
                                        <DatePickerCalendar
                                          date={date}
                                          onDateChange={setDate}
                                          month={currentMonth}
                                          onMonthChange={setCurrentMonth}
                                          minimumDate={new Date()}
                                          locale={enGB}
                                          modifiers={modifiers}
                                        />
                                      );
                                    }}
                                  />

                                  {formState?.errors?.date ? (
                                    <div className="text-xs text-red-500 absolute mt-2">
                                      {formState?.errors?.date?.message}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              {loading && <small>Loading...</small>}

                              {!loading && (
                                <div className="md:col-span-2 lg:col-span-1 flex flex-col">
                                  <label className="block text-sm font-medium transition-colors text-gray-700 mb-2">
                                    Available Slots
                                  </label>

                                  <div className="flex flex-wrap">
                                    {timeSlotLoader && (
                                      <div className="absolute w-full h-full flex justify-between items-center z-10 bg-mobile-grey-50 bg-opacity-20">
                                        <Loader />
                                      </div>
                                    )}
                                    {timeSlot?.length > 0
                                      ? timeSlot?.map((slot) => {
                                          return (
                                            <SlotButton
                                              value={slot}
                                              key={slot.id}
                                              onClick={() =>
                                                setSelectedSlot(slot)
                                              }
                                              isSelected={
                                                slot.id === selectedSlot?.id
                                              }
                                            />
                                          );
                                        })
                                      : "No slots are available"}
                                  </div>
                                </div>
                              )}
                            </div>
                          </Disclosure.Panel>
                        </Transition>
                      </>
                    </Disclosure>
                  )}
                  <Disclosure as="div" className="mt-2">
                    <>
                      <Disclosure.Button
                        className={`${
                          checkDisclosure("disclosure-paymentInfo")
                            ? "bg-[#62B144] text-white"
                            : "bg-gray-100 text-gray-600"
                        } flex items-center  hover:text-white w-full justify-between rounded-lg px-4 py-3 text-left text-lg font-medium hover:bg-[#529638] focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}
                        aria-expanded={checkDisclosure(
                          "disclosure-paymentInfo"
                        )}
                        onClick={() =>
                          handleDisclosureClick("disclosure-paymentInfo")
                        }
                      >
                        <span>Payment Info</span>

                        <ChevronDownIcon
                          className={`${
                            checkDisclosure("disclosure-paymentInfo")
                              ? "h-5 w-5 rotate-180 transform text-white"
                              : "h-5 w-5"
                          }`}
                        />
                      </Disclosure.Button>
                      <Transition
                        show={checkDisclosure("disclosure-paymentInfo")}
                        enter="transition duration-400 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-200 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                          <div className="xl:flex xl:items-center justify-between mr-3">
                            {patient?.squareCustomer ||
                            patient?.squareSandboxCustomer ? (
                              <>
                                <p>
                                  (OPTIONAL) Click the button to send credit
                                  card form link to the patient via SMS again.
                                </p>
                                <Button
                                  id="cc"
                                  variant="outlined"
                                  className="py-1 px-6 bg-[#757575] hover:bg-[#529638] text-white font-bold rounded relative mt-1"
                                  color="gray"
                                  loading={creditCardBtn}
                                  onClick={sendCreditCardSms}
                                >
                                  Request CC via SMS again
                                </Button>
                                <CurrencyDollarIcon className="h-10 w-10 fill-green-800" />
                              </>
                            ) : (
                              <>
                                <p>
                                  (REQUIRED !!) Click the button to send credit
                                  card form link to the patient via SMS.
                                </p>
                                <Button
                                  id="cc"
                                  variant="outlined"
                                  className="py-1 px-6 bg-[#62B144] hover:bg-[#529638] text-white font-bold rounded relative mt-1"
                                  color="gray"
                                  loading={creditCardBtn}
                                  onClick={sendCreditCardSms}
                                >
                                  Request Credit Card
                                </Button>
                                <CurrencyDollarIcon className="h-10 w-10 fill-red-800" />
                              </>
                            )}
                          </div>
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  </Disclosure>
                  <Disclosure as="div" className="mt-2">
                    <>
                      <Disclosure.Button
                        className={`${
                          checkDisclosure("disclosure-insuranceInfo")
                            ? "bg-[#62B144] text-white"
                            : "bg-gray-100 text-gray-600"
                        } flex items-center  hover:text-white w-full justify-between rounded-lg px-4 py-3 text-left text-lg font-medium hover:bg-[#529638] focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}
                        aria-expanded={checkDisclosure(
                          "disclosure-insuranceInfo"
                        )}
                        onClick={() =>
                          handleDisclosureClick("disclosure-insuranceInfo")
                        }
                      >
                        <span>
                          Insurance Info{" "}
                          <small
                            className={`${
                              checkDisclosure("disclosure-insuranceInfo")
                                ? "text-white"
                                : "text-grey-100"
                            }`}
                          >
                            {insuranceInfo?.length ? (
                              <>({insuranceInfo.length})</>
                            ) : (
                              <>(Optional)</>
                            )}
                          </small>
                        </span>

                        <ChevronDownIcon
                          className={`${
                            checkDisclosure("disclosure-insuranceInfo")
                              ? "h-5 w-5 rotate-180 transform text-white"
                              : "h-5 w-5"
                          }`}
                        />
                      </Disclosure.Button>
                      <Transition
                        show={checkDisclosure("disclosure-insuranceInfo")}
                        enter="transition duration-400 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-200 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                          <div className="xl:flex xl:items-center justify-between mr-3">
                            <p>
                              Click the button to send Insurance form link to
                              the patient via SMS.
                            </p>
                            <Button
                              variant="outlined"
                              className="py-1 px-6 bg-[#62B144] hover:bg-[#529638] text-white font-bold rounded relative mt-1"
                              color="gray"
                              loading={insuranceBtn}
                              onClick={sendInsuranceSms}
                            >
                              Send Insurance SMS
                            </Button>
                          </div>
                          <InsuranceForm
                            insuranceInfo={insuranceInfo}
                            patientId={patient?.id ?? patient?.objectId}
                          />
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  </Disclosure>
                  <Disclosure as="div" className="mt-2">
                    <>
                      <Disclosure.Button
                        className={`${
                          checkDisclosure("disclosure-notes")
                            ? "bg-[#62B144] text-white"
                            : "bg-gray-100 text-gray-600"
                        } flex items-center hover:text-white w-full justify-between rounded-lg px-4 py-3 text-left text-lg font-medium hover:bg-[#529638] focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75`}
                        aria-expanded={checkDisclosure("disclosure-notes")}
                        onClick={() =>
                          handleDisclosureClick("disclosure-notes")
                        }
                      >
                        <span>
                          Notes{" "}
                          <small
                            className={`${
                              checkDisclosure("disclosure-notes")
                                ? "text-white"
                                : "text-grey-100"
                            }`}
                          >
                            (Optional)
                          </small>{" "}
                        </span>

                        <ChevronDownIcon
                          className={`${
                            checkDisclosure("disclosure-notes")
                              ? "h-5 w-5 rotate-180 transform text-white"
                              : "h-5 w-5"
                          }`}
                        />
                      </Disclosure.Button>
                      <Transition
                        show={checkDisclosure("disclosure-notes")}
                        enter="transition duration-400 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-200 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                          <Controller
                            name="note"
                            control={control}
                            render={({ field }) => {
                              const { name, value, onChange } = field;
                              return (
                                <TextArea
                                  error={formState?.errors?.note}
                                  helperText={formState?.errors?.note?.message}
                                  name={name}
                                  id={name}
                                  placeholder="Enter note"
                                  value={value}
                                  onChange={(e) => {
                                    onChange(e.target.value);
                                    setNote(e.target.value);
                                  }}
                                  label="Note"
                                />
                              );
                            }}
                          />
                        </Disclosure.Panel>
                      </Transition>
                    </>
                    {/* )} */}
                  </Disclosure>
                </>
              )}
            </div>
          </div>
        </div>
        <FormErrors error={error} />
        <Modal
          isOpen={openApptDialog}
          homeOfficeWarning={homeOfficeWarning}
          closeModal={() => setOpenApptDialog((prev) => !prev)}
          setHomeOfficeWarning={setHomeOfficeWarning}
          onSubmit={onSubmit}
        />

        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 mt-auto border-t absolute bottom-0 left-0 w-full bg-white px-4 items-center h-16 md:h-20 md:px-6 lg:px-10">
          <Button
            type="submit"
            variant="contained"
            className="py-2 px-6 shadow-md border-gray-300 bg-[#62B144] hover:bg-[#529638] font-bold text-white rounded-full relative"
            loading={loading}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            className="py-2 px-6 bg-gray-500 shadow-md border-gray-300 hover:bg-gray-800 font-bold text-white rounded-full relative"
            color="gray"
            onClick={handleDiscard}
          >
            Discard
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateAppointment;
