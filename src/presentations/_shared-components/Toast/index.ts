import Toast from 'react-native-toast-message'

interface IPToast {
  message?: string
  type?: 'info' | 'success' | 'error'
}

export default function showToast(props: IPToast) {
  const {type, message} = props
  Toast.show({
    type,
    position: 'bottom',
    text1: 'Attention!',
    text2: message,
    visibilityTime: 1000 * 6,
    autoHide: true,
    bottomOffset: 115,
    // topOffset: heightPercentageToDP(100) / 5,
  })
}

export function hideToast() {
  Toast.hide()
}

export function showErrorToast(message: string) {
  showToast({message, type: 'error'})
}

export function showSuccessToast(message: string) {
  showToast({message, type: 'success'})
}

export function showInfoToast(message: string) {
  showToast({message, type: 'info'})
}
