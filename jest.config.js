module.exports = {
  preset: 'react-native',
  setupFiles: [
    "./node_modules/react-native-gesture-handler/jestSetup.js"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/setup.js'],
  transform: {
    '^.+\\.svg$': '<rootDir>/__mocks__/svgTransformer.js',
  },
  moduleNameMapper: {
    'react-native-file-viewer': '<rootDir>/__mocks__/nativeModuleMock.js',
    'react-native-maps': '<rootDir>/__mocks__/nativeModuleMock.js',
    'react-native-branch': '<rootDir>/__mocks__/nativeModuleMock.js',
    'react-native-device-info': '<rootDir>/__mocks__/nativeModuleMock.js',
    'react-native-html-to-pdf': '<rootDir>/__mocks__/nativeModuleMock.js',
    'react-native-background-upload': '<rootDir>/__mocks__/nativeModuleMock.js',
    '@react-native-documents/picker': '<rootDir>/__mocks__/nativeModuleMock.js',
    '@notifee/react-native': '<rootDir>/__mocks__/@notifee/react-native.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@react-native' +
    '|react-native' +
    '|react-navigation-tabs' +
    '|@react-navigation' +
    '|@react-navigation/core' +
    '|@react-navigation/native' +
    '|react-native-reanimated' +
    '|react-native-responsive-fontsize' +
    '|@react-native-community/datetimepicker' +
    '|react-native-toast-message' +
    '|react-native-multiple-select' +
    '|react-native-safe-area-context' +
    '|react-native-vector-icons' +
    '|react-redux' +
    '/)',
  ],
}
