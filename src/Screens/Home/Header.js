import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Layout, Text } from 'react-native-ui-kitten';

const Header = ({ nama, jabatan }) => {
  return (
    <Layout style={style.container}>
      <Text status="primary" category="h5">{nama}</Text>
      <Text status="primary" categroy="h6" style={style.spacer}>{jabatan || 'Pegawai'}</Text>
    </Layout>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    margin: 4,
    backgroundColor: 'white',
    marginBottom: 8,
    marginRight: 8,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  spacer: { marginTop: 8 },
  spacer2: { marginTop: 16 },
});

Header.propTypes = {
  nama: PropTypes.string.isRequired,
  jabatan: PropTypes.string,
};

Header.defaultProps = {
  jabatan: null,
};

export default Header;
