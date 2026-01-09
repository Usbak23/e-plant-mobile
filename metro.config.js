const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const defaultConfig = getDefaultConfig(projectRoot);
const { assetExts, sourceExts } = defaultConfig.resolver;

module.exports = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      '@app': path.resolve(projectRoot, 'src'),
      '@navigation': path.resolve(projectRoot, 'src/presentations/navigation'),
      '@components': path.resolve(projectRoot, 'src/presentations/_shared-components'),
      '@screens': path.resolve(projectRoot, 'src/presentations/screens'),
      '@styles': path.resolve(projectRoot, 'src/presentations/utils/styles'),
      '@domain': path.resolve(projectRoot, 'src/domain'),
      '@models': path.resolve(projectRoot, 'src/models'),
      '@assets': path.resolve(projectRoot, 'assets'),
      '@utils': path.resolve(projectRoot, 'src/presentations/utils'),
    }
  },
});
