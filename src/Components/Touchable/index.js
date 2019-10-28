import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

const Touchable = (props) => {

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback {...props}>
        {props.children}
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity {...props}>
      {props.children}
    </TouchableOpacity>
  );
};

export default Touchable;
