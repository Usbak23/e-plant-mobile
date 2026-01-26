import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

interface NotificationBadgeProps {
  count: number
  size?: number
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({count, size = 20}) => {
  if (count <= 0) return null

  return (
    <View style={[styles.badge, {width: size, height: size, borderRadius: size / 2}]}>
      <Text style={[styles.text, {fontSize: size * 0.6}]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
})

export default NotificationBadge