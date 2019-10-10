import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import persistedReducer from './Persist';

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };


