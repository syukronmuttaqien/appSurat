import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import {
  Layout,
  Text,
  List,
  Button,
  Input,
  Icon as EvaIcon,
  CheckBox,
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Touchable } from '~/Components';
import { Surat as SuratApi } from '~/Services/Api';

class Surat extends Component {
  static navigationOptions = {
    title: 'Surat Masuk',
  };

  constructor(props) {
    super(props);
    this.state = {
      surats: [],
      suratsFilter: [],
      isRefresh: false,
      isLoading: false,
      checkedBelum: false,
      checkedSudah: false,
      checkedProses: false,
      search: '',
    };

    this.navigationFocusSubcription = null;
  }

  // Base Function
  componentDidMount() {
    this.navigationFocusSubcription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        // console.log('willFocus', payload);
        this.getSurat();
      },
    );
  }

  componentWillUnmount() {
    if (this.navigationFocusSubcription) {
      this.navigationFocusSubcription.remove();
    }
  }

  onActiveChange = (isChecked, type) => {
    const { checkedBelum, checkedProses, checkedSudah } = this.state;

    if (type === 'belum') {
      this.setState({ checkedBelum: !checkedBelum, checkedProses: false, checkedSudah: false });
      return;
    }

    if (type === 'proses') {
      this.setState({ checkedBelum: false, checkedProses: !checkedProses, checkedSudah: false });
      return;
    }

    if (type === 'selesai') {
      this.setState({ checkedBelum: false, checkedProses: false, checkedSudah: !checkedSudah });
      return;
    }
  }

  filterData = () => {
    const { checkedBelum, checkedProses, checkedSudah, surats, search } = this.state;
    let filteredData = surats;

    if (search) {
      filteredData = filteredData.filter(val => {
        if (val.kode_surat) {
          return val.perihal.toLowerCase().includes(search.toLowerCase()) || val.kode_surat.toLowerCase().includes(search.toLowerCase());
        }
        return val.perihal.toLowerCase().includes(search.toLowerCase());
      });
    }

    if (checkedBelum) {
      filteredData = filteredData.filter(val => val.status_surat === 'Pending');
    }

    if (checkedProses) {
      filteredData = filteredData.filter(val => val.status_surat === 'Proses');
    }

    if (checkedSudah) {
      filteredData = filteredData.filter(val => val.status_surat === 'Selesai');
    }

    return filteredData;
  }

  onChangeSearch = (value) => {
    this.setState({ search: value })
  }

  onReset = () => {
    this.setState({
      checkedBelum: false,
      checkedProses: false,
      checkedSudah: false,
      search: '',
    });
  }
  //

  // API
  getSurat = async (type = 'first') => {
    try {
      const { user } = this.props;
      if (type === 'first') {
        this.setState({ isLoading: true });
      }
      if (type === 'refresh') {
        this.setState({ isRefresh: true });
      }
      const response = await SuratApi.getAllByJabatan(user.jabatan_id);
      console.log({ response });
      const { data } = response.data;
      const surats = data;
      const suratsFilter = surats;

      this.setState({ surats, suratsFilter });
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ isLoading: false, isRefresh: false });
    }
  };
  //

  // Render Function
  renderHeader = () => {
    const { navigation, user } = this.props;

    if (
      !user.jabatan.nama.includes('Agendaris') &&
      !user.jabatan.nama.includes('Ketua Program')
    ) {
      return (
        <Layout style={{ flex: 1, padding: 8 }}>
          {this.renderFilterBox()}
        </Layout>
      );
    }

    const addIcon = style => <EvaIcon {...style} name="file-add-outline" />;

    return (
      <Layout style={{ flex: 1, padding: 8 }}>
        <Button
          onPress={() => navigation.navigate('TambahSuratScreen')}
          size="large"
          style={{ flex: 1, marginTop: 8 }}
          status="primary"
          icon={addIcon}>
          INPUT SURAT
        </Button>
        {this.renderFilterBox()}
      </Layout>
    );
  };

  renderEmptyList = () => {
    const { isLoading } = this.state;

    return (
      <Layout
        style={{
          flex: 1,
          margin: 8,
          padding: 16,
          borderWidth: isLoading ? 0 : 1,
          borderColor: '#999999',
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {!isLoading && <Text category="p1">Tidak ada Surat Masuk.</Text>}
        {isLoading && <ActivityIndicator size="large" color="#FFB233" />}
      </Layout>
    );
  };

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    let color = 'black';

    if (item.status_surat === 'Pending') {
      color = 'red';
    }

    if (item.status_surat === 'Proses') {
      color = 'blue';
    }

    if (item.status_surat === 'Selesai') {
      color = 'green';
    }

    return (
      <Touchable
        onPress={() =>
          navigation.navigate({
            routeName: 'DetailSuratScreen',
            params: { id: item.id },
            key: 'SSC',
          })
        }>
        <Layout style={style.itemContainer} level="2">
          <Layout style={style.itemContentLeft}>
            <Icon name="envelope-o" size={24} color="black" />
          </Layout>
          <Layout style={style.itemContentRight}>
            <Text
              style={{ flexDirection: 'row', flexWrap: 'wrap' }}
              category="h6">
              {item.perihal}
            </Text>
            <Text
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}
              category="s1">
              Nomor Surat: {item.nomor_surat}
            </Text>
            <Text
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}
              category="s1">
              Kode Surat: {item.kode_surat}
            </Text>
            <Text
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}
              category="s1">
              Asal Surat: {item.asal_surat}
            </Text>
            <Text
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}
              category="s1">
              Jenis Surat: {item.jenissurat.jenis_surat}
            </Text>
            <Text
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, color: color }}
              category="s1">
              Status Surat: {item.status_surat}
            </Text>
            <Text
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}
              category="s1">
              Terakhir di baca oleh: {item.terakhir_dibaca_oleh ? item.terakhir_dibaca_oleh : '-'}
            </Text>
          </Layout>
        </Layout>
      </Touchable>
    );
  };

  renderFilterBox = () => {
    const { checkedBelum, checkedSudah, checkedProses, search } = this.state;

    return (
      <Layout style={{ flexDirection: 'column', width: '100%', marginTop: 8 }}>
        <Input
          labelStyle={{ color: 'black' }}
          placeholder="Cari Perihal Surat atau Kode Surat..."
          textStyle={{ padding: 0, paddingLeft: 0 }}
          style={{ backgroundColor: 'white', marginHorizontal: 0 }}
          returnKeyType="search"
          textContentType="name"
          value={search}
          onChangeText={this.onChangeSearch}
        />
        <Button
          style={{ marginTop: 8, width: 100, alignSelf: 'flex-end' }}
          status="warning"
          appearance="outline"
          size="small"
          onPress={this.onReset}
        >
          RESET
        </Button>
        <Text category="s1">Filter Berdasarkan: </Text>
        <Layout style={{ width: '100%', backgroundColor: 'black', height: 1 }} />
        <CheckBox
          style={{ flex: 1, marginTop: 16 }}
          text="Belum di Proses"
          checked={checkedBelum}
          onChange={(isChecked) => this.onActiveChange(isChecked, 'belum')}
        />
        <CheckBox
          style={{ flex: 1, marginTop: 16 }}
          text="Proses Disposisi"
          checked={checkedProses}
          onChange={(isChecked) => this.onActiveChange(isChecked, 'proses')}
        />
        <CheckBox
          style={{ flex: 1, marginTop: 16 }}
          text="Selesai"
          checked={checkedSudah}
          onChange={(isChecked) => this.onActiveChange(isChecked, 'selesai')}
        />
        <Layout style={{ width: '100%', backgroundColor: 'black', height: 1, marginTop: 16 }} />
      </Layout>
    );
  }
  //

  render() {
    const { surats, isRefresh, isLoading } = this.state;

    if (isLoading) {
      return (
        <Layout
          style={[
            style.container,
            {
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            },
          ]}>
          <ActivityIndicator size="large" color="#FFB233" />
          <Text style={{ marginTop: 8 }} category="s1">
            Mengambil Data...
          </Text>
        </Layout>
      );
    }

    return (
      <Layout style={style.container} level="2">
        <List
          data={this.filterData()}
          renderItem={this.renderItem}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={this.renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={() => this.getSurat('refresh')}
              tintColor="#FFB233"
              colors={['#FFB233']}
            />
          }
          style={{ flex: 1, backgroundColor: 'white' }}
        />
      </Layout>
    );
  }
}

const style = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingBottom: 0 },
  itemContainer: {
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    margin: 8,
    elevation: 4,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  itemContentLeft: {
    flex: 0,
    height: '100%',
    padding: 8,
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  itemContentRight: {
    flex: 1,
    flexDirection: 'column',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  divider: { width: '100%', marginTop: 8, height: 1, backgroundColor: 'black' },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(Surat);
