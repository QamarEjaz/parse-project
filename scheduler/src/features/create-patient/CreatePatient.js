import React, { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import moment from "moment";
import Button from "../../components/Form/Button";
import Radio from "../../components/Form/Radio";
import { Select } from "../../components/Form/Select";
import TextField from "../../components/Form/TextField";
import {
  cleanPhoneNumber,
  formatPhoneNumber,
  getFormErrors,
  validateEmail,
} from "../../utils/helpers";
import { registerPatient } from "../../Store/Patient/actions";
import { useDispatch, useSelector } from "react-redux";
import FormErrors from "../../components/Form/FormErrors";
import GPlace from "../../components/Form/GPlace";
import { locationGeo } from "../../utils/mapLocations";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import { getLocation } from "../../Store/Location/actions";
import { parseConfig } from "../../utils/ParseConfig";

const CreatePatient = ({
  className,
  initializeLiveQueryOnPatient,
  mapRef,
  selectedLocation,
  setAddressMarker,
  setIsChangedForm,
  setPatient,
  setSelectedLocation,
  setShowCreatePatientComponent
}) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [checkLocation, setCheckLocation] = useState("");
  const [yesterdayDay, setYesterdayDay] = useState();
  const placeInputRef = useRef(null);
  
  const dispatch = useDispatch();

  const {
    handleSubmit,
    getValues,
    watch,
    control,
    setValue,
    reset,
    clearErrors,
    setError: setFormError,
    formState,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNumber: "",
      address1: "",
      city: "",
      gender: "",
      postalCode: "",
      location: { id: 1, value: null, name: "Select" },
      state: "",
    },
  });

  let locations = useSelector((state) => state?.Location?.locations);

  const resetFields = () => {
    reset({
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNumber: "",
      address1: "",
      city: "",
      gender: "",
      postalCode: "",
      state: "",
      location: selectedLocation?.objectId
        ? {
            id: selectedLocation?.objectId,
            value: selectedLocation?.objectId,
            name: selectedLocation?.name,
          }
        : { id: 1, value: null, name: "Select" },
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

  const selectOptions = locations.map((location) => ({
    id: location?.objectId,
    value: location?.objectId,
    name: location?.name,
  }));

  useEffect(() => {
    if (selectedLocation?.objectId) {
      updateLocationField(selectedLocation);
    }
    //eslint-disable-next-line
  }, [selectedLocation]);

  useEffect(() => {
    setIsChangedForm(formState?.isDirty);
  }, [formState, setIsChangedForm]);

  useEffect(() => {
    parseConfig();
    getPreviousDay();
    dispatch(getLocation());
  }, [])
  
  const onSubmit = async () => {
    setError(null);
    const {
      address1,
      city,
      emailAddress,
      firstName,
      gender,
      lastName,
      location,
      postalCode,
      state
    } = getValues();
    try {
      setIsLoading(true);
      if (checkLocation?.name && !checkLocation?.formatted_address) {
        toast.error("Please add valid address");
      } else {
        if (!phoneNumber || !dateOfBirth) {
          setIsLoading(false);
          toast.error("Please fill all required fields");
        } else {
          const data = {
            firstName,
            lastName,
            emailAddress: emailAddress,
            phone: cleanPhoneNumber(phoneNumber),
            address1: address1,
            city: city,
            state: state,
            postalCode,
            gender,
            dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
            location: location?.value,
            setIsLoading: setIsLoading,
            resetFields: resetFields,
            setDateOfBirth: setDateOfBirth,
            setSelectedLocation: setSelectedLocation,
            setPhoneNumber: setPhoneNumber,
            setShowCreatePatientComponent: setShowCreatePatientComponent,
            setPatient: setPatient
          };
          await initializeLiveQueryOnPatient(data);
          dispatch(registerPatient(data));
        }
      }
      setIsLoading(false);
      // setShowCreatePatientComponent(false)
    } catch (error) {
      setIsLoading(false);
      setError(getFormErrors(error));
    }
  };

  const handleDiscard = () => {
    setError(false);
    setSelectedLocation(formState?.defaultValues?.location);
    resetFields();
    setDateOfBirth("");
    setPhoneNumber("");
    placeInputRef.current.value = null;
    setAddressMarker(null)
  };

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
    setYesterdayDay(previous);
    return previous;
  }


  return (
    <form className="flex flex-col flex-1" onSubmit={handleSubmit(onSubmit)}>
      <div className={`flex-1 w-full flex flex-col ${className}`}>
        <div className="mx-auto w-full max-w-3xl w-full px-4 py-12">
          <div className="flex justify-between items-center pb-8">
            <div className="text-gray font-bold text-xl lg:text-3xl">Create Patient</div>
            <Button className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded relative" onClick={() => { setShowCreatePatientComponent(false); handleDiscard() }}>Create Appointment</Button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-6">
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: "First Name is required",
                validate: () =>
                  getValues("firstName").length > 25
                    ? "First name should be maximum 25 character long"
                    : true,
              }}
              render={({ field }) => {
                const { name, value, onChange } = field;
                return (
                  <TextField
                    error={formState?.errors?.firstName}
                    helperText={formState?.errors?.firstName?.message}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    label="First Name"
                    type="text"
                  />
                );
              }}
            />
            {/* <TextField label="First Name" type="text" /> */}
            <Controller
              name="lastName"
              control={control}
              rules={{
                required: "Last Name is required",
                validate: () =>
                  getValues("lastName").length > 25
                    ? "Last Name should be maximum 25 character long"
                    : true,
              }}
              render={({ field }) => {
                const { name, value, onChange } = field;
                return (
                  <TextField
                    error={formState?.errors?.lastName}
                    helperText={formState?.errors?.lastName?.message}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    label="Last Name"
                    type="text"
                  />
                );
              }}
            />
            <Controller
              name="emailAddress"
              control={control}
              rules={{
                required: "Email is required",
                validate: () =>
                  getValues("emailAddress").length > 60
                    ? "Email should be maximum 60 character long"
                    : !validateEmail(getValues("emailAddress"))
                    ? "Email is invalid"
                    : true,
              }}
              render={({ field }) => {
                const { name, value, onChange } = field;
                return (
                  <TextField
                    error={formState?.errors?.emailAddress}
                    helperText={formState?.errors?.emailAddress?.message}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    label="Email"
                    type="text"
                  />
                );
              }}
            />
            <TextField
              error={formState?.errors?.phoneNumber}
              helperText={formState?.errors?.phone?.message}
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              label="Phone"
              type="text"
            />
            <div>
              <label
                className={`block text-sm font-medium transition-colors mb-1`}
              >
                Date Of birth
              </label>
              <DatePicker
                maxDetail="month"
                dayPlaceholder="dd"
                monthPlaceholder="mm"
                yearPlaceholder="yyyy"
                yearAriaLabel="Year"
                format="MM/dd/yyyy"
                value={dateOfBirth}
                minDate={new Date("1900-01-01")}
                maxDate={yesterdayDay}
                onChange={(date) => setDateOfBirth(date)}
                className="py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition block w-full text-sm border border-gray-300"
              />
            </div>
            <div className="relative">
              <GPlace
                placeInputRef={placeInputRef}
                mapRef={mapRef}
                setAddressMarker={setAddressMarker}
                label="Address"
                formState={formState}
                setCheckLocation={setCheckLocation}
                setAddress={(value) => {
                  setValue("address1", value);
                }}
                setCity={(value) => {
                  setValue("city", value);
                }}
                setFormState={(value) => {
                  setValue("state", value);
                }}
                setZip={(value) => {
                  setValue("postalCode", value);
                }}
              />

              {formState.errors?.address1 ? (
                <div className="text-xs text-red-500 absolute mt-0.5">
                  {formState.errors?.address1?.message}
                </div>
              ) : null}
            </div>
            <div className="relative">
              <div
                className={`block text-sm font-medium ${
                  formState?.errors?.gender ? "text-red-500" : "text-gray-700"
                } mb-2.5`}
              >
                Gender
              </div>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Gender is required" }}
                render={({ field }) => {
                  const { value, onChange } = field;
                  return (
                    <div className="space-x-2">
                      <Radio
                        checked={value === "M"}
                        title="Male"
                        id="male"
                        name="male"
                        value="M"
                        onChange={onChange}
                      />
                      <Radio
                        checked={value === "F"}
                        title="Female"
                        id="female"
                        name="female"
                        value="F"
                        onChange={onChange}
                      />
                      <Radio
                        checked={value === "O"}
                        title="Other"
                        id="other"
                        name="other"
                        value="O"
                        onChange={onChange}
                      />
                    </div>
                  );
                }}
              />
              {formState?.errors?.gender ? (
                <div className="text-xs text-red-500 absolute mt-0.5">
                  {formState?.errors?.gender?.message}
                </div>
              ) : null}
            </div>
            <div>
              <Controller
                name="location"
                control={control}
                rules={{
                  validate: () =>
                    getValues("location")?.value ? true : "Location is required",
                }}
                render={({ field }) => {
                  const { name, value, onChange } = field;
                  return (
                    <Select
                      error={formState?.errors?.location?.type}
                      helperText={formState?.errors?.location?.message}
                      options={selectOptions}
                      label="Location"
                      name={name}
                      value={value}
                      onChange={(selected) => {
                        setSelectedLocation(
                          locations.find(
                            (loc) => loc?.objectId === selected.value
                          )
                        );

                        if (mapRef?.current) {
                          mapRef?.current?.flyTo({
                            center: locationGeo[selected.value],
                            zoom: 15,
                          });
                        }
                        onChange(selected);
                      }}
                    />
                  );
                }}
              />
            </div>
            <FormErrors error={error} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 mt-auto border-t absolute bottom-0 left-0 w-full bg-white px-4 items-center h-16 md:h-20 md:px-6 lg:px-10">
            <Button
              type="submit"
              variant="contained"
              className="py-2 px-6 shadow-md bg-[#62B144] hover:bg-[#529638] text-white font-bold rounded-full relative"
              loading={isLoading}
              // onClick={() => { setShowCreatePatientComponent(false)}}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              className="py-2 px-6 bg-gray-500 shadow-md hover:bg-gray-600 text-white font-bold rounded-full relative"
              color="gray"
              onClick={handleDiscard}
            >
              Discard
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePatient;
