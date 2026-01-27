import React, {useEffect, useState} from 'react'
import {View, Text, Button, Alert, StyleSheet} from 'react-native'
import messaging from '@react-native-firebase/messaging'
import {useNotificationState} from '@app/domain/states/notification/hooks'

const FCMDebugScreen: React.FC = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<string>('')
  const {registerDevice} = useNotificationState()

  useEffect(() => {
    checkPermissionAndGetToken()
  }, [])

  const checkPermissionAndGetToken = async () => {
    try {
      // Check permission
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      setPermission(enabled ? 'Granted' : 'Denied')

      if (enabled) {
        // Get token
        const token = await messaging().getToken()
        setFcmToken(token)
        console.log('FCM Token:', token)
      }
    } catch (error) {
      console.error('Error getting FCM token:', error)
      Alert.alert('Error', 'Failed to get FCM token')
    }
  }

  const testRegisterDevice = () => {
    if (fcmToken) {
      registerDevice(fcmToken, 'android', 'test-device-id')
      Alert.alert('Success', 'Device registration request sent')
    } else {
      Alert.alert('Error', 'No FCM token available')
    }
  }

  const copyToken = () => {
    if (fcmToken) {
      Alert.alert('Token', fcmToken)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FCM Debug</Text>
      
      <Text style={styles.label}>Permission Status:</Text>
      <Text style={styles.value}>{permission}</Text>
      
      <Text style={styles.label}>FCM Token:</Text>
      <Text style={styles.token} numberOfLines={0}>
        {fcmToken || 'No token available'}
      </Text>
      
      <Button title="Refresh Token" onPress={checkPermissionAndGetToken} />
      <Button title="Copy Token" onPress={copyToken} disabled={!fcmToken} />
      <Button title="Test Register Device" onPress={testRegisterDevice} disabled={!fcmToken} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  token: {
    fontSize: 12,
    color: '#333',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
})

export default FCMDebugScreen