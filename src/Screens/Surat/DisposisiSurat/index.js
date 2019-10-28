import React, { Component } from 'react';
import { Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { Layout, Text, Button, Icon as EvaIcon, Input } from 'react-native-ui-kitten';

import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Jabatan, Surat } from '~/Services/Api';

class DisposisiSurat extends Component {
  static navigationOptions = {
    title: 'Disposisi Surat',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      items: [],
      loadingJabatan: false,
      loading: false,
      catatan: '',
    };

    this.multiSelect = null;
  }

  // Base Function
  componentDidMount() {
    this.getJabatan();
  }
  //

  // API
  getJabatan = async () => {
    try {
    const { navigation } = this.props;
    const jabatan_id = navigation.getParam('jabatan_id');
    const final_jabatan_id = JSON.stringify(jabatan_id);
    this.setState({ loadingJabatan: true });

    const response = await Jabatan.getByExist(final_jabatan_id);
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

    return true;
  }

  onSelect = (selectedOptionJenisSurat) => {
    this.setState({ selectedOptionJenisSurat });
    console.log({ selectedOptionJenisSurat });
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  }

  onDisposisiPressed = async () => {
    try {
      const { navigation } = this.props;
      const { selectedItems, catatan } = this.state;
      if (this.validate()) {
        this.setState({ loading: true });
        const suratId = navigation.getParam('id');
        const finalTujuans = JSON.stringify(selectedItems);
        console.log({ catatan });
        const response = await Surat.disposisi(suratId, finalTujuans, catatan);
        console.log({ response });
        ToastAndroid.show('Surat berhasil di disposisi.', ToastAndroid.SHORT);
        navigation.goBack('SSC');
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

  renderIcon = (style, visible) => {
    const iconName = visible ? 'arrow-ios-upward' : 'arrow-ios-downward';
    return (
      <EvaIcon {...style} name={iconName}/>
    );
  };
  //

  render() {
    const { items, loading } = this.state;

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
          label="Catatan"
          labelStyle={{ color: 'black' }}
          placeholder="Tulis catatan disini..."
          textStyle={{ padding: 0, paddingLeft: 0, textAlignVertical: 'top' }}
          style={{ backgroundColor: 'white', marginHorizontal: 4 }}
          textContentType="name"
          multiline
          numberOfLines={3}
          value={this.state.catatan}
          onChangeText={(text) => { this.setState({ catatan: text });}}
        />
        {!loading && <Button onPress={this.onDisposisiPressed} style={{ marginTop: 8, marginHorizontal: 4 }} status="primary">DISPOSISI</Button>}
        {loading && <ActivityIndicator color="#28BE02" size="large" style={{ marginHorizontal: 4 }} />}
      </Layout>
    );
  }
}

export default DisposisiSurat;
