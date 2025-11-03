import { theme } from '@app/presentations/utils/styles'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    // paddingTop: 8,
    flex: 1,
    // backgroundColor: 'red',
    // paddingBottom: 56,
    // marginBottom: 75,
  },
  tableViewContainer: {
    marginTop: 16,
    marginBottom: 1,
  },
  tableHeader: {
    height: 43,
    backgroundColor: theme.colors.lightGrey,
  },
  tableHeaderText: {
    fontWeight: '700',
    padding: 10,
    alignSelf: 'center',
  },
  tableRow: {
    // padding: 1,
    alignSelf: 'center',
  },
  deleteFileButton: {
    alignSelf: 'center',
    borderRadius: 5,
    marginVertical: 16,
    backgroundColor: theme.colors.lightGrey,
    height: 28,
    width: 28,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
    alignItems: 'center',
  },
  container: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  searhInput: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    color: theme.colors.textThinBlack,
    height: 40,
    width: '100%',
    flex: 1,
    paddingLeft: 35,
  },
  icon: {
    position: 'absolute',
    left: 11,
    top: 14,
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    height: 40,
    width: 40,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapSearch: { flex: 1, flexDirection: 'row' },
})

export default styles
