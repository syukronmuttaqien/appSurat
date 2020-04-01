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
// import messaging from '@react-native-firebase';
import AppContainer from '~/Screens';
import NotifService, { registerAppWithFCM, requestPermission } from '~/Services/NotifService';
import Api from './src/Services/Api';

// Initialize Function Before App Start
Api.initialize();
useScreens();
registerAppWithFCM();
requestPermission();
//

const theme = {
  ...lightTheme,
  'color-primary-100': '#FFF5D6',
  'color-primary-200': '#FFE9AD',
  'color-primary-300': '#FFDA84',
  'color-primary-400': '#FFCB66',
  'color-primary-500': '#FFB233',
  'color-primary-600': '#DB8F25',
  'color-primary-700': '#B76F19',
  'color-primary-800': '#935310',
  'color-primary-900': '#7A3E09',
};

const App: () => React$Node = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider mapping={mapping} theme={theme}>
            <AppContainer />
            <NotifService />
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
