import React from 'react'
import {FlatList, RefreshControl, View, Text, StyleSheet} from 'react-native'
import {INotification} from '@app/model/eplant/Notification'
import NotificationItem from './NotificationItem'

interface NotificationListProps {
  notifications: INotification[]
  loading: boolean
  onRefresh: () => void
  onNotificationPress: (notification: INotification) => void
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  onRefresh,
  onNotificationPress,
}) => {
  const renderItem = ({item}: {item: INotification}) => (
    <NotificationItem notification={item} onPress={onNotificationPress} />
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Tidak ada notifikasi</Text>
    </View>
  )

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
})

export default NotificationList