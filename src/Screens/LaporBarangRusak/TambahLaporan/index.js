import React, { Component } from 'react';
import { StyleSheet, Image, Alert, ActivityIndicator, ToastAndroid, ScrollView } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { Layout, Input, List, Text, Button, Icon as EvaIcon } from 'react-native-ui-kitten';

import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Touchable } from '~/Components';
import { LaporanBarangRusak } from '~/Services/Api';

class TambahLaporan extends Component {
  static navigationOptions = {
    title: 'Tambah Laporan Barang Rusak',
  };

  constructor(props) {
    super(props);
    this.state = {
      foto: [],
      namaBarang: '',
      keterangan: '',
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

    if (!this.state.namaBarang) {
      Alert.alert('Perhatian', 'Nama Barang/Fasilitas belum di isi.');
      return false;
    }

    if (!this.state.keterangan) {
      Alert.alert('Perhatian','Keterangan belum di isi.');
      return false;
    }

    if (this.state.foto.length < 1) {
      Alert.alert('Perhatian', 'Belum ada foto yang diambil.');
      return false;
    }

    return true;
  }

  onChangeText = (namaBarang) => {
    this.setState({ namaBarang });
  };

  onChangeTextKeterangan = (keterangan) => {
    this.setState({ keterangan });
  };

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
      const { foto, namaBarang, keterangan } = this.state;
      if (this.validate()) {
        this.setState({ loading: true });
        const formData = new FormData();

        formData.append('nama_barang', namaBarang);
        formData.append('keterangan', keterangan);
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
        const response = await LaporanBarangRusak.add(formData);
        console.log({ response });
        ToastAndroid.show('Laporan berhasil di simpan.', ToastAndroid.SHORT);
        navigation.goBack();
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
            <Layout style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
              <Icon name="plus-square" size={32} color="#d0d0d0"/>
            </Layout>
          </Layout>
        </Touchable>
      );
    }

    return (
      <Layout style={styles.itemContainer}>
        <Image source={{ uri: item.path }} style={styles.image}/>
        <Touchable onPress={() => this.onRemovePress(index)}>
          <Layout style={{ padding: 4, position:'absolute', top: 0, right: 4, backgroundColor: 'transparent' }}>
            <Icon name="times" size={24} color="red"/>
          </Layout>
        </Touchable>
      </Layout>
    );
  }

  renderIcon = (style, visible) => {
    const iconName = visible ? 'arrow-ios-upward' : 'arrow-ios-downward';
    return (
      <EvaIcon {...style} name={iconName}/>
    );
  };
  //

  render() {
    const { foto, loading } = this.state;

    return (
      <ScrollView style={{ flex: 1 }}>
        <Layout style={{ flex: 1, padding: 16 }}>
          <Input
            label="Nama Barang/Fasilitas"
            labelStyle={{ color: 'black' }}
            placeholder="Nama Barang/Fasilitas"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4 }}
            textContentType="name"
            value={this.state.namaBarang}
            onChangeText={this.onChangeText}
          />
          <Input
            label="Keterangan"
            labelStyle={{ color: 'black' }}
            placeholder="Keterangan"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4 }}
            textContentType="name"
            value={this.state.keterangan}
            onChangeText={this.onChangeTextKeterangan}
          />
          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">Foto Barang/Fasilitas</Text>
          <List
            data={[...foto, 'add']}
            extraData={this.state}
            renderItem={this.renderItem}
            numColumns={3}
            style={{ backgroundColor: 'white', marginTop: 8, marginHorizontal: 4 }}
          />

          {!loading && <Button onPress={this.onSimpanPressed} style={{ marginTop: 8, marginHorizontal: 4 }} status="primary">SIMPAN</Button>}
          {loading && <ActivityIndicator color="#FF3300" size="large" style={{ marginTop: 8, marginHorizontal: 4 }} />}
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

export default connect(mapStateToProps)(TambahLaporan);
