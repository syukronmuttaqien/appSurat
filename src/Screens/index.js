import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Register All Screens Here
import SplashScreen from './Splash';
import LoginScreen from './Login';
import HomeScreen from './Home';
import SuratScreen from './Surat';
import TambahSuratScreen from './Surat/TambahSurat';
import DetailSuratScreen from './Surat/DetailSurat';
import DisposisiSuratScreen from './Surat/DisposisiSurat';
//


const HomeStack = createStackNavigator(
  {
    SplashScreen,
    LoginScreen,
    HomeScreen,
    SuratScreen,
    TambahSuratScreen,
    DetailSuratScreen,
    DisposisiSuratScreen,
  },
  {
    initialRouteName: 'SplashScreen',
    headerMode: 'screen',
  }
);

const AppContainer = createAppContainer(HomeStack);

export default AppContainer;
