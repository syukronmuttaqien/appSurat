import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import { Layout, Text, Button } from 'react-native-ui-kitten';
import { connect } from 'react-redux';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import moment from 'moment';

import { Surat } from '~/Services/Api';
import { Loader } from '~/Components';

class DetailSurat extends Component {
  static navigationOptions = {
    title: 'Isi Surat',
  };

  constructor(props) {
    super(props);
    this.state = {
      nomor: '',
      kode: '',
      asal: '',
      title: '',
      noAgenda: '',
      sifatSurat: '',
      tglSurat: null,
      tglJamAgenda: null,
      foto: [],
      tujuan: [],
      dokumen: null,
      jabatanSudahDisposisi: [],
      loading: false,
      jenis_surat_id: 0,
      status_surat: '',
      hasCatatan: false,
      loadingLampiran: false,
      loadingUpdate: false,
    };
  }

  // Base Function
  componentDidMount() {
    this.getDetail();
  }
  //

  // API
  getDetail = async () => {
    const { navigation, user } = this.props;
    const id = navigation.getParam('id');

    try {
      this.setState({ loading: true });
      const response = await Surat.getById(id, user.jabatan_id);
      const { data } = response.data;

      const {
        nomor_surat: nomor,
        kode_surat: kode,
        asal_surat: asal,
        foto,
        tujuan,
        perihal: title,
        dokumen,
        jenis_surat_id,
        jabatan_sudah_disposisi,
        status_surat,
        tgl_jam_agenda,
        sifat_surat,
        tgl_surat,
        no_agenda_surat,
      } = data;
      const catatans = tujuan.filter(
        val => val.catatan !== null && val.catatan !== '',
      );

      this.setState({
        nomor,
        kode,
        asal,
        foto,
        tujuan,
        title,
        jenis_surat_id,
        hasCatatan: catatans.length > 0,
        status_surat,
        dokumen,
        jabatanSudahDisposisi: jabatan_sudah_disposisi,
        tglJamAgenda: tgl_jam_agenda,
        sifatSurat: sifat_surat,
        tglSurat: tgl_surat,
        noAgenda: no_agenda_surat,
      });
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loading: false });
    }
  };

  updateSurat = async () => {
    try {
      this.setState({ loadingUpdate: true });
      const { navigation } = this.props;
      const id = navigation.getParam('id');
      await Surat.updateSelesai(id);
      ToastAndroid.show('Status surat berhasil di update.', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loadingUpdate: false });
    }
  };
  //

  // Function
  onPressDisposisi = () => {
    const { navigation, user } = this.props;
    const { tujuan, jenis_surat_id } = this.state;
    const id = navigation.getParam('id');
    const jabatan_id = tujuan.map(val => val.jabatan.id);
    jabatan_id.push(user.jabatan_id);
    navigation.navigate('DisposisiSuratScreen', {
      id,
      jabatan_id,
      jenis_surat_id,
    });
  };

  onPressLihatLampiran = () => {
    this.setState({ loadingLampiran: true });
    const { dokumen, title } = this.state;

    const url = `http://${dokumen}`;
    const path = dokumen.split('.');
    const ext = path[path.length - 1];

    const localFile = `${RNFS.DocumentDirectoryPath}/${title}.${ext}`;

    console.log({ localFile });

    const options = {
      fromUrl: url,
      toFile: localFile,
    };

    RNFS.downloadFile(options)
      .promise.then(() => {
        this.setState({ loadingLampiran: false });
        FileViewer.open(localFile);
      })
      .then(() => {
        this.setState({ loadingLampiran: false });
        // success
      })
      .catch(error => {
        // error
        this.setState({ loadingLampiran: false });
        console.log({ error });
      });
  };

  onPressSelesai = () => {
    Alert.alert('Perhatian', 'Apakah anda yakin surat tugas telah dicetak?', [
      {
        text: 'Tidak',
        onPress: () => { },
      },
      {
        text: 'Ya',
        onPress: () => {
          this.updateSurat();
        },
      },
    ]);
  };
  //

  // Render Function
  renderButtonDisposisi = (jabatan_id) => {
    const { jabatanSudahDisposisi, status_surat } = this.state;

    console.log({ jabatan_id, jabatanSudahDisposisi });

    if (jabatanSudahDisposisi.includes(jabatan_id) || status_surat === 'Selesai') {
      return null;
    }

    if (jabatan_id !== 33 && jabatan_id !== 34 && jabatan_id !== 35 && jabatan_id !== 36) {
      return (
        <Button
          style={{ marginTop: 16 }}
          onPress={this.onPressDisposisi}
          status="primary">
          DISPOSISI
        </Button>
      );
    }

    return (
      <Button
        style={{ marginTop: 16 }}
        onPress={this.onPressSelesai}
        status="primary">
        SURAT TUGAS TELAH DICETAK
      </Button>
    );
  }

  renderButtonLampiran = (dokumen) => {
    if (dokumen) {
      return (
        <Button
          style={{ marginTop: 16 }}
          onPress={this.onPressLihatLampiran}
          status="primary">
          LIHAT LAMPIRAN
        </Button>
      );
    }
    return null;
  }
  //

  render() {
    const {
      nomor,
      kode,
      asal,
      title,
      foto,
      tujuan,
      loading,
      hasCatatan,
      dokumen,
      loadingLampiran,
      loadingUpdate,
      noAgenda,
      tglJamAgenda,
      tglSurat,
      sifatSurat,
    } = this.state;

    const {
      user: { jabatan_id },
    } = this.props;

    if (loading) {
      return (
        <Layout style={styles.loading}>
          <ActivityIndicator
            color="#FFB233"
            size="large"
            style={{ marginHorizontal: 4 }}
          />
          <Text style={{ marginTop: 8 }} category="p1">
            Mengambil Surat..
          </Text>
        </Layout>
      );
    }

    let noCatatan = 0;

    return (
      <Layout style={styles.mainContainer} level="3">
        <ScrollView style={styles.mainContainer}>
          <Layout style={styles.container} level="2">
            <Layout style={styles.body}>
              <Text
                category="h6"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                Perihal:
              </Text>
              <Text
                category="p1"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {title}
              </Text>
              <Text
                category="h6"
                style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
                Asal Surat:
              </Text>
              <Text
                category="p1"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {asal}
              </Text>
              <Text
                category="h6"
                style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
                Nomor Surat:
              </Text>
              <Text
                category="p1"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {nomor ? nomor : '-'}
              </Text>
              <Text
                category="h6"
                style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
                Kode Surat:
              </Text>
              <Text
                category="p1"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {kode ? kode : '-'}
              </Text>
              <Text
                category="h6"
                style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
                No. Agenda Surat:
              </Text>
              <Text
                category="p1"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {noAgenda ? noAgenda : '-'}
              </Text>
              <Text
                category="h6"
                style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
                Sifat Surat:
              </Text>
              <Text
                category="p1"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {sifatSurat ? sifatSurat : '-'}
              </Text>
              <Text
                category="h6"
                style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
                Tgl. Surat:
              </Text>
              <Text
                category="p1"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {tglSurat ? moment(tglSurat).format('DD MMM YYYY') : '-'}
              </Text>
              <Text
                category="h6"
                style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
                Tgl. & Jam Agenda Surat:
              </Text>
              <Text
                category="p1"
                style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {tglJamAgenda ? moment(tglJamAgenda).format('DD MMM YYYY HH:mm') : '-'}
              </Text>
              <Text
                category="h6"
                style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap' }}>
                Surat ini ditujukan kepada:{' '}
              </Text>
              {tujuan.map((val, index) => {
                return (
                  <Text
                    key={index.toString()}
                    style={{
                      marginTop: index !== 0 ? 4 : 0,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}
                    category="p1">
                    {val.jabatan.nama}
                  </Text>
                );
              })}

              {hasCatatan && (
                <Text style={{ marginTop: 16 }} category="h6">
                  Catatan:{' '}
                </Text>
              )}
              {hasCatatan &&
                tujuan.map((val, index) => {
                  if (val.catatan) {
                    noCatatan++;
                    return (
                      <Text
                        key={index.toString()}
                        style={{
                          marginTop: 8,
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                        category="p1">
                        {noCatatan}. {val.catatan}
                      </Text>
                    );
                  }
                })}

              {foto.length > 0 && (
                <Text
                  category="s1"
                  style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap' }}>
                  Foto Surat:{' '}
                </Text>
              )}
              {foto.map((val, index) => {
                return (
                  <Layout key={index.toString()}>
                    <Image
                      style={styles.image}
                      source={{ uri: `http://${val.foto}` }}
                    />
                  </Layout>
                );
              })}
              {this.renderButtonLampiran(dokumen)}
              {this.renderButtonDisposisi(jabatan_id)}
            </Layout>
          </Layout>
        </ScrollView>
        {loadingLampiran && <Loader message="Memproses Lampiran..." />}
        {loadingUpdate && <Loader message="Memproses Surat..." />}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: 'white' },
  container: { padding: 8, flex: 1, backgroundColor: 'white' },
  header: {
    padding: 8,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 4,
  },
  body: {
    padding: 8,
    flex: 0,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 4,
    marginTop: 0,
  },
  footer: {
    padding: 8,
    flex: 0,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 4,
    marginTop: 16,
  },
  image: {
    flex: 0,
    width: '100%',
    height: 500,
    marginTop: 8,
    resizeMode: 'cover',
  },
  loading: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(DetailSurat);
