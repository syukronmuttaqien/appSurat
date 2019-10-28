import { combineReducers } from 'redux';
import basicReducer from '../Reducers/basicReducer';
import userReducer from '../Reducers/userReducer';


const rootReducer = combineReducers({
  basic: basicReducer,
  user: userReducer,
});

export default rootReducer;
