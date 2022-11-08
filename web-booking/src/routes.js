import Phone from './pages/phone';
import Verify from './pages/verify';
import Patients from './pages/patients';
import Location from './pages/location';
import CurrentLocation from './pages/current-location';
import ChooseDate from './pages/choose-date';
import Notes from './pages/notes';
import Details from './pages/details';
import Reserve from './pages/reserve';
import Confirmation from './pages/confirmation';
import Insurance from './pages/insurance';
import AddNewFamilyMember from './pages/AddNewFamilyMember';

const routes = {
  insurance: {
    path: '/insurance',
    component: Insurance,
    isPublic: true,
  },
  confirmation: {
    path: '/confirmation',
    component: Confirmation,
    isPublic: true,
  },
  reserve: {
    path: '/reserve',
    component: Reserve,
    isPublic: true,
  },
  details: {
    path: '/details',
    component: Details,
    isPublic: true,
  },
  notes: {
    path: '/notes',
    component: Notes,
    isPublic: true,
  },
  "choose-date": {
    path: '/choose-date',
    component: ChooseDate,
    isPublic: true,
  },
  currentlocation: {
    path: '/current-location',
    component: CurrentLocation,
    isPublic: true,
  },
  location: {
    path: '/location',
    component: Location,
    isPublic: true,
  },
  patients: {
    path: '/patients',
    component: Patients,
    isPublic: true,
  },
  addNewFamilyMember: {
    path: '/addNewFamilyMember',
    component: AddNewFamilyMember,
    isPublic: true,
  },
  phone: {
    path: '/',
    component: Phone,
    isPublic: false,
  }
};

export default routes;
