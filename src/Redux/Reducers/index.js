import { combineReducers } from 'redux';
import basicReducer from '../Reducers/basicReducer';


const rootReducer = combineReducers({
  basic: basicReducer,
});

export default rootReducer;
