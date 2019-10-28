/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';


import { useScreens } from 'react-native-screens';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from 'react-native-ui-kitten';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './src/Redux/Store';
import AppContainer from '~/Screens';
import Api from './src/Services/Api';
Api.initialize();
useScreens();


const theme = {
  ...lightTheme,
  'color-primary-100': '#E2FBC9', // <- new primary color
  'color-primary-200': '#BFF896',
  'color-primary-300': '#90EB5F',
  'color-primary-400': '#63D837',
  'color-primary-500': '#28BE02',
  'color-primary-600': '#16A301',
  'color-primary-700': '#088801',
  'color-primary-800': '#006E02',
  'color-primary-900': '#005B08',
};

const App: () => React$Node = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider mapping={mapping} theme={theme}>
            <AppContainer />
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
