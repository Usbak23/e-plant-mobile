import {useDispatch, useSelector} from 'react-redux'
import {RootStateType, actions} from '@domain/states/store'

export const useNotificationState = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state: RootStateType) => state.notification)

  const getNotifications = (limit?: number) => {
    dispatch(actions.notification.getNotifications.request({loading: true, data: {limit}}))
  }

  const getUnreadCount = () => {
    dispatch(actions.notification.getUnreadCount.request({loading: true}))
  }

  const markAsRead = (notificationId: string) => {
    dispatch(actions.notification.markAsRead.request({loading: true, data: {notificationId}}))
  }

  const markAllAsRead = () => {
    dispatch(actions.notification.markAllAsRead.request({loading: true}))
  }

  const registerDevice = (fcmToken: string, platform: 'android' | 'ios', deviceId: string) => {
    dispatch(actions.notification.registerDevice.request({
      loading: true, 
      data: {fcmToken, platform, deviceId}
    }))
  }

  const clearStatus = () => {
    dispatch(actions.notification.clearNotificationStatus())
  }

  return {
    notification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    registerDevice,
    clearStatus
  }
}