import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {usePendingSyncCount} from '@app/domain/states/sync-queue/hooks'
import {theme} from '@app/presentations/utils/styles'

interface SyncIndicatorBadgeProps {
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

export const SyncIndicatorBadge: React.FC<SyncIndicatorBadgeProps> = ({
  size = 'medium',
  showLabel = true,
}) => {
  const pendingCount = usePendingSyncCount()

  if (pendingCount === 0) return null

  const sizeConfig = {
    small: {badge: 20, text: 10},
    medium: {badge: 28, text: 12},
    large: {badge: 36, text: 14},
  }

  const config = sizeConfig[size]

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            width: config.badge,
            height: config.badge,
            borderRadius: config.badge / 2,
          },
        ]}>
        <Text style={[styles.badgeText, {fontSize: config.text}]}>
          {pendingCount > 99 ? '99+' : pendingCount}
        </Text>
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {pendingCount === 1 ? 'Pending Sync' : `${pendingCount} Pending Sync`}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: '500',
  },
})

export default SyncIndicatorBadge
