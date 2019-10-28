import React, { Component } from 'react';
import { StyleSheet, Image, Alert, ActivityIndicator, ToastAndroid } from 'react-native';
import moment from 'moment';
import { Layout, Input, List, Text, Button, Select, Icon as EvaIcon } from 'react-native-ui-kitten';

import SectionedMultiSelect from 'react-native-sectioned-multi-select';
// import MultiSelect from 'react-native-multiple-select';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Touchable } from '~/Components';
import { Jabatan, JenisSurat, Surat } from '~/Services/Api';

class TambahSurat extends Component {
  static navigationOptions = {
    title: 'Tambah Surat Masuk',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      items: [],
      foto: [],
      perihal: '',
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
    this.getJabatan();
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

      this.setState({ itemsJenisSurat });
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ loadingJenisSurat: false });
    }
  }

  getJabatan = async () => {
    try {
    this.setState({ loadingJabatan: true });
    const response = await Jabatan.getAll();
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
  }
  //

  // Function
  validate = () => {

    if (this.state.selectedItems.length < 1) {
      Alert.alert('Perhatian','Tujuan belum dipilih.');
      return false;
    }

    if (!this.state.perihal) {
      Alert.alert('Perhatian', 'Perihal belum di isi.');
      return false;
    }

    if (this.state.selectedOptionJenisSurat === null) {
      Alert.alert('Perhatian','Jenis Surat belum dipilih.');
      return false;
    }

    if (this.state.foto.length < 1) {
      Alert.alert('Perhatian', 'Belum ada foto yang diambil.');
      return false;
    }

    return true;
  }

  onSelect = (selectedOptionJenisSurat) => {
    this.setState({ selectedOptionJenisSurat });
    console.log({ selectedOptionJenisSurat });
  };

  onSelectJabatan = (selectedOptionJabatan) => {
    this.setState({ selectedOptionJabatan });
    console.log({ selectedOptionJabatan });
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  }

  onChangeText = (perihal) => {
    this.setState({ perihal });
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
      const { navigation } = this.props;
      const { selectedItems, foto, perihal, selectedOptionJenisSurat } = this.state;
      if (this.validate()) {
        this.setState({ loading: true });
        const finalTujuans = JSON.stringify(selectedItems);
        const formData = new FormData();

        formData.append('perihal', perihal);
        formData.append('status_surat', 'Pending');
        formData.append('jenis_surat_id', selectedOptionJenisSurat.id);
        formData.append('tujuan', finalTujuans);

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
    const { items, foto, loading } = this.state;

    return (
      <Layout style={{ flex: 1, padding: 16 }}>
        <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">Tujuan</Text>
        <SectionedMultiSelect
          items={items}
          loading={this.state.loadingJabatan}
          showChips={false}
          uniqueKey="id"
          displayKey="name"
          searchPlaceholderText="Cari Jabatan..."
          selectText="Pilih Tujuan"
          showDropDowns={true}
          readOnlyHeadings={false}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          itemFontFamily="normal"
          styles={{
            button: { backgroundColor: '#28BE02' },
          }}
        />
        <Input
          label="Perihal"
          labelStyle={{ color: 'black' }}
          placeholder="Perihal"
          textStyle={{ padding: 0, paddingLeft: 0 }}
          style={{ backgroundColor: 'white', marginHorizontal: 4 }}
          textContentType="name"
          value={this.state.perihal}
          onChangeText={this.onChangeText}
        />
        <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">Jenis Surat</Text>
        <Select
          controlStyle={{ backgroundColor: 'white', margin: 0 }}
          data={this.state.itemsJenisSurat}
          placeholder={this.state.loadingJenisSurat ? 'Loading...' : 'Pilih Jenis Surat'}
          icon={this.renderIcon}
          selectedOption={this.state.selectedOptionJenisSurat}
          onSelect={this.onSelect}
        />
        <Text style={{ marginTop: 8, marginHorizontal: 4 }} category="p1">Foto Surat</Text>
        <List
          data={[...foto, 'add']}
          extraData={this.state}
          renderItem={this.renderItem}
          numColumns={3}
          style={{ backgroundColor: 'white', marginTop: 8, marginHorizontal: 4 }}
        />

        {!loading && <Button onPress={this.onSimpanPressed} style={{ marginTop: 8, marginHorizontal: 4 }} status="primary">SIMPAN</Button>}
        {loading && <ActivityIndicator color="#28BE02" size="large" style={{ marginHorizontal: 4 }} />}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: { flex: 1, maxWidth: '33%', height: 136, borderWidth: 1, borderColor: '#f0f0f0' },
  image: { flex: 1 },
  select: { backgroundColor: 'white' },

});

export default TambahSurat;
