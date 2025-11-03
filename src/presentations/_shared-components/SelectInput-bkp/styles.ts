import {Platform, StyleSheet} from 'react-native'
import {theme} from '@styles'
import {RFValue as fs} from 'react-native-responsive-fontsize'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    color: theme.colors.textThinBlack,
    marginBottom: 6,
  },
  select: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: '#fff',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
    fontStyle: 'italic',
    color: theme.colors.black,
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    height: 50,
  },
  onValue: {
    fontStyle: 'normal',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
  },
  focused: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  error: {
    color: theme.colors.error,
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
    fontSize: fs(11),
  },
  rowCenter: {flexDirection: 'row', alignItems: 'center'},
  iconError: {marginTop: 4, marginRight: 5},
  rightButtonsContainerStyle: {
    right: 8,
    height: 30,
    top: 10,
    backgroundColor: 'white',
  },
  suggestionsListContainerStyle: {
    backgroundColor: 'white',
    width: '99%',
    marginLeft: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  item: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  textItem: {paddingHorizontal: 10, paddingVertical: 4},
})

export default styles
