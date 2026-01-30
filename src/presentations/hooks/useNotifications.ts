import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import FirebaseNotificationService from '@app/domain/services/firebase/FirebaseNotificationService'
import { actions, RootStateType } from '@app/domain/states/store'
import Routes from '@app/presentations/navigation/Routes'
import { NotificationType } from '@app/model/eplant/Notification'
import { showSuccessToast, showErrorToast } from '@app/presentations/_shared-components/Toast'

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const notification = useSelector((state: RootStateType) => state.notification)

  useEffect(() => {
    initializeNotifications()
  }, [])

  // Handle device registration success
  useEffect(() => {
    if (notification?.registerDevice?.data) {
      console.log('Device registration success:', notification.registerDevice.data)
      showSuccessToast('Device registered for notifications')
      dispatch(actions.notification.clearNotificationStatus())
    }
  }, [notification?.registerDevice?.data, dispatch])

  // Handle device registration error
  useEffect(() => {
    if (notification?.registerDevice?.error) {
      console.log('Device registration error:', notification.registerDevice.error)
      
      // Suppress 502 error karena data tetap masuk DB
      if (notification.registerDevice.error.code !== '502') {
        showErrorToast('Failed to register device for notifications')
      }
      
      dispatch(actions.notification.clearNotificationStatus())
    }
  }, [notification?.registerDevice?.error, dispatch])

  const initializeNotifications = async () => {
    // Request permission
    const hasPermission = await FirebaseNotificationService.requestPermission()
    if (!hasPermission) {
      Alert.alert('Permission', 'Notification permission denied')
      return
    }

    // Get FCM token and device info
    const token = await FirebaseNotificationService.getToken()
    const deviceInfo = await FirebaseNotificationService.getDeviceInfo()
    
    setFcmToken(token)
    
    // Register device with backend
    if (token) {
      dispatch(actions.notification.registerDevice.request({
        loading: true,
        data: {
          fcmToken: token,
          platform: deviceInfo.platform,
          deviceId: deviceInfo.deviceId
        }
      }))
    } else {
      showErrorToast('Failed to get FCM token')
    }

    // Listen for token refresh
    const unsubscribeTokenRefresh = FirebaseNotificationService.onTokenRefresh(async (newToken) => {
      setFcmToken(newToken)
      const deviceInfo = await FirebaseNotificationService.getDeviceInfo()
      
      // Re-register device with new token
      dispatch(actions.notification.registerDevice.request({
        loading: true,
        data: {
          fcmToken: newToken,
          platform: deviceInfo.platform,
          deviceId: deviceInfo.deviceId
        }
      }))
    })

    // Handle foreground messages
    const unsubscribeForeground = FirebaseNotificationService.onMessage((message) => {
      Alert.alert(
        message.notification?.title || 'Notification',
        message.notification?.body || 'You have a new message',
        [
          { text: 'OK', onPress: () => handleNotificationNavigation(message) }
        ]
      )
      
      // Refresh unread count
      dispatch(actions.notification.getUnreadCount.request({ loading: false }))
    })

    // Handle notification opened app
    const unsubscribeOpened = FirebaseNotificationService.onNotificationOpenedApp((message) => {
      handleNotificationNavigation(message)
    })

    // Check if app was opened from notification (quit state)
    const initialNotification = await FirebaseNotificationService.getInitialNotification()
    if (initialNotification) {
      handleNotificationNavigation(initialNotification)
    }

    return () => {
      unsubscribeTokenRefresh()
      unsubscribeForeground()
      unsubscribeOpened()
    }
  }

  const handleNotificationNavigation = (message: any) => {
    const { data } = message
    
    // Navigate based on notification type
    if (data?.type === NotificationType.RKT_SUBMISSION || 
        data?.type === NotificationType.RKT_APPROVED || 
        data?.type === NotificationType.RKT_REJECTED) {
      navigation.navigate(Routes.APPROVAL as never)
    }
    
    // Mark notification as read if ID is provided
    if (data?.notificationId) {
      dispatch(actions.notification.markAsRead.request({
        loading: true,
        data: { notificationId: data.notificationId }
      }))
    }
  }

  const refreshNotifications = () => {
    dispatch(actions.notification.getNotifications.request({ loading: true }))
    dispatch(actions.notification.getUnreadCount.request({ loading: false }))
  }

  const markAllAsRead = () => {
    dispatch(actions.notification.markAllAsRead.request({ loading: true }))
  }

  return {
    fcmToken,
    refreshNotifications,
    markAllAsRead,
    handleNotificationNavigation
  }
}