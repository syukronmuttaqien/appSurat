import Type from '../Type';

const INITIAL_STATE = {
  isWorking: 'working',
};

const basicReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case (Type.IS_REDUX_WORKING):
      return {...state, isWorking: true };
    default:
      return state;
  }
};

export default basicReducer;
