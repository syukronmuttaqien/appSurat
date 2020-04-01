import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Layout, Text } from 'react-native-ui-kitten';
import { VERSION_PERSIST } from '~/Redux/Persist/config';

import { subscribeToTopic } from '~/Services/NotifService';
import userAction from '!/userAction';
import logo from '$/Images/logo.png';

class Splash extends Component {
  static navigationOptions = {
    // title: 'Chat',
    header: null,
    headerMode: 'none',
  };

  constructor(props) {
    super(props);

    this.state = {};
    this.messageListener = null;
  }

  CheckPersistVersion = async () => {
    const { unsetUser, user } = this.props;

    console.log({ user });
    const localVersion = await AsyncStorage.getItem('REDUCER_VERSION');

    if (localVersion !== VERSION_PERSIST) {
      unsetUser();
    }

    await AsyncStorage.setItem('REDUCER_VERSION', VERSION_PERSIST);

    this.setState({ loading: false });

    this.countDown();
  };

  componentDidMount() {
    this.CheckPersistVersion();
  }

  countDown = () => {
    const { user } = this.props;

    setInterval(() => {
      const { navigation } = this.props;

      if (!user.isLoggedIn) {
        return navigation.replace('LoginScreen');
      }

      // subscribeToTopic(user.jabatan_id);
      return navigation.replace('HomeScreen');
    }, 2500);
  };

  render() {
    return (
      <Layout style={style.container}>
        <Image style={{ height: 150 }} resizeMode="contain" source={logo} />
        <Text category="h2" style={style.text}>
          SIADUM JAK 3
        </Text>
      </Layout>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { textAlign: 'center', marginTop: 8 },
});

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  unsetUser: () => dispatch(userAction.unsetUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
