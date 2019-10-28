import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, Alert } from 'react-native';
import { StackActions, NavigationActions} from 'react-navigation';

import { List } from 'react-native-ui-kitten';
import { connect } from 'react-redux';

import userAction from '!/userAction';

import Header from './Header';
import Item from './Item';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItem: [],
    };
  }

  static navigationOptions = {
    // title: 'Chat',
    header: null,
    headerMode: 'none',
  }

  componentDidMount() {
    this.addMenu();
  }

  // Regular Function
  addMenu = () => {
    const { navigation } = this.props;

    const menu1 = {
      icon: 'envelope',
      caption: 'Surat Masuk',
      onPress: () => navigation.navigate('SuratScreen'),
    };

    const menu2 = {
      icon: 'bus',
      caption: 'Peminjaman Bus',
      onPress: () => {},
    };

    const menu3 = {
      icon: 'box',
      caption: 'Pelaporan Barang Rusak',
      onPress: () => {},
    };

    // const menu4 = {
    //   icon: 'clipboard-list',
    //   caption: 'Laporan',
    //   onPress: () => {},
    // };

    const menu5 = {
      icon: 'sign-out-alt',
      caption: 'Log Out',
      onPress: () => this.onPressLogout(),
    };

    const menuItem = [
      menu1,
      menu2,
      menu3,
      // menu4,
      menu5,
    ];

    this.setState({ menuItem });
  };

  logout = () => {
    const { unsetUser, navigation } = this.props;

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'LoginScreen' }),
      ],
    });

    navigation.dispatch(resetAction);
    unsetUser();
  }

  onPressLogout = () => {
    Alert.alert(
      'Log Out',
      'Apakah anda yakin ingin log out?',
      [
        {
          text: 'Ya',
          onPress: () => this.logout(),
        },
        {
          text: 'Tidak',
          onPress: () => {},
        },
      ]
    );
  }
  //

  // Render Function
  renderItem = ({ item, index }) => (
    <Item caption={item.caption} icon={item.icon} index={index} onPress={item.onPress} />
  );

  render() {

    const { nama, jabatan: { nama: jabatan} } = this.props.user;
    const { menuItem } = this.state;

    return (
      <SafeAreaView style={style.container}>
        <List
          numColumns={2}
          style={{ padding: 16, backgroundColor: 'white' }}
          data={menuItem}
          renderItem={this.renderItem}
          ListHeaderComponent={<Header nama={nama} jabatan={jabatan} />}
        />
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingBottom: 0, backgroundColor: 'white' },
  spacer: { marginTop: 8 },
  spacer2: { marginTop: 16 },
});

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  unsetUser: () => dispatch(userAction.unsetUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
