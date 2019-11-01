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
  'color-primary-100': '#FFE5CC',
  'color-primary-200': '#FFC499',
  'color-primary-300': '#FF9B66',
  'color-primary-400': '#FF743F',
  'color-primary-500': '#FF3300',
  'color-primary-600': '#DB1B00',
  'color-primary-700': '#B70900',
  'color-primary-800': '#930003',
  'color-primary-900': '#7A000B',
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
