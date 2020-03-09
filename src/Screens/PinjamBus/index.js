import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, RefreshControl} from 'react-native';
import {
  Layout,
  List,
  Text,
  Icon as EvaIcon,
  Button,
} from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment-with-locales-es6';

import {PinjamBus as PinjamBusApi} from '~/Services/Api';

class PinjamBus extends Component {
  static navigationOptions = {
    title: 'Peminjaman Bus',
  };

  constructor(props) {
    super(props);
    this.state = {
      peminjamans: [],
      isLoading: false,
      isRefresh: false,
    };

    this.navigationFocusSubcription = null;
  }

  // Base Function
  componentDidMount() {
    this.navigationFocusSubcription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        // console.log('willFocus', payload);
        this.getPeminjaman();
      },
    );
  }

  componentWillUnmount() {
    if (this.navigationFocusSubcription) {
      this.navigationFocusSubcription.remove();
    }
  }
  //

  // API
  getPeminjaman = async (type = 'first') => {
    try {
      // const { user } = this.props;
      if (type === 'first') {
        this.setState({isLoading: true});
      }
      if (type === 'refresh') {
        this.setState({isRefresh: true});
      }
      const response = await PinjamBusApi.getAll();
      console.log({response});

      const {data} = response.data;
      const peminjamans = data;

      this.setState({peminjamans});
    } catch (err) {
      console.log({err});
    } finally {
      this.setState({isLoading: false, isRefresh: false});
    }
  };
  //

  // Render Function
  renderHeader = () => {
    const {navigation} = this.props;
    const {isLoading, peminjamans} = this.state;

    const addIcon = style => <EvaIcon {...style} name="plus-square-outline" />;

    if (isLoading) {
      return null;
    }

    return (
      <Layout style={{flex: 1, padding: 8}}>
        <Button
          onPress={() =>
            navigation.navigate('TambahPinjamBusScreen', {peminjamans})
          }
          size="large"
          style={{flex: 1, marginTop: 8}}
          status="primary"
          icon={addIcon}>
          PINJAM BUS
        </Button>
      </Layout>
    );
  };

  renderItem = ({item}) => {
    moment.locale('id');
    const tgl_new = moment(item.tgl_peminjaman).format('LLL');
    const tgl_selesai = moment(item.tgl_selesai_pinjam).format('LLL');
    const jumlahBus = item.detail.length;

    return (
      // <Touchable onPress={() => navigation.navigate({routeName: 'DetailSuratScreen', params: { id: item.id }, key: 'SSC'})}>
      <Layout style={style.itemContainer} level="2">
        <Layout style={style.itemContentLeft}>
          <Icon name="bus" size={24} color="black" />
        </Layout>
        <Layout style={style.itemContentRight}>
          <Text style={{flexDirection: 'row', flexWrap: 'wrap'}} category="h6">
            Acara: {item.nama_acara}
          </Text>
          <Text
            style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 2}}
            category="p1">
            Tujuan: {item.tujuan}
          </Text>
          <Text
            style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 4}}
            category="label">
            Jumlah Bus: {jumlahBus}
          </Text>
          <Layout style={style.divider} />
          {item.detail.map((val, index) => {
            return (
              <Layout key={index.toString()}>
                <Text
                  style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 4}}
                  category="label">
                  {val.bus.bus}
                </Text>
                <Text
                  style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 2}}
                  category="label">
                  No. Polisi: {val.bus.no_polisi}
                </Text>
              </Layout>
            );
          })}
          <Layout style={style.divider} />
          <Text
            style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8}}
            category="label">
            Tgl. Pinjam: {tgl_new}
          </Text>
          <Text
            style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 2}}
            category="label">
            Tgl. Selesai: {tgl_selesai}
          </Text>
        </Layout>
      </Layout>
      // </Touchable>
    );
  };

  renderEmptyList = () => {
    const {isLoading} = this.state;

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
        {!isLoading && <Text category="p1">Tidak ada Peminjaman Bus.</Text>}
        {isLoading && <ActivityIndicator size="large" color="#FFB233" />}
      </Layout>
    );
  };
  //

  render() {
    const {peminjamans, isRefresh, isLoading} = this.state;

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
          <Text style={{marginTop: 8}} category="s1">
            Mengambil Data...
          </Text>
        </Layout>
      );
    }

    return (
      <Layout style={style.container} level="2">
        <List
          data={peminjamans}
          extraData={this.state}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={this.renderEmptyList}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={() => this.getPeminjaman('refresh')}
              tintColor="#FFB233"
              colors={['#FFB233']}
            />
          }
          style={{flex: 1, backgroundColor: 'white'}}
        />
      </Layout>
    );
  }
}

const style = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white', paddingBottom: 0},
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
  divider: {width: '100%', marginTop: 8, height: 0.5, backgroundColor: 'black'},
});

export default PinjamBus;
