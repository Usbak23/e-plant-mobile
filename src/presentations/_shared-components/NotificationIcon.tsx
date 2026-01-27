import React from 'react'
import {TouchableOpacity, View, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useNavigation} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import {RootStateType} from '@app/domain/states/store'
import NotificationBadge from './NotificationBadge'
import Routes from '@app/presentations/navigation/Routes'

interface NotificationIconProps {
  size?: number
  color?: string
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  size = 24,
  color = '#000'
}) => {
  const navigation = useNavigation()
  const notification = useSelector((state: RootStateType) => state.notification)
  
  const unreadCount = notification?.unreadCount?.data?.unreadCount || 0

  const handlePress = () => {
    navigation.navigate(Routes.NOTIFICATION as never)
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="notifications" size={size} color={color} />
        {unreadCount > 0 && (
          <NotificationBadge count={unreadCount} size={16} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconContainer: {
    position: 'relative',
  },
})

export default NotificationIcon