module.exports = api => {
  api.cache(true);

  const configRootImport = {
    paths: [
      {
        rootPathSuffix: './assets',
        rootPathPrefix: '$/',
      },
      {
        rootPathSuffix: './src',
        rootPathPrefix: '~/',
      },
      {
        rootPathSuffix: './src/Redux/Actions',
        rootPathPrefix: '!/',
      },
      {
        rootPathSuffix: './src/Redux/Reducers',
        rootPathPrefix: '-/',
      },
    ],
  };

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [['babel-plugin-root-import', configRootImport]],
    // env: {
    //   production: {
    //     plugins: ['transform-remove-console'],
    //   },
    // },
  };
};
