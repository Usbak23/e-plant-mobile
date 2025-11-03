import {theme} from '@app/presentations/utils/styles'
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    paddingBottom: 56,
    paddingHorizontal: 16,
  },
  fileStatusView: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deleteFileButton: {
    borderRadius: 5,
    marginVertical: 16,
    backgroundColor: theme.colors.yellowSemiTransparent,
    height: 40,
    width: 40,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
    alignItems: 'center',
  },
})

export default styles
