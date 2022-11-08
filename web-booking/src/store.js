import React, { createContext, useReducer } from 'react';
import * as actions from './utils/actionTypes';
import moment from './utils/moment';

const initialState = {
  locations: [],
  location: null,
  selectedLocation: null,
  aptLocations: [],
  aptLocation: null,

  allReasons: [],
  reasons: [],
  reason: null,

  isNewPatient: null,
  patient: null,
  dentalInsurance: null,
  gPlace: null,

  date: moment().toDate(),
  bookingTimes: [],
  weekDays: [],
  slots: [],
  slot: null,
  allSlots: null,

  appointment: null,

  card: {
    cardNumber: null,
    expiry: null,
    cvc: null,
  },

  insurance: {
    type: null,
    dentalProvider: null,
    state: null,
    birthDate: null,
    name: null,
    ssn: null,
  },

  auth: false,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      /**
       * Locations
       */
      case actions.SET_LOCATIONS:
        return { ...state, locations: action.payload.locations };

      case actions.SET_LOCATION:
        return { ...state, location: action.payload.location };

      case actions.SET_SELECTED_LOCATION:
        return { ...state, selectedLocation: action.payload.selectedLocation };

      case actions.SET_APT_LOCATIONS:
        return { ...state, aptLocations: action.payload.aptLocations };

      case actions.SET_APT_LOCATION:
        return { ...state, aptLocation: action.payload.aptLocation };

      /**
       * Reasons
       */
      case actions.SET_REASONS:
        return { ...state, reasons: action.payload.reasons };

      case actions.SET_ALL_REASONS:
        return { ...state, allReasons: action.payload.allReasons };

      case actions.SET_REASON:
        return { ...state, reason: action.payload.reason };

      /**
       * Patient
       */
      case actions.SET_IS_NEW_PATIENT:
        return {
          ...state,
          isNewPatient: action.payload.isNewPatient,
          reason: action.payload.isNewPatient ? 'Other' : 'Teeth Cleaning',
        };

      case actions.SET_PATIENT:
        return {
          ...state,
          patient: action.payload.patient,
          // dentalInsurance: action.payload.dentalInsurance ?? null,
          gPlace: action.payload.gPlace ?? null,
        };

      /**
       * Schedule
       */
      case actions.SET_DATE:
        return {
          ...state,
          date: action.payload.date,
          weekDays: [],
          slots: [],
        };

      case actions.SET_BOOKING_TIMES:
        return { ...state, bookingTimes: action.payload.bookingTimes };

      case actions.SET_WEEK_DAYS:
        return { ...state, weekDays: action.payload.weekDays };

      case actions.SET_SLOTS:
        return { ...state, slots: action.payload.slots };

      case actions.SET_ALL_SLOTS:
        return { ...state, allSlots: action.payload.allSlots };

      case actions.SET_SLOT:
        return { ...state, slot: action.payload.slot };

      /**
       * Appointment
       */
      case actions.SET_APPOINTMENT:
        return { ...state, appointment: action.payload.appointment };

      /**
       * Card
       */
      case actions.SET_CARD:
        return { ...state, card: action.payload.card };

      /**
       * Insurance Info
       */
      case actions.SET_INSURANCE:
        return {
          ...state,
          insurance: action.payload.insurance,
        };

      /**
       * Auth
       */
      case actions.SET_AUTH:
        return {
          ...state,
          auth: true,
        };

      default:
        return { ...state };
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
