import { createSelector } from 'reselect';

const selectLoginDomain = (state: any) => state['Auth'];

export const makeSelectAuthToken = () =>
  createSelector(selectLoginDomain, (globalState) => globalState.token);
