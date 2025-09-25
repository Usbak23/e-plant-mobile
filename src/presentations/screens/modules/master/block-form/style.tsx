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
  scrollView: {
    paddingBottom: 56,
  },
  yearPlantView: {
    paddingTop: 8,
    flexDirection: 'row',
  },
  errorText: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    fontSize: 11,
  },
  uploadKMLButton: {
    backgroundColor: '#F1F3F6',
    flexDirection: 'row',
  },
  modalContainer: {
    alignItems: 'center',
    padding: 16,
  },
  fileStatusView: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteFileButton: {
    borderRadius: 5,
    marginVertical: 16,
    backgroundColor: 'rgba(240, 177, 13, 0.15)',
    height: 40,
    width: 40,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
    alignItems: 'center',
  },
})
