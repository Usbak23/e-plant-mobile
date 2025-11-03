import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {StyleSheet} from 'react-native'
import {theme} from '@utils/styles'

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: wp(8),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.colors.defaultBorderColor,
  },
  default: {},
  link: {
    borderWidth: 0,
    backgroundColor: theme.colors.white,
  },
  outlined: {
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
  },
})

export default styles
