import produce from 'immer';

const initialState = {
  phoneNo: null,
};

const Auth = produce((state, action) => {
  switch (action.type) {
  default:
    break;
  }
}, initialState);

export default Auth;
