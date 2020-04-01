import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// In Case Want To Rehydrate
const VERSION_PERSIST = '1.0';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['user'], // only navigation will be persisted
};

export default persistConfig;
export { VERSION_PERSIST };
