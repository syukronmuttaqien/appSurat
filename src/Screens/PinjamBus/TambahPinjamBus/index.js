import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Alert, ToastAndroid, BackHandler } from 'react-native';
import { Layout, Input, Text, Select, Datepicker, Icon as EvaIcon, Button } from 'react-native-ui-kitten';

import { PinjamBus as PinjamBusApi } from '~/Services/Api';
import moment from 'moment';

class TambahPinjamBus extends Component {
  static navigationOptions = {
    title: 'Pinjam Bus',
  };

  constructor(props) {
    super(props);
    this.state = {
      namaAcara: '',
      tujuan: '',
      selectedBus: null,
      loadingItemsBus: false,
      itemsBus: [],
      tanggalPinjam: new Date(),
      loading: false,
      peminjamans: props.navigation.getParam('peminjamans') || [],
    };

    this.DatePickerRef = null;
    this.SelectRef = null;
    this.backHandler = null;
  }

  // Base Function
  componentDidMount() {
    this.getBus();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // const { navigation } = this.props;
      if (this.DatePickerRef.state.visible) {
        this.DatePickerRef.toggleVisible();
        return true;
      }
      if (this.SelectRef.state.visible) {
        this.SelectRef.setVisibility(false);
        return true;
      }
      return false;
    });

    console.log({ exist: this.state.peminjamans });
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }
  //

  // API
  getBus = async () => {
    try {
      this.setState({ loadingItemsBus: true });
      const response = await PinjamBusApi.getAllBus();
      console.log({ response });

      const { data } = response.data;
      const itemsBus = data.map(val => ({
        id: val.id,
        text: val.bus,
      }));

      this.setState({ itemsBus, selectedBus: itemsBus[0] });
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loadingItemsBus: false });
    }
  }
  //

  // Function
  filter = (date) => {
    let today = new Date();
    today.setDate(today.getDate() - 1);

    const { peminjamans, selectedBus } = this.state;
    const tgl = moment(date).format('YYYY-MM-DD');
    const filtering = peminjamans.filter(val => val.bus_id === selectedBus.id && val.tgl_peminjaman === tgl);

    return (date >= today && filtering.length < 1);
  };

  onChangeText = (namaAcara) => {
    this.setState({ namaAcara });
  };

  onChangeTextTujuan = (tujuan) => {
    this.setState({ tujuan });
  };

  onSelect = (selectedBus) => {
    this.setState({ selectedBus });
    console.log({ selectedBus });
  };

  onSelectTanggalPinjam = (tanggalPinjam) => {
    this.setState({ tanggalPinjam });
    console.log({ tanggalPinjam });
  }

  validate = () => {

    if (!this.state.namaAcara) {
      Alert.alert('Perhatian', 'Nama acara belum di isi.');
      return false;
    }

    if (!this.state.tujuan) {
      Alert.alert('Perhatian', 'Tujuan belum di isi.');
      return false;
    }

    if (this.state.selectedBus === null) {
      Alert.alert('Perhatian','Bus belum dipilih.');
      return false;
    }

    const { peminjamans, selectedBus, tanggalPinjam } = this.state;
    const tgl = moment(tanggalPinjam).format('YYYY-MM-DD');
    const filtering = peminjamans.filter(val => val.bus_id === selectedBus.id && val.tgl_peminjaman === tgl);

    if (filtering.length > 0) {
      Alert.alert('Perhatian','Bus telah dipinjam.');
      return false;
    }

    return true;
  }

  onSimpanPressed = async () => {
    try {
      const { navigation } = this.props;
      const { namaAcara, selectedBus, tanggalPinjam, tujuan } = this.state;
      if (this.validate()) {
        this.setState({ loading: true });
        const tgl = moment(tanggalPinjam).format('YYYY-MM-DD');
        const response = await PinjamBusApi.add(namaAcara, tujuan, selectedBus.id, tgl);
        console.log({ response });
        ToastAndroid.show('Data pinjam bus berhasil di simpan.', ToastAndroid.SHORT);
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
  CalendarIcon = (style) => (
    <EvaIcon {...style} name="calendar"/>
  );

  renderIcon = (style, visible) => {
    const iconName = visible ? 'arrow-ios-upward' : 'arrow-ios-downward';
    return (
      <EvaIcon {...style} name={iconName}/>
    );
  };
  //

  render() {

    const { loading } = this.state;

    return (
      <ScrollView style={styles.mainContainer}>
        <Layout style={styles.container}>

          <Text style={{ marginHorizontal: 4 }} category="p1">Nama Acara</Text>
          <Input
            placeholder="Nama Acara"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4, marginTop: 4 }}
            textContentType="name"
            value={this.state.namaAcara}
            onChangeText={this.onChangeText}
          />
          <Text style={{ marginHorizontal: 4 }} category="p1">Tujuan</Text>
          <Input
            placeholder="Tujuan"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4, marginTop: 4 }}
            textContentType="name"
            value={this.state.tujuan}
            onChangeText={this.onChangeTextTujuan}
          />
          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">Pilih Bus</Text>
          <Select
            ref={comp => { this.SelectRef = comp;}}
            controlStyle={{ backgroundColor: 'white', margin: 0 }}
            data={this.state.itemsBus}
            placeholder={this.state.loadingItemsBus ? 'Loading...' : 'Pilih Bus'}
            icon={this.renderIcon}
            selectedOption={this.state.selectedBus}
            onSelect={this.onSelect}
          />
          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">Pilih Tanggal Pinjam</Text>
          <Datepicker
            ref={comp => { this.DatePickerRef = comp;}}
            boundingMonth
            filter={this.filter}
            style={{ marginTop: 4, backgroundColor: 'white', marginHorizontal: 4 }}
            date={this.state.tanggalPinjam}
            icon={this.CalendarIcon}
            onSelect={this.onSelectTanggalPinjam}
          />

          {!loading && <Button onPress={this.onSimpanPressed} style={{ marginTop: 16, marginHorizontal: 4 }} status="primary">SIMPAN</Button>}
          {loading && <ActivityIndicator color="#FF3300" size="large" style={{ marginTop: 8, marginHorizontal: 4 }} />}
        </Layout>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
});

export default TambahPinjamBus;
