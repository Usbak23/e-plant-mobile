import {theme} from '@app/presentations/utils/styles'
import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
