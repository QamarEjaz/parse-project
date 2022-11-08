import { createSelector } from 'reselect';

const selectLoginDomain = (state) => state['Auth'];

export const makeSelectAuthToken = () =>
  createSelector(selectLoginDomain, (globalState) => globalState.token);