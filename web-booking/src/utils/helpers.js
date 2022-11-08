import { toast } from "react-toastify";
import Payment from "payment";
import { config } from "./config";
import moment from "./moment";
// import { skipHomeOffices, welcomeCenters } from "./thdc";

export const API_DATE_FORMAT = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";

export const isValidDate = (date) => moment(date).isValid();

export const formatDate = (val, format = "", fromFormat = null) => {
  if (!val) return "";

  return moment(val, fromFormat).format(format);
};

export const fetchDate = (val, format = "hh:mm a @ MM/DD/YYYY") => {
  if (!val) return "";
  return moment(val, API_DATE_FORMAT).format(format);
};

export const notify = (msg, type = "success") =>
  toast[type](msg, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const removeDuplicate = (list, key = "start") => {
  const result = [];
  const map = new Map();

  for (const item of list) {
    if (!map.has(item[key])) {
      map.set(item[key], true); // set any value to Map

      result.push({ ...item });
    }
  }

  return result;
};

export const localToUTC = (val, format = "") =>
  moment(val).utc().format(format);

export const utcToLocal = (val, format = "") => moment(val).format(format);

export const fetchPreviousDay = (val) =>
  moment(val, "dddd").subtract(1, "day").format("dddd").toUpperCase();

// fetch selected resaon specific times
export const fetchReasonTimes = (
  times = [],
  locID,
  allReasons = [],
  reason
) => {
  let availableTimes = [];

  times.forEach((t) => {
    // find id of selected reason with location
    let f1 = allReasons.find(
      (ar) => ar.reason === reason && ar.location.id === locID
    );

    if (f1) {
      let found = t.appointmentReasons.find((ar) => ar.id === f1.id);

      if (t.bookOnline && found) {
        availableTimes.push({
          start: utcToLocal(t.start, "hh:mm a"),
          end: utcToLocal(t.end, "hh:mm a"),
          title: utcToLocal(t.start, "hh:mm a"),
          operatory: t.operatory,
          providers: t.providers,
          day: t.dayOfWeek ? t.dayOfWeek : "SUNDAY",
          bookOnline: t.bookOnline,
          id: t.id,
        });
      }
    }
  });

  return availableTimes;
};

export const fetchWeekDays = (times) => {
  let weekDays = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };

  times.forEach((at) => {
    if (weekDays[fetchPreviousDay(at.day)])
      weekDays[fetchPreviousDay(at.day)].push(at);
  });

  return weekDays;
};

export const fetchEventTimes = (times, date) => {
  let slots = [];

  times.forEach((time) => {
    let day = moment(date).format("YYYY-MM-DD");
    let start = moment(`${day} ${time.start}`, "YYYY-MM-DD hh:mm a");
    let end = moment(`${day} ${time.end}`, "YYYY-MM-DD hh:mm a");

    let str = start.format();

    slots.push({
      id: time.id,
      title: start.format("hh:mm a"),
      start: str,
      end: end.format(),
      operatory: time.operatory,
      provider: time.providers[0],
      day: moment(date).format("dddd"),
      day2: day,
    });
  });

  return slots;
};

export const cleanAvailableSlots = (ts, booked) => {
  let times = ts.map((t) => {
    const isBooked = !booked.every((item) => {
      if (utcToLocal(item.start) >= t.end || utcToLocal(item.end) <= t.start)
        return true;

      if (t.operatory.id == item.operatory.id) return false;

      return true;
    });

    return { ...t, isBooked };
  });

  return times.filter((t) => !t.isBooked);
};

export const filterAvailableTimes = async (times) => {
  let filteredTimes = [];

  await times.forEach((t) => {
    let f = filteredTimes.find((t2) => t2.start === t.start);
    if (!f) filteredTimes.push(t);
  });

  return filteredTimes;
};

export const filterPreviousTimes = async (times) => {
  let newTimes = [];

  await times.forEach((item, index) => {
    let m = moment(item.start).utc().format("MM");
    let d = moment(item.start).utc().format("DD");
    let y = moment(item.start).utc().format("YYYY");
    let t = moment(item.start).utc().format("H:mm");

    if (moment(`${m}-${d}-${y} ${t}`, "MM-DD-YYYY H:m") > moment()) {
      newTimes.push(item);
    }
  });

  return newTimes;
};

export const sortAvailableSlots = (times) => {
  return times.sort((a, b) => moment(a.start) - moment(b.start));
};

export const getLocationId = ({ isNewPatient, aptLocation, location }) => {
  return isNewPatient
    ? aptLocation
      ? aptLocation.id
      : null
    : location
    ? location.id
    : null;
};

export const getLocationName = ({ isNewPatient, aptLocation, location }) => {
  return isNewPatient
    ? aptLocation
      ? aptLocation.name
      : null
    : location
    ? location.name
    : null;
};

export const getAptText = ({ slot, selectedLocation: location }) => {
  return slot && location
    ? `${formatDate(slot.date, "dddd, MMMM DD")}, at ${formatDate(
        slot.start,
        "h:mm a",
        "HH:mm"
      )} at our ${getLocationName({
        location,
      })} location.`
    : "";
};

export const getLocText = ({
  isNewPatient,
  selectedLocation: location,
  aptLocation,
}) => {
  // if (isNewPatient) return aptLocation ? getFullLocAddress(aptLocation) : '';

  return location ? getFullLocAddress(location) : "";
};

export const getFullLocAddress = (loc) => {
  let address = "";

  if (loc.address1) address += loc.address1;
  if (loc.address2) address += `, ${loc.address2}`;
  if (loc.city) address += `, ${loc.city}`;
  if (loc.state) address += ` ${loc.state}`;
  if (loc.postalCode) address += `-${loc.postalCode}`;

  return `${address}.`;
};

