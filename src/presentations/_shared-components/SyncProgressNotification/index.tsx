import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import { useSyncQueue } from '@app/domain/states/sync-queue/hooks'
import { theme } from '@app/presentations/utils/styles'
import Icon from 'react-native-vector-icons/MaterialIcons'

export const SyncProgressNotification: React.FC = () => {
  const queue = useSyncQueue()
  const [visible, setVisible] = useState(false)
  const [slideAnim] = useState(new Animated.Value(-100))

  const syncingItems = queue.filter(item => item.status === 'syncing')
  const totalItems = queue.length
  const successItems = queue.filter(item => item.status === 'success').length
  const errorItems = queue.filter(item => item.status === 'error').length

  useEffect(() => {
    if (syncingItems.length > 0) {
      setVisible(true)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start()
    } else if (visible && totalItems > 0 && successItems + errorItems === totalItems) {
      // Auto-hide after 2 seconds when all done
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start(() => setVisible(false))
      }, 2000)
    }
  }, [syncingItems.length, totalItems, successItems, errorItems])

  if (!visible) return null

  const progress = totalItems > 0 ? ((successItems + errorItems) / totalItems) * 100 : 0

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="cloud-upload" size={20} color={theme.colors.accent} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Sinkronisasi Data</Text>
          <Text style={styles.subtitle}>
            {syncingItems.length > 0
              ? `Syncing ${syncingItems.length} item...`
              : `${successItems} berhasil${errorItems > 0 ? `, ${errorItems} gagal` : ''}`}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor:
                    errorItems > 0 ? theme.colors.danger : theme.colors.success,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress)}%
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light2,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.light2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.gray,
  },
  progressContainer: {
    width: 60,
    alignItems: 'center',
    gap: 4,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.light2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: theme.colors.gray,
    fontWeight: '600',
  },
})

export default SyncProgressNotification
