import {theme} from '@app/presentations/utils/styles'
import {StyleSheet} from 'react-native'

export const stepIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 28,
  stepStrokeWidth: 2,
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
  currentStepIndicatorLabelFontSize: 12,
  stepIndicatorLabelCurrentColor: 'white',
  stepIndicatorLabelFinishedColor: theme.colors.white,
  stepIndicatorLabelUnFinishedColor: theme.colors.grey,
  labelColor: '#666666',
  labelSize: 10,
  currentStepLabelColor: theme.colors.black,
}

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    paddingBottom: 26,
  },
  body: {
    marginHorizontal: 20,
  },
  nextBtn: {
    marginBottom: 26,
    width: '50%',
    alignSelf: 'flex-end',
  },
})
