/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './src/Redux/Store';
import AppContainer from '~/Screens';

const App: () => React$Node = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <AppContainer />
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
