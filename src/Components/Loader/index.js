import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Layout, Text} from 'react-native-ui-kitten';

const Loader = ({message}) => {
  return (
    <Layout
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255, 0.5)',
      }}>
      <ActivityIndicator size="large" color="#FFB233" />
      <Text style={{marginTop: 8}} category="h6">
        {message}
      </Text>
    </Layout>
  );
};

export default Loader;
