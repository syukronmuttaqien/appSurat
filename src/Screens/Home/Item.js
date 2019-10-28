import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Layout, Text } from 'react-native-ui-kitten';

import { Touchable } from '~/Components';

const Item = ({ icon, caption, index, onPress }) => {

  return (
    <Layout style={[style.mainContainer, index % 2 === 0 ? { paddingLeft: 0 } : { paddingRight: 0} ]} level="2">
      <Touchable onPress={onPress}>
        <Layout style={style.container}>
          <Icon size={32} name={icon} color="#28BE02" />
          <Text status="primary" category="h6" style={[style.spacer, { textAlign: 'center' }]}>{caption}</Text>
        </Layout>
      </Touchable>
    </Layout>
  );
};

const style = StyleSheet.create({
  mainContainer: { flex:1, height: 200, maxWidth: '50%', padding: 16, backgroundColor: 'white', marginBottom: 8 },
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    margin: 4,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  spacer: { marginTop: 8 },
  spacer2: { marginTop: 16 },
});

Item.propTypes = {
  caption: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

Item.defaultProps = {
  icon: null,
};

export default Item;
