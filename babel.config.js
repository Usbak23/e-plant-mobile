module.exports = {
  presets: [
    ['@react-native/babel-preset', {
      runtime: 'automatic',
      disableImportExportTransform: false,
    }],
  ],
  plugins: [
    ['babel-plugin-module-resolver', {
      root: ['./'],
      extensions: [
        '.ios.ts', '.android.ts', '.ts',
        '.ios.tsx', '.android.tsx', '.tsx',
        '.jsx', '.js', '.json',
      ],
      alias: {
        '@app': './src',
        '@root': './',
        '@components': './src/presentations/_shared-components',
        '@navigation': './src/presentations/navigation',
        '@screens': './src/presentations/screens',
        '@styles': './src/presentations/utils/styles',
        '@domain': './src/domain',
        '@models': './src/models',
        '@assets': './assets',
        '@utils': './src/presentations/utils',
      },
    }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'optional-require',
  ],
};
