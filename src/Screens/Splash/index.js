import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Avatar } from 'react-native-ui-kitten';
import logo from '$/Images/mail.png';

class Splash extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Layout style={style.container}>
        <Avatar source={logo} shape="square" size="giant" />
        <Text category="h2" style={style.text}>Aplikasi Pendataan Surat Masuk</Text>
      </Layout>
    );
  }

}

const style = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  text: { textAlign: 'center', marginTop: 8 },
});

export default Splash;
