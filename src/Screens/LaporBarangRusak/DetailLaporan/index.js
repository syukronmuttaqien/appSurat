import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Layout, Text, Button } from 'react-native-ui-kitten';
import { connect } from 'react-redux';

import { LaporanBarangRusak } from '~/Services/Api';

class DetailLaporan extends Component {
  static navigationOptions = {
    title: 'Detail Laporan Barang Rusak',
  };

  constructor(props) {
    super(props);
    this.state = {
      pelapor: '',
      namaBarang: '',
      foto: [],
      keterangan: '',
      loading: false,
    };
  }

  // Base Function
  componentDidMount() {
    this.getDetail();
  }
  //

  // API
  getDetail = async () => {
    const { navigation } = this.props;
    const id = navigation.getParam('id');

    try {
      this.setState({ loading: true });
      const response = await LaporanBarangRusak.getById(id);
      const { data } = response.data;

      const { foto, nama_barang: namaBarang, keterangan, user: { nama: pelapor } } = data;

      this.setState({ foto, namaBarang, keterangan, pelapor });

    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loading: false });
    }
  }

  updateStatus = async () => {
    const { navigation } = this.props;
    const id = navigation.getParam('id');

    try {
      this.setState({ loading: true });
      const response = await LaporanBarangRusak.updateStatus(id);
      console.log({ response });
      navigation.goBack();
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loading: false });
    }
  }
  //

  // Function
  onPressSudahDiperbaiki = () => {
    Alert.alert('Perhatian', 'Anda yakin ingin mengubah status perbaikan Barang/Fasilitas?', [
      {
        text: 'Ya',
        onPress: () => this.updateStatus(),
      },
      {
        text: 'Tidak',
        onPress: () => {},
      },
    ] );
  }
  //

  // Render Function

  //

  render() {

    const { namaBarang, foto, keterangan, loading, pelapor } = this.state;

    if (loading) {
      return (
        <Layout style={styles.loading}>
          <ActivityIndicator color="#FF3300" size="large" style={{ marginHorizontal: 4 }} />
          <Text style={{ marginTop: 8 }} category="p1">Mengambil Surat..</Text>
        </Layout>
      );
    }

    return (
      <ScrollView style={styles.mainContainer}>
        <Layout style={styles.container} level="2">
          <Layout style={styles.body}>
            <Text category="h5" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>Pelapor: </Text>
            <Text category="p1" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{pelapor}</Text>
            <Text category="h5" style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8}}>Nama Barang: </Text>
            <Text category="p1" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{namaBarang}</Text>
            <Text category="h5" style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>Keterangan:</Text>
            <Text category="p1" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{keterangan}</Text>
            <Text category="s1" style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>Foto Barang/Fasilitas:</Text>
            { foto.map((val, index) => {
                return (
                  <Layout key={index.toString()}>
                    <Image style={styles.image} source={{ uri: `http://${val.foto}` }} />
                  </Layout>
                );
              })
            }
            <Button style={{ marginTop: 16 }} onPress={this.onPressSudahDiperbaiki} status="primary">BARANG TELAH DIPERBAIKI</Button>
          </Layout>
        </Layout>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: 'white' },
  container: { padding: 8, flex: 1, backgroundColor: 'white' },
  header: { padding: 8, flex: 1, flexDirection: 'column', backgroundColor: 'white', borderRadius: 4, elevation: 4 },
  body: { padding: 8, flex: 0, flexDirection: 'column', backgroundColor: 'white', borderRadius: 4, elevation: 4, marginTop: 0 },
  footer: { padding: 8, flex: 0, flexDirection: 'column', backgroundColor: 'white', borderRadius: 4, elevation: 4, marginTop: 16 },
  image: { flex: 0, width: '100%', height: 500, marginTop: 8, resizeMode: 'cover' },
  loading: { flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
});


const mapStateToProps = state =>({
  user: state.user,
});

export default connect(mapStateToProps, null)(DetailLaporan);
