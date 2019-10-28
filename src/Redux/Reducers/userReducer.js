import Type from '../Type';

const INITIAL_STATE = {
  isLoggedIn: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case (Type.SET_USER):
      return {...state, ...action.payload, isLoggedIn: true };
    case (Type.UNSET_USER):
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default userReducer;
