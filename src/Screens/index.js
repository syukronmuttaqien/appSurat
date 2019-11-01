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
import PinjamBusScreen from './PinjamBus';
import TambahPinjamBusScreen from './PinjamBus/TambahPinjamBus';
import LaporanBarangRusakScreen from './LaporBarangRusak';
import TambahLaporanBarangRusakScreen from './LaporBarangRusak/TambahLaporan';
import DetailLaporanBarangRusakScreen from './LaporBarangRusak/DetailLaporan';
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
    PinjamBusScreen,
    TambahPinjamBusScreen,
    LaporanBarangRusakScreen,
    TambahLaporanBarangRusakScreen,
    DetailLaporanBarangRusakScreen,
  },
  {
    initialRouteName: 'SplashScreen',
    headerMode: 'screen',
  }
);

const AppContainer = createAppContainer(HomeStack);

export default AppContainer;
