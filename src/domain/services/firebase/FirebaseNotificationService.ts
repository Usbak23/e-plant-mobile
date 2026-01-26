import messaging from '@react-native-firebase/messaging'
import { Alert, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

class FirebaseNotificationService {
  
  // Request permission for notifications
  async requestPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    return enabled
  }

  // Get FCM token
  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken()
      return token
    } catch (error) {
      console.error('Error getting FCM token:', error)
      return null
    }
  }

  // Get device info for registration
  async getDeviceInfo() {
    const deviceId = await DeviceInfo.getUniqueId()
    const platform = Platform.OS as 'android' | 'ios'
    return { deviceId, platform }
  }

  // Listen for token refresh
  onTokenRefresh(callback: (token: string) => void) {
    return messaging().onTokenRefresh(callback)
  }

  // Handle foreground messages
  onMessage(callback: (message: any) => void) {
    return messaging().onMessage(callback)
  }

  // Handle notification opened app
  onNotificationOpenedApp(callback: (message: any) => void) {
    return messaging().onNotificationOpenedApp(callback)
  }

  // Get initial notification (app opened from quit state)
  async getInitialNotification() {
    return await messaging().getInitialNotification()
  }

  // Set background message handler
  setBackgroundMessageHandler(handler: (message: any) => Promise<void>) {
    messaging().setBackgroundMessageHandler(handler)
  }
}

export default new FirebaseNotificationService()