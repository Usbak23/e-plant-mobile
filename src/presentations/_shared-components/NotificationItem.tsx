import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {INotification, NotificationType} from '@app/model/eplant/Notification'

interface NotificationItemProps {
  notification: INotification
  onPress: (notification: INotification) => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({notification, onPress}) => {
  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.RKT_APPROVED:
        return '#34C759'
      case NotificationType.RKT_REJECTED:
        return '#FF3B30'
      case NotificationType.RKT_SUBMISSION:
        return '#007AFF'
      case NotificationType.RKT_FINAL_APPROVED:
        return '#30D158'
      default:
        return '#8E8E93'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <TouchableOpacity
      style={[styles.container, !notification.isRead && styles.unread]}
      onPress={() => onPress(notification)}
    >
      <View style={[styles.indicator, {backgroundColor: getTypeColor(notification.type)}]} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.date}>{formatDate(notification.createdAt)}</Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  unread: {
    backgroundColor: '#F2F2F7',
  },
  indicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
    alignSelf: 'center',
  },
})

export default NotificationItem