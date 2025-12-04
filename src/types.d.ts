declare module 'react-native-vector-icons/Ionicons'
declare module 'react-native-vector-icons/Entypo'
declare module 'react-native-vector-icons/MaterialIcons'
declare module 'react-native-vector-icons/Feather'
declare module 'react-native-toast-message'
declare module 'react-native-svg-charts'
declare module 'd3-scale'
declare module 'xmldom'
declare module '@tmcw/togeojson'
declare module 'react-native-currency-input'
declare module '@types/geojson'
declare module 'react-hook-form'
declare module 'react-native-step-indicator'
declare module 'react-native-table-component'
declare module 'react-native-html-to-pdf'
declare module 'react-native-background-upload'
declare module 'react-native-file-viewer'
declare module '@shopify/flash-list'
declare module '*.svg' {
  import {SvgProps} from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}
// declare module '*.svg' {
//   import type { FunctionComponent, SVGProps } from 'react';
//   const content: FunctionComponent<SVGProps<SVGSVGElement>>;
//   export default content;
// }
