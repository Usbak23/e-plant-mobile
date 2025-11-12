module.exports = {
  preset: 'react-native',
  setupFiles: [
    "./node_modules/react-native-gesture-handler/jestSetup.js"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // setupFilesAfterEnv: ['<rootDir>/setup.js'],
  transform: {
    '^.+\\.svg$': 'jest-svg-transformer',
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
    '/)',
  ],
}
