import Login from '../pages/auth/login';
import Signup from '../pages/auth/register';
import Reset from '../pages/auth/reset';
import Forgot from '../pages/auth/forgot';
import Home from '../pages/home';
import Schedule from '../pages/schedule';
import PeopleManagement from '../pages/people-management';
import Virtuals from '../pages/virtuals';
import VirtualsList from '../pages/virtuals-list';
import InvalidRoute from '../pages/page404';

export const INVALIDROUTE = '/InvalidRoute';
export const LOGIN_URL = '/crm';
export const SIGNUP_URL = '/register';
export const RESET_PASSWORD_URL = '/reset';
export const FORGOT_PASSWORD_URL = '/forgot';
export const HOME = '/';
export const SCHEDULE = '/schedule';
export const PEOPLE_MANAGEMENT_URL = '/people-management';
export const VIRTUAL_URL = '/virtuals';
export const VIRTUAL_PLAYER_URL = '/virtuals/:id';

export const URLS = [
  {
    path: LOGIN_URL,
    isPublic: true,
    component: Login,
    isHideContainer: false,
  },
  {
    path: SIGNUP_URL,
    isPublic: true,
    component: Signup,
    isHideContainer: true,
  },
  { path: RESET_PASSWORD_URL, isPublic: true, component: Reset },
  { path: FORGOT_PASSWORD_URL, isPublic: true, component: Forgot },
  { path: HOME, isPublic: false, component: Home },
  { path: SCHEDULE, isPublic: false, component: Schedule },
  {
    path: PEOPLE_MANAGEMENT_URL,
    isPublic: false,
    component: PeopleManagement,
    isHideContainer: false,
  },
  {
    path: VIRTUAL_URL,
    isPublic: false,
    component: VirtualsList,
    isHideContainer: false,
  },
  {
    path: VIRTUAL_PLAYER_URL,
    isPublic: false,
    component: Virtuals,
    isHideContainer: false,
  },
  { isPublic: true, path: '*', component: InvalidRoute },
];
