import {theme} from '@app/presentations/utils/styles'
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  filter: {
    marginTop: 8,
    marginBottom: 8,
  },
  popupLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    padding: 8,
  },

  syncView: {
    marginBottom: 16,
    backgroundColor: theme.colors.tealSemiTransparent,
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
})

export default styles
