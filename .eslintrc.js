module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': 0,
    'react-native/no-inline-styles': 0,
  },
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': [
        {
          rootPathPrefix: '$/',
          rootPathSuffix: 'assets',
        },
        {
          rootPathPrefix: '~/',
          rootPathSuffix: 'src',
        },
        {
          rootPathPrefix: '!/',
          rootPathSuffix: 'src/Redux/Actions',
        },
        {
          rootPathPrefix: '-/',
          rootPathSuffix: 'src/Redux/Reducers',
        },
      ],
    },
  },
};
