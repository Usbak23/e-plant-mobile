import React, {useEffect} from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {useNotificationState} from '@app/domain/states/notification/hooks'
import {useNotifications} from '@app/presentations/hooks/useNotifications'
import NotificationList from '@app/presentations/_shared-components/NotificationList'
import {INotification, NotificationType} from '@app/model/eplant/Notification'
import Routes from '@app/presentations/navigation/Routes'

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation()
  const {notification, getNotifications, markAsRead, markAllAsRead} = useNotificationState()
  const {handleNotificationNavigation} = useNotifications()

  useEffect(() => {
    getNotifications()
  }, [])

  const handleRefresh = () => {
    getNotifications()
  }

  const handleNotificationPress = (notif: INotification) => {
    // Mark as read
    if (!notif.isRead) {
      markAsRead(notif.id)
    }

    // Navigate based on type
    if (notif.type === NotificationType.RKT_SUBMISSION || 
        notif.type === NotificationType.RKT_APPROVED || 
        notif.type === NotificationType.RKT_REJECTED ||
        notif.type === NotificationType.RKT_FINAL_APPROVED) {
      navigation.navigate(Routes.APPROVAL as never)
    }
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const notifications = notification?.notifications?.data?.data || []
  const loading = notification?.notifications?.loading || false
  const hasUnread = notifications.some(n => !n.isRead)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifikasi</Text>
        {hasUnread && (
          <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Tandai Semua Dibaca</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <NotificationList
        notifications={notifications}
        loading={loading}
        onRefresh={handleRefresh}
        onNotificationPress={handleNotificationPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  markAllText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
})

export default NotificationScreen