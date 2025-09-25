import {theme} from '@app/presentations/utils/styles'
import {StyleSheet} from 'react-native'

export const firstIndicatorStyles = {
  stepIndicatorSize: 26,
  stepStrokeWidth: 2,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: theme.colors.white,
  stepStrokeUnFinishedColor: theme.colors.grey,
  stepStrokeFinishedColor: theme.colors.white,
  separatorFinishedColor: theme.colors.black,
  separatorUnFinishedColor: theme.colors.lightGrey,
  stepIndicatorFinishedColor: theme.colors.black,
  stepIndicatorUnFinishedColor: theme.colors.white,
  stepIndicatorCurrentColor: theme.colors.black,
  stepIndicatorLabelFontSize: 11,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: 'white',
  stepIndicatorLabelFinishedColor: theme.colors.white,
  stepIndicatorLabelUnFinishedColor: theme.colors.grey,
  labelColor: '#666666',
  labelSize: 10,
  currentStepLabelColor: theme.colors.black,
}

export const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  body: {
    marginHorizontal: 20,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: theme.colors.grey,
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: 'red',
  },
  scrollView: {
    paddingBottom: 56,
  },
})
