import {Platform, StyleSheet} from 'react-native'
import {theme} from '@utils/styles'

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputDarkTheme: {
    backgroundColor: theme.colors.inputDarkTheme,
    color: theme.colors.white,
  },
  input: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: '#fff',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
    color: theme.colors.black,
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingVertical: 10,
    fontStyle: 'italic',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    height: 50,
    flex: 1,
  },
  labelDarkTheme: {
    color: theme.colors.white,
  },
  label: {
    color: theme.colors.textThinBlack,
    marginBottom: 6,
  },
  wrapInput: {flexDirection: 'row'},
  error: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    fontSize: 11,
    paddingTop: 4,
  },
  wrapIcon: {
    zIndex: 5,
    elevation: 5,
  },
  icon: {
    zIndex: 5,
    position: 'absolute',
    resizeMode: 'contain',
    width: 35,
    height: 26,
    left: 17,
    top: 15,
    bottom: 8,
  },
  round: {
    borderRadius: 25,
  },
  default: {
    borderRadius: 10,
  },
  hideButton: {position: 'absolute', right: 18, top: 14},
  haveValue: {
    fontStyle: 'normal',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
  },
})

export default styles
