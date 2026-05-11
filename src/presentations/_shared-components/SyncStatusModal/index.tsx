import React from 'react'
import {View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, FlatList} from 'react-native'
import {useSyncQueue} from '@app/domain/states/sync-queue/hooks'
import {theme} from '@app/presentations/utils/styles'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {ISyncQueueItem} from '@app/domain/states/sync-queue/actions'

interface SyncStatusModalProps {
  visible: boolean
  onClose: () => void
}

export const SyncStatusModal: React.FC<SyncStatusModalProps> = ({visible, onClose}) => {
  const queue = useSyncQueue()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning || '#FFA500'
      case 'syncing':
        return theme.colors.info || '#2196F3'
      case 'success':
        return theme.colors.success || '#4CAF50'
      case 'error':
        return theme.colors.danger
      default:
        return theme.colors.gray
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'schedule'
      case 'syncing':
        return 'cloud-upload'
      case 'success':
        return 'check-circle'
      case 'error':
        return 'error'
      default:
        return 'help'
    }
  }

  const renderItem = ({item}: {item: ISyncQueueItem}) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.itemTitleRow}>
          <Icon
            name={getStatusIcon(item.status)}
            size={20}
            color={getStatusColor(item.status)}
          />
          <Text style={styles.itemType}>{item.type}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(item.status)},
            ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.itemTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      {item.error && (
        <Text style={styles.errorText}>{item.error}</Text>
      )}
    </View>
  )

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Sync Status</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>

          {queue.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon
                name="check-circle"
                size={48}
                color={theme.colors.success}
              />
              <Text style={styles.emptyText}>Semua data sudah tersinkronisasi</Text>
            </View>
          ) : (
            <>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Pending</Text>
                  <Text style={styles.statValue}>
                    {queue.filter(i => i.status === 'pending').length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Syncing</Text>
                  <Text style={styles.statValue}>
                    {queue.filter(i => i.status === 'syncing').length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Success</Text>
                  <Text style={styles.statValue}>
                    {queue.filter(i => i.status === 'success').length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Error</Text>
                  <Text style={styles.statValue}>
                    {queue.filter(i => i.status === 'error').length}
                  </Text>
                </View>
              </View>

              <FlatList
                data={queue}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                scrollEnabled
                style={styles.list}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.light2,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  list: {
    paddingHorizontal: 16,
    maxHeight: 400,
  },
  itemContainer: {
    backgroundColor: theme.colors.light2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  itemHeader: {
    marginBottom: 8,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemTime: {
    fontSize: 11,
    color: theme.colors.gray,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.danger,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.gray,
    marginTop: 12,
  },
})

export default SyncStatusModal
