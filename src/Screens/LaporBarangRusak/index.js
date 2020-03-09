import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Layout, List, Text, Icon as EvaIcon, Button } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Touchable } from '~/Components';
import { LaporanBarangRusak as LaporanApi } from '~/Services/Api';

class LaporBarangRusak extends Component {
  static navigationOptions = {
    title: 'Laporan Barang Rusak',
  };

  constructor(props) {
    super(props);
    this.state = {
      laporans: [],
      isLoading: false,
      isRefresh: false,
    };
  }

  // Base Function
  componentDidMount() {
    this.navigationFocusSubcription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.getLaporan();
      }
    );
  }

  componentWillUnmount() {
    if (this.navigationFocusSubcription) {
      this.navigationFocusSubcription.remove();
    }
  }
  //

  // API
  getLaporan = async (type = 'first') => {
    try {
      if (type === 'first') {
        this.setState({ isLoading: true });
      }
      if (type === 'refresh') {
        this.setState({ isRefresh: true });
      }
      const response = await LaporanApi.getAll();
      console.log({ response });

      const { data } = response.data;
      const laporans = data;

      this.setState({ laporans });
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ isLoading: false, isRefresh: false });
    }
  }
  //

  // Render Function
  renderHeader = () => {
    const { navigation } = this.props;
    const { isLoading } = this.state;

    const addIcon = (style) => (
      <EvaIcon {...style} name="file-add-outline" />
    );

    if (isLoading) {
      return null;
    }

    return (
      <Layout style={{ flex: 1, padding: 8 }}>
        <Button onPress={() => navigation.navigate('TambahLaporanBarangRusakScreen')} size="large" style={{ flex: 1, marginTop: 8 }} status="primary" icon={addIcon}>TAMBAH LAPORAN</Button>
      </Layout>
    );
  }

  renderItem = ({ item }) => {

    const { navigation } = this.props;

    return (
      <Touchable onPress={() => navigation.navigate({ routeName: 'DetailLaporanBarangRusakScreen', params: { id: item.id }, key: 'DetailLaporanBarangSuratScreen' })}>
        <Layout style={style.itemContainer} level="2">
          <Layout style={style.itemContentLeft}>
            <Icon name="box" size={24} color="black" />
          </Layout>
          <Layout style={style.itemContentRight}>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap' }} category="h6">{item.nama_barang}</Text>
            <Layout style={style.divider} />
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }} category="s1">Keterangan: </Text>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 0 }} category="s2">{item.keterangan}</Text>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }} category="s1">Pelapor: </Text>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 0 }} category="s2">{item.user.nama}</Text>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }} category="s1">Status Perbaikan: </Text>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 0, color: item.status === 'Belum' ? 'red' : 'green' }} category="s2">{item.status} Diperbaiki</Text>
          </Layout>
        </Layout>
      </Touchable>
    );
  }

  renderEmptyList = () => {

    const { isLoading } = this.state;

    return (
      <Layout style={{ flex: 1, margin: 8, padding: 16, borderWidth: isLoading ? 0 : 1, borderColor: '#999999', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
        {!isLoading && <Text category="p1">Tidak ada laporan barang rusak.</Text>}
        {isLoading && <ActivityIndicator size="large" color="#FFB233" />}
      </Layout>
    );
  }
  //

  render() {
    const { isLoading, laporans, isRefresh } = this.state;

    if (isLoading) {
      return (
        <Layout style={[style.container, { alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }]}>
          <ActivityIndicator size="large" color="#FFB233" />
          <Text style={{ marginTop: 8 }} category="s1">Mengambil Data...</Text>
        </Layout>
      );
    }

    return (
      <Layout style={style.container} level="2">
        <List
          data={laporans}
          extraData={this.state}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={this.renderEmptyList}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={() => this.getLaporan('refresh')} tintColor="#FFB233" colors={['#FFB233']} />}
          style={{ flex: 1, backgroundColor: 'white' }}
        />
      </Layout>
    );
  }
}

const style = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingBottom: 0 },
  itemContainer: { borderRadius: 4, flex: 1, flexDirection: 'row', padding: 8, margin: 8, elevation: 4, alignItems: 'center', backgroundColor: 'white' },
  itemContentLeft: { flex: 0, height: '100%', padding: 8, justifyContent: 'flex-start', backgroundColor: 'transparent' },
  itemContentRight: { flex: 1, flexDirection: 'column', padding: 8, justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'transparent' },
  divider: { width: '100%', marginTop: 8, height: 1, backgroundColor: 'black' },
});

export default LaporBarangRusak;
