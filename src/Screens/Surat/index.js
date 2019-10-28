import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Layout, Text, List, Button, Icon as EvaIcon } from 'react-native-ui-kitten';
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
      isRefresh: false,
      isLoading: false,
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

      this.setState({ surats });
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

    const addIcon = (style) => (
      <EvaIcon {...style} name="file-add-outline"/>
    );

    return (
      <Layout style={{ flex: 1, padding: 8 }}>
        <Button onPress={() => navigation.navigate('TambahSuratScreen')} size="large" style={{ flex: 1, marginTop: 8 }} status="primary" icon={addIcon}>TAMBAH SURAT</Button>
      </Layout>
    );
  }

  renderEmptyList = () => {

    const { isLoading } = this.state;

    return (
      <Layout style={{ flex: 1, margin: 8, padding: 16, borderWidth: isLoading ? 0 : 1, borderColor: '#999999', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
        { !isLoading && <Text category="p1">Tidak ada Surat Masuk.</Text> }
        { isLoading && <ActivityIndicator size="large" color="#28BE02" /> }
      </Layout>
    );
  }

  renderItem = ({ item }) => {

    const { navigation } = this.props;
    return (
      <Touchable onPress={() => navigation.navigate({routeName: 'DetailSuratScreen', params: { id: item.id }, key: 'SSC'})}>
        <Layout style={style.itemContainer} level="2">
          <Layout style={style.itemContentLeft}>
            <Icon name="envelope-o" size={24} color="black" />
          </Layout>
          <Layout style={style.itemContentRight}>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap' }} category="h6">{item.perihal}</Text>
            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }} category="label">{item.jenissurat.jenis_surat}</Text>
          </Layout>
        </Layout>
      </Touchable>
    );
  };
  //

  render() {

    const { surats, isRefresh } = this.state;

    return (
      <Layout style={style.container} level="2">
        <List
          data={surats}
          renderItem={this.renderItem}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={this.renderEmptyList}
          refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={() => this.getSurat('refresh')} tintColor="#28BE02" colors={['#28BE02']} />}
          style={{ flex: 1, backgroundColor: 'white' }}
        />
      </Layout>
    );
  }
}

const style = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingBottom: 0 },
  itemContainer: { borderRadius: 4, flex: 1, flexDirection: 'row', padding: 8, margin: 8, elevation: 4, alignItems: 'center', backgroundColor: 'white' },
  itemContentLeft: { flex: 0, height: '100%' , padding: 8, justifyContent: 'flex-start', backgroundColor: 'transparent' },
  itemContentRight: { flex: 1, flexDirection: 'column', padding: 8, justifyContent: 'center', alignItems: 'flex-start', backgroundColor: 'transparent' },
});

const mapStateToProps = state =>({
  user: state.user,
});

export default connect(mapStateToProps, null)(Surat);
