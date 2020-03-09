import React, { Component } from 'react';
import { StyleSheet, Image, Alert, ActivityIndicator, ToastAndroid, ScrollView } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { Layout, List, Text, Button, Icon as EvaIcon } from 'react-native-ui-kitten';

import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Touchable } from '~/Components';
import { LaporanBarangRusak } from '~/Services/Api';

class UpdloadFoto extends Component {
  static navigationOptions = {
    title: 'Update Laporan Barang Rusak',
  };

  constructor(props) {
    super(props);
    this.state = {
      foto: [],
      loading: false,
    };
  }

  // Base Function
  componentDidMount() {
    // Nothing To Do
  }
  //

  // Function
  validate = () => {
    if (this.state.foto.length < 1) {
      Alert.alert('Perhatian', 'Belum ada foto yang diambil.');
      return false;
    }

    return true;
  }

  openCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxHeight: 2560,
      compressImageMaxWidth: 1280,
      compressImageQuality: 0.8,
    }).then(image => {
      const { foto } = this.state;
      console.log({ image });
      this.setState({ foto: [...foto, image] });
    });
  }

  onRemovePress = (itemIndex) => {
    const { foto } = this.state;
    const newFoto = foto.filter((val, index) => index !== itemIndex);
    this.setState({ foto: newFoto });
  }

  onSimpanPressed = async () => {

    try {
      const { navigation, user } = this.props;
      const id = navigation.getParam('id');
      const { foto } = this.state;
      if (this.validate()) {
        this.setState({ loading: true });
        const formData = new FormData();

        formData.append('user_id', user.id);

        foto.forEach((val, index) => {
          if (val !== 'add') {
            const name = `${moment().format('YYYYMMDDHHmmss')}`;
            const file = {
              uri: val.path,
              type: val.mime,
              name,
            };

            formData.append(`foto[${index}]`, file);
          }
        });
        const response = await LaporanBarangRusak.updateStatus(id, formData);
        console.log({ response });
        ToastAndroid.show('Laporan berhasil di update.', ToastAndroid.SHORT);
        navigation.goBack('DetailLaporanBarangSuratScreen');
      } else {
        throw new Error('There is still missing field.');
      }
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loading: false });
    }
  }
  //

  // Render Function
  renderItem = ({ item, index }) => {

    if (item === 'add') {
      return (
        <Touchable onPress={this.openCamera} >
          <Layout style={[styles.itemContainer, { borderColor: '#d0d0d0' }]} level="2">
            <Layout style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus-square" size={32} color="#d0d0d0" />
            </Layout>
          </Layout>
        </Touchable>
      );
    }

    return (
      <Layout style={styles.itemContainer}>
        <Image source={{ uri: item.path }} style={styles.image} />
        <Touchable onPress={() => this.onRemovePress(index)}>
          <Layout style={{ padding: 4, position: 'absolute', top: 0, right: 4, backgroundColor: 'transparent' }}>
            <Icon name="times" size={24} color="red" />
          </Layout>
        </Touchable>
      </Layout>
    );
  }

  renderIcon = (style, visible) => {
    const iconName = visible ? 'arrow-ios-upward' : 'arrow-ios-downward';
    return (
      <EvaIcon {...style} name={iconName} />
    );
  };
  //

  render() {
    const { foto, loading } = this.state;

    return (
      <ScrollView style={{ flex: 1 }}>
        <Layout style={{ flex: 1, padding: 16 }}>
          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">Foto Barang/Fasilitas Setelah Diperbaiki</Text>
          <List
            data={[...foto, 'add']}
            extraData={this.state}
            renderItem={this.renderItem}
            numColumns={3}
            style={{ backgroundColor: 'white', marginTop: 8, marginHorizontal: 4 }}
          />

          {!loading && <Button onPress={this.onSimpanPressed} style={{ marginTop: 8, marginHorizontal: 4 }} status="primary">UPDATE</Button>}
          {loading && <ActivityIndicator color="#FFB233" size="large" style={{ marginTop: 8, marginHorizontal: 4 }} />}
        </Layout>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: { flex: 1, maxWidth: '33%', height: 136, borderWidth: 1, borderColor: '#f0f0f0' },
  image: { flex: 1 },
  select: { backgroundColor: 'white' },

});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(UpdloadFoto);
