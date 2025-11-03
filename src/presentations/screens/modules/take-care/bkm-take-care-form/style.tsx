import {theme} from '@app/presentations/utils/styles'
import {StyleSheet} from 'react-native'
import {RFValue as fs} from 'react-native-responsive-fontsize'

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: 16,
    marginBottom: 70,
  },
  submitButton: {
    marginVertical: 16,
    backgroundColor: theme.colors.black,
  },
  submitButtonText: {
    fontSize: fs(13),
    color: theme.colors.white,
    fontWeight: 'normal',
  },
  wrapSubmitButton: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  scrollView: {
    paddingBottom: 56,
  },
  errorText: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    fontSize: 11,
  },
})
