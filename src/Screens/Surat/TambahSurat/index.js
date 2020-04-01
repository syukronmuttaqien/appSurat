import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {
  Layout,
  Input,
  List,
  Text,
  Button,
  Select,
  Icon as EvaIcon,
} from 'react-native-ui-kitten';

import DocumentPicker from 'react-native-document-picker';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
// import MultiSelect from 'react-native-multiple-select';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import DatePicker from 'react-native-datepicker';

import { Touchable } from '~/Components';
import { Jabatan, JenisSurat, Surat } from '~/Services/Api';
import { connect } from 'react-redux';

class TambahSurat extends Component {
  static navigationOptions = {
    title: 'Input Surat',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      items: [],
      foto: [],
      perihal: '',
      nomorSurat: '',
      noAgendaSurat: '', // New
      kodeSurat: '',
      asalSurat: '',
      sifatSurat: '', // New
      tglSurat: null, // New
      tglJamAgenda: null, // New
      document: null,
      selectedOptionJenisSurat: null,
      itemsJenisSurat: [],
      loadingJabatan: false,
      loadingJenisSurat: false,
      loading: false,
    };

    this.multiSelect = null;
  }

  // Base Function
  componentDidMount() {
    // this.getJabatan();
    this.getJenisSurat();
  }
  //

  // API
  getJenisSurat = async () => {
    try {
      this.setState({ loadingJenisSurat: true });
      const response = await JenisSurat.getAll();
      console.log({ response });

      const { data } = response.data;
      const itemsJenisSurat = data.map(val => ({
        id: val.id,
        text: val.jenis_surat,
      }));

      this.setState({
        itemsJenisSurat,
        selectedOptionJenisSurat: itemsJenisSurat[0],
      });

      this.getJabatan(itemsJenisSurat[0].id);
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loadingJenisSurat: false });
    }
  };

  getJabatan = async jenis_surat_id => {
    try {
      this.setState({ loadingJabatan: true });
      const { user } = this.props;
      const response = await Jabatan.getByJenisSurat(
        jenis_surat_id,
        user.jabatan_id,
      );
      console.log({ response });

      const { data } = response.data;
      const items = data.map(val => ({
        id: val.id,
        name: val.nama,
      }));

      this.setState({ items });
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loadingJabatan: false });
    }
  };
  //

  // Function
  validate = () => {
    if (this.state.selectedItems.length < 1) {
      Alert.alert('Perhatian', 'Tujuan belum dipilih.');
      return false;
    }

    // if (!this.state.nomorSurat) {
    //   Alert.alert('Perhatian', 'Nomor surat belum di isi.');
    //   return false;
    // }

    // if (!this.state.kodeSurat) {
    //   Alert.alert('Perhatian', 'Kode surat belum di isi.');
    //   return false;
    // }

    if (!this.state.asalSurat) {
      Alert.alert('Perhatian', 'Asal surat belum di isi.');
      return false;
    }

    if (!this.state.perihal) {
      Alert.alert('Perhatian', 'Perihal belum di isi.');
      return false;
    }

    // if (!this.state.noAgendaSurat) {
    //   Alert.alert('Perhatian', 'No. Agenda Surat belum di isi.');
    //   return false;
    // }

    // if (!this.state.sifatSurat) {
    //   Alert.alert('Perhatian', 'Sifat Surat belum di isi.');
    //   return false;
    // }

    // if (!this.state.tglJamAgenda) {
    //   Alert.alert('Perhatian', 'Tanggal & Jam Agenda belum di isi.');
    //   return false;
    // }

    // if (!this.state.tglSurat) {
    //   Alert.alert('Perhatian', 'Tanggal belum di isi.');
    //   return false;
    // }

    if (this.state.selectedOptionJenisSurat === null) {
      Alert.alert('Perhatian', 'Jenis Surat belum dipilih.');
      return false;
    }

    // if (this.state.foto.length < 1) {
    //   Alert.alert('Perhatian', 'Belum ada foto yang diambil.');
    //   return false;
    // }

    return true;
  };

  onSelect = selectedOptionJenisSurat => {
    this.setState({ selectedOptionJenisSurat, selectedItems: [] });
    this.getJabatan(selectedOptionJenisSurat.id);
    console.log({ selectedOptionJenisSurat });
  };

  onSelectJabatan = selectedOptionJabatan => {
    this.setState({ selectedOptionJabatan });
    console.log({ selectedOptionJabatan });
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  onChangeText = perihal => {
    this.setState({ perihal });
  };

  onChangeTextNomorSurat = nomorSurat => {
    this.setState({ nomorSurat });
  };

  onChangeTextKodeSurat = kodeSurat => {
    this.setState({ kodeSurat });
  };

  onChangeTextAsalSurat = asalSurat => {
    this.setState({ asalSurat });
  };

  onChangeTextNoAgendaSurat = text => {
    this.setState({ noAgendaSurat: text });
  };

  onChangeTextSifatSurat = text => {
    this.setState({ sifatSurat: text });
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
  };

  openDocument = async () => {
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const allowedTypes = [
        'application/doc',
        'application/ms-doc',
        'application/msword',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      console.log({ document });

      if (allowedTypes.includes(document.type)) {
        this.setState({ document });
        return;
      }

      return Alert.alert(
        'Perhatian',
        'Format file yang Anda pilih tidak di dukung.',
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  onRemovePress = itemIndex => {
    const { foto } = this.state;
    const newFoto = foto.filter((val, index) => index !== itemIndex);
    this.setState({ foto: newFoto });
  };

  onSimpanPressed = async () => {
    try {
      const { navigation, user } = this.props;
      const {
        selectedItems,
        foto,
        perihal,
        nomorSurat,
        kodeSurat,
        asalSurat,
        selectedOptionJenisSurat,
        document,
        noAgendaSurat,
        sifatSurat,
        tglJamAgenda,
        tglSurat,
      } = this.state;
      if (this.validate()) {
        this.setState({ loading: true });
        const finalTujuans = JSON.stringify(selectedItems);
        const formData = new FormData();
        formData.append('perihal', perihal);
        formData.append('nomor_surat', nomorSurat);
        formData.append('kode_surat', kodeSurat);
        formData.append('asal_surat', asalSurat);
        formData.append('from_jabatan_id', user.jabatan_id);
        formData.append('status_surat', 'Pending');
        formData.append('no_agenda_surat', noAgendaSurat);
        formData.append('sifat_surat', sifatSurat);
        formData.append('jenis_surat_id', selectedOptionJenisSurat.id);
        formData.append('tujuan', finalTujuans);

        let tgl1 = null;
        let tgl2 = null;

        if (tglJamAgenda) {
          tgl1 = moment(tglJamAgenda).format('YYYY-MM-DD HH:mm:ss');
        }
        if (tglSurat) {
          tgl2 = moment(tglSurat).format('YYYY-MM-DD');
        }

        formData.append('tgl_jam_agenda', tgl1);
        formData.append('tgl_surat', tgl2);
        if (document) {
          formData.append('dokumen', document);
        }

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
        const response = await Surat.add(formData);
        console.log({ response });
        ToastAndroid.show('Surat berhasil di simpan.', ToastAndroid.SHORT);
        navigation.goBack();
      } else {
        throw new Error('There is still missing field.');
      }
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loading: false });
    }
  };
  //

  // Render Function
  renderItem = ({ item, index }) => {
    if (item === 'add') {
      return (
        <Touchable onPress={this.openCamera}>
          <Layout
            style={[styles.itemContainer, { borderColor: '#d0d0d0' }]}
            level="2">
            <Layout
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
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
          <Layout
            style={{
              padding: 4,
              position: 'absolute',
              top: 0,
              right: 4,
              backgroundColor: 'transparent',
            }}>
            <Icon name="times" size={24} color="red" />
          </Layout>
        </Touchable>
      </Layout>
    );
  };

  renderIcon = (style, visible) => {
    const iconName = visible ? 'arrow-ios-upward' : 'arrow-ios-downward';
    return <EvaIcon {...style} name={iconName} />;
  };
  //

  render() {
    const { items, foto, loading, document } = this.state;

    return (
      <ScrollView style={{ flex: 1 }}>
        <Layout style={{ flex: 1, padding: 16 }}>
          <Input
            label="Perihal"
            labelStyle={{ color: 'black' }}
            placeholder="Perihal (Wajib di isi)"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4 }}
            textContentType="name"
            value={this.state.perihal}
            onChangeText={this.onChangeText}
          />
          <Input
            label="Asal Surat"
            labelStyle={{ color: 'black' }}
            placeholder="Asal Surat (Wajib di isi)"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4 }}
            textContentType="name"
            value={this.state.asalSurat}
            onChangeText={this.onChangeTextAsalSurat}
          />
          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">
            Jenis Surat
          </Text>
          <Select
            controlStyle={{ backgroundColor: 'white', margin: 0 }}
            data={this.state.itemsJenisSurat}
            placeholder={
              this.state.loadingJenisSurat ? 'Loading...' : 'Pilih Jenis Surat'
            }
            icon={this.renderIcon}
            selectedOption={this.state.selectedOptionJenisSurat}
            onSelect={this.onSelect}
          />
          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">
            Tujuan
          </Text>
          <SectionedMultiSelect
            items={items}
            loading={this.state.loadingJabatan}
            showChips={false}
            uniqueKey="id"
            displayKey="name"
            searchPlaceholderText="Cari Jabatan..."
            selectText={
              this.state.loadingJabatan ? 'Loading...' : 'Pilih Tujuan'
            }
            showDropDowns={true}
            readOnlyHeadings={false}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={this.state.selectedItems}
            itemFontFamily="normal"
            styles={{
              button: { backgroundColor: '#FFB233' },
            }}
          />
          <Input
            label="Nomor Surat"
            labelStyle={{ color: 'black' }}
            placeholder="Nomor Surat (Tidak Wajib)"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4 }}
            textContentType="name"
            value={this.state.nomorSurat}
            onChangeText={this.onChangeTextNomorSurat}
          />
          <Input
            label="Kode Surat"
            labelStyle={{ color: 'black' }}
            placeholder="Kode Surat (Tidak Wajib)"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4 }}
            textContentType="name"
            value={this.state.kodeSurat}
            onChangeText={this.onChangeTextKodeSurat}
          />
          <Input
            label="Nomor Agenda Surat"
            labelStyle={{ color: 'black' }}
            placeholder="Nomor Agenda Surat (Tidak Wajib)"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4 }}
            textContentType="name"
            value={this.state.noAgendaSurat}
            onChangeText={this.onChangeTextNoAgendaSurat}
          />
          <Input
            label="Sifat Surat"
            labelStyle={{ color: 'black' }}
            placeholder="Sifat Surat (Tidak Wajib)"
            textStyle={{ padding: 0, paddingLeft: 0 }}
            style={{ backgroundColor: 'white', marginHorizontal: 4 }}
            textContentType="name"
            value={this.state.sifatSurat}
            onChangeText={this.onChangeTextSifatSurat}
          />
          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">
            Tanggal Surat
          </Text>

          <DatePicker
            style={{ width: '100%' }}
            date={this.state.tglSurat}
            mode="date"
            placeholder="Tanggal Surat (Tidak Wajib)"
            format="DD MMM YYYY"
            minDate={moment()}
            confirmBtnText="OK"
            cancelBtnText="Batal"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={date => {
              this.setState({ tglSurat: date });
            }}
          />
          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">
            Tanggal & Jam Agenda
          </Text>

          <DatePicker
            style={{ width: '100%' }}
            date={this.state.tglJamAgenda}
            mode="datetime"
            placeholder="Tanggal & Jam Agenda (Tidak Wajib)"
            format="DD MMM YYYY HH:mm"
            minDate={moment()}
            confirmBtnText="OK"
            cancelBtnText="Batal"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={date => {
              this.setState({ tglJamAgenda: date });
            }}
          />

          <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">
            Foto Surat
          </Text>
          <List
            data={[...foto, 'add']}
            extraData={this.state}
            renderItem={this.renderItem}
            numColumns={3}
            style={{
              backgroundColor: 'white',
              marginTop: 8,
              marginHorizontal: 4,
            }}
          />
          {document && (
            <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">
              File Terlampir: {document.name}
            </Text>
          )}
          <Button
            onPress={this.openDocument}
            style={{ marginTop: 8, marginHorizontal: 4 }}
            status="primary">
            LAMPIRKAN FILE
          </Button>

          <Text
            style={{ marginTop: 8, marginHorizontal: 4 }}
            category="p1"
            status="danger">
            *Format file yang dilampirkan harus .docx atau .doc (Microsoft Word) atau .pdf (PDF)
          </Text>

          {!loading && (
            <Button
              onPress={this.onSimpanPressed}
              style={{ marginTop: 8, marginHorizontal: 4 }}
              status="primary">
              SIMPAN
            </Button>
          )}
          {loading && (
            <ActivityIndicator
              color="#FFB233"
              size="large"
              style={{ marginHorizontal: 4 }}
            />
          )}
        </Layout>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    maxWidth: '33%',
    height: 136,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  image: { flex: 1 },
  select: { backgroundColor: 'white' },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(TambahSurat);
