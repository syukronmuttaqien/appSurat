import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Layout, Text, Button } from 'react-native-ui-kitten';
import { connect } from 'react-redux';

import { Surat } from '~/Services/Api';

class DetailSurat extends Component {
  static navigationOptions = {
    title: 'Isi Surat',
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      foto: [],
      tujuan: [],
      loading: false,
      hasCatatan: false,
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
      const response = await Surat.getById(id);
      const { data } = response.data;

      const { foto, tujuan, perihal: title } = data;
      const catatans = tujuan.filter(val => val.catatan !== null && val.catatan !== '');

      this.setState({ foto, tujuan, title, hasCatatan: catatans.length > 0 });

    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loading: false });
    }
  }
  //

  // Function
    onPressDisposisi = () => {
      const { navigation, user } = this.props;
      const { tujuan } = this.state;
      const id = navigation.getParam('id');
      const jabatan_id = tujuan.map(val => val.jabatan.id);
      jabatan_id.push(user.jabatan_id);
      navigation.navigate('DisposisiSuratScreen', { id, jabatan_id });
    }
  //

  // Render Function

  //

  render() {

    const { title, foto, tujuan, loading, hasCatatan } = this.state;

    if (loading) {
      return (
        <Layout style={styles.loading}>
          <ActivityIndicator color="#FF3300" size="large" style={{ marginHorizontal: 4 }} />
          <Text style={{ marginTop: 8 }} category="p1">Mengambil Surat..</Text>
        </Layout>
      );
    }

    let noCatatan = 0;

    return (
      <ScrollView style={styles.mainContainer}>
        <Layout style={styles.container} level="2">
          <Layout style={styles.body}>
            <Text category="h6" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>Perihal:</Text>
            <Text category="p1" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{title}</Text>
            <Text category="h6" style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap' }}>Surat ini ditujukan kepada: </Text>
            { tujuan.map((val, index) => {
                return (
                  <Text key={index.toString()} style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }} category="p1">{val.jabatan.nama}</Text>
                );
            })}

            { hasCatatan && <Text style={{ marginTop: 16 }} category="h6">Catatan: </Text> }
              { hasCatatan && tujuan.map((val, index) => {
                  if (val.catatan) {
                    noCatatan++;
                    return (
                      <Text key={index.toString()} style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap' }} category="p1">{noCatatan}. {val.catatan}</Text>
                    );
                  }
              })}


            <Text category="s1" style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap' }}>Foto Surat: </Text>
            { foto.map((val, index) => {
                return (
                  <Layout key={index.toString()}>
                    <Image style={styles.image} source={{ uri: `http://${val.foto}` }} />
                  </Layout>
                );
              })
            }
            <Button style={{ marginTop: 16 }} onPress={this.onPressDisposisi} status="primary" >DISPOSISI</Button>
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

export default connect(mapStateToProps, null)(DetailSurat);
