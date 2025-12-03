const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '.');

const config = {
  projectRoot,
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    extraNodeModules: {
      '@app': path.resolve(projectRoot, 'src'),
      '@root': path.resolve(projectRoot),
      '@components': path.resolve(projectRoot, 'src/presentations/_shared-components'),
      '@navigation': path.resolve(projectRoot, 'src/presentations/navigation'),
      '@screens': path.resolve(projectRoot, 'src/presentations/screens'),
      '@styles': path.resolve(projectRoot, 'src/presentations/utils/styles'),
      '@domain': path.resolve(projectRoot, 'src/domain'),
      '@models': path.resolve(projectRoot, 'src/models'),
      '@assets': path.resolve(projectRoot, 'assets'),
      '@utils': path.resolve(projectRoot, 'src/presentations/utils'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
