import {theme} from '@app/presentations/utils/styles'
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 75,
  },
  tableViewContainer: {
    marginTop: 16,
  },
  tableHeader: {
    height: 50,
    backgroundColor: theme.colors.lightGrey,
  },
  tableHeaderText: {
    fontWeight: '700',
    padding: 10,
    alignSelf: 'center',
  },
  tableRow: {
    padding: 8,
    alignSelf: 'center',
  },
})

export default styles
