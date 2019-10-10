import { createAppContainer } from 'react-navigation';
import SplashScreen from './Splash';
import { createSwitchNavigator } from 'react-navigation';

const AppNavigator = createSwitchNavigator({
  SplashScreen,
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