export const fetchTodayTimes = (times, date) => {
  let newTimes = [];

  times.forEach((at) => {
    if (moment(date).format("dddd").toUpperCase() === fetchPreviousDay(at.day))
      newTimes.push(at);
  });

  return newTimes;
};

export const formatPhoneNumber = (phone_number) => {
  if (!phone_number) return "";
  var x = phone_number.replace(/\D/g, "").match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

  return (phone_number = !x[2]
    ? x[1]
    : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : ""));
};

export const cleanPhoneNumber = (phone_number) => {
  return phone_number
    .replace("(", "")
    .replace(")", "")
    .replace(" ", "")
    .replace("-", "");
};
export const removeTotalHeathCareName = (name) => {
  if (!name) return;
  return name.replace("Total Health Dental Care ", "");
};

export const formatDOB = (dob) => {
  var x = dob.replace(/\D/g, "").match(/(\d{0,2})(\d{0,2})(\d{0,4})/);

  return (dob = !x[2] ? x[1] : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : ""));
};

export const formatSSN = (ssn) => {
  var x = ssn.replace(/\D/g, "").match(/(\d{0,3})(\d{0,2})(\d{0,4})/);

  return (ssn = !x[2]
    ? x[1]
    : "" + x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : ""));
};

export const notifyErrors = (errors) => {
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      notify(error.description, "error");
    });
  }

  if (typeof errors === "object") {
    for (const [key, value] of Object.entries(errors)) {
      if (Array.isArray(value)) value.forEach((v) => notify(v, "error"));
    }
  }
};

export const getFormattedLocationName = (location) => {
  if (!location || !location.name) return "";

  return location.name
    .replace("Total Health Dental Care ", "")
    .replace("DR. H. & CO.", "")
    .replace("Dr. H. & Co.", "")
    .replace("DR. H & CO.", "")
    .replace("DR H & CO", "")
    .replace("DR.H & CO", "")
    .replace("Dr. H. & CO.", "")
    .trim();
};

export const getLocations = (locations) => {
  if (process.env.REACT_APP_BRAND === "thdc") {
    return locations
      .map((loc) => ({
        ...loc,
        name: getFormattedLocationName(loc),
      }))
      .filter(
        (loc) =>
          !config.app.skipHomeOffices.includes(loc.name) && !loc.is_remote
      );
  }

  if (process.env.REACT_APP_BRAND === "drhco") {
    return locations
      .map((loc) => {
        return {
          ...loc,
          name: getFormattedLocationName(loc),
        };
      })
      .filter((l) => config.app.welcomeCenters.includes(l.name));
  }
};

export const getAptLocations = (locations) => {
  return locations
    .map((loc) => {
      return {
        ...loc,
        name: getFormattedLocationName(loc),
      };
    })
    .filter((l) => config.app.welcomeCenters.includes(l.name));
};

export const getAttemptPatientLogData = (state) => {
  let { patient, isNewPatient } = state;
  let {
    firstName: first_name,
    lastName: last_name,
    emailAddress: email,
    phones: [{ number: phone }],
  } = patient;

  return {
    first_name,
    last_name,
    email,
    phone,
    origin: "WEB",
    brand: config.app.insuranceBrand,
    type: isNewPatient ? "NEW" : "EXISTING",
  };
};

export const getSuccessPatientLogData = (state) => {
  let { appointment, patient, isNewPatient } = state;
  let {
    id: appointment_id,
    uid: appointment_uid,
    location_model: location,
    reason,
    start,
  } = appointment;
  let {
    firstName: first_name,
    lastName: last_name,
    emailAddress: email,
    phones: [{ number: phone }],
  } = patient;

  return {
    origin: "WEB",
    brand: config.app.insuranceBrand,
    type: isNewPatient ? "NEW" : "EXISTING",

    first_name,
    last_name,
    email,
    phone,

    appointment_id,
    appointment_uid,
    location: getFormattedLocationName(location),
    reason,
    date: formatDate(start, "MMMM D, YYYY"),
    time: formatDate(start, "hh:mm a"),
  };
};

export const getCreditFailsPatientLogData = (state, patient = null) => {
  let {
    isNewPatient,
    selectedLocation: location,
    reason,
    slot: { start },
    date,
  } = state;

  let {
    firstName: first_name,
    lastName: last_name,
    emailAddress: email,
    phones: [{ number: phone }],
  } = patient ?? state.patient;

  return {
    origin: "WEB",
    brand: config.app.insuranceBrand,
    type: isNewPatient ? "NEW" : "EXISTING",

    first_name,
    last_name,
    email,
    phone,

    location: getFormattedLocationName(location),
    reason,
    date: formatDate(date, "MMMM D, YYYY"),
    time: formatDate(start, "hh:mm a", "hh:mm"),
  };
};

export const getWeekDates = (isNext = false) => {
  let currentDate = moment();

  let weekStart = currentDate
    .clone()
    .add(isNext ? 1 : 0, "weeks")
    .startOf("week");

  let days = [];

  for (let i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, "days").format("YYYY-MM-DD"));
  }

  return days;
};

function clearNumber(value = "") {
  return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`;
      break;
    case "dinersclub":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;
      break;
  }

  return nextValue.trim();
}

export function formatCVC(value, prevValue, allValues = {}) {
  const clearValue = clearNumber(value);
  let maxLength = 4;

  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "amex" ? 4 : 3;
  }

  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}
