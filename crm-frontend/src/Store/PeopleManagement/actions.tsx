import * as types from './actionTypes';

export const getAllPeople = (data: any) => {
  return {
    type: types.GET_AllPeople,
    payload: data,
  };
};

export const getAllPeopleSuccess = (data: any) => {
  return {
    type: types.GET_AllPeople_SUCCESS,
    payload: data,
  };
};
export const getPeopleSet = (data: any) => {
  return {
    type: types.GET_PeopleSet,
    payload: data,
  };
};

export const getPeopleSetSuccess = (data: any) => {
  return {
    type: types.GET_PeopleSet_SUCCESS,
    payload: data,
  };
};
export const addPeople = (data: any) => {
  return {
    type: types.ADD_People,
    payload: data,
  }
}

export const addPeopleSet = (data: any) => {
  return {
    type: types.ADD_PeopleSet,
    payload: data,
  }
}