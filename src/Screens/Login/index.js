import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, Alert } from 'react-native';
import { Input, Layout, Text, Icon, Button, Spinner } from 'react-native-ui-kitten';
import { User } from '~/Services/Api';
import user from '!/userAction';

// Resource (Image .etc)
import logo from '$/Images/logo.png';

class Login extends Component {

  static navigationOptions = {
    // title: 'Chat',
    header: null,
    headerMode: 'none',
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      secureTextEntry: true,
      fetching: false,
    };

    this.inputRef = {
      username: null,
      password: null,
    };
  }

  // Default Function
    // Like componentDidMount() {}
  //

  // Function
  onIconPress = () => {
    const secureTextEntry = !this.state.secureTextEntry;
    this.setState({ secureTextEntry });
  };

  onInputUsernameChange = (username) => {
    this.setState({ username });
  };

  onInputPasswordChange = (password) => {
    this.setState({ password });
  };

  onPressLogin = () => {
    const { username, password } = this.state;
    this.doLogin(username,password);
  }

  doLogin = async (username, password) => {
    try {
      this.setState({ fetching: true });
      const response = await User.login(username, password);

      const { msg, data, status } = response.data;
      const { setUser, navigation } = this.props;

      if (status === 0) {
        Alert.alert('Login gagal', msg);
        return;
      }
      setUser(data);
      navigation.replace('HomeScreen');
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ fetching: false });
    }
  }
  //

  // Render Function
  renderIcon = (style) => {
    const iconName = this.state.secureTextEntry ? 'eye' : 'eye-off';
    return (
      <Icon {...style} name={iconName} />
    );
  };
  //

  render() {

    const { fetching } = this.state;

    if (fetching) {
      return (
        <Layout style={style.container}>
          <Spinner />
          <Text style={style.spacer} category="p1">Mohon Tunggu..</Text>
        </Layout>
      );
    }

    return (
      <Layout style={style.container} level="2">

        <Image
          resizeMode="contain"
          style={style.image}
          source={logo}
        />

        <Layout style={[style.loginContainer, style.spacer2]} level="1">
          <Text category="h5">Login</Text>
          <Input
            ref={ref => { this.inputRef.username = ref; }}
            returnKeyType="next"
            value={this.state.username}
            onChangeText={this.onInputUsernameChange}
            onSubmitEditing={() => this.inputRef.password.focus()}
            label="Username"
            style={style.spacer2} />
          <Input
            ref={ref => { this.inputRef.password = ref; }}
            returnKeyType="done"
            value={this.state.inputValue}
            icon={this.renderIcon}
            secureTextEntry={this.state.secureTextEntry}
            onIconPress={this.onIconPress}
            onChangeText={this.onInputPasswordChange}
            blurOnSubmit={true}
            label="Password"
            style={style.spacer}/>
          <Button
            style={style.spacer2}
            onPress={this.onPressLogin}>
              LOGIN
          </Button>
        </Layout>
      </Layout>
    );
  }
}

const style = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  loginContainer: {
    flex: 0,
    padding: 16,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowColor:'black',
    shadowOpacity: 0.2,
    minWidth: '85%',
  },
  image: { height: 150 },
  spacer: { marginTop: 8 },
  spacer2: { marginTop: 16 },
});

const mapDispatchToProps = dispatch => ({
  setUser: (data) => dispatch(user.setUser(data)),
});

export default connect(null, mapDispatchToProps)(Login);
