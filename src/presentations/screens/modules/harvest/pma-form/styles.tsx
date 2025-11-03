import {theme} from '@app/presentations/utils/styles'
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 56,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
})

export default styles
