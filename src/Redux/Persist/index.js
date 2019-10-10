import { persistReducer } from 'redux-persist';
import persistConfig from './config';

import rootReducer from '../Reducers';

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
