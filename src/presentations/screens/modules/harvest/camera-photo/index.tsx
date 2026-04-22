import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { theme } from '@app/presentations/utils/styles'

const CameraPhotoScreen = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const device = useCameraDevice('back')
  const camera = useRef<Camera>(null)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const takePhoto = async () => {
    try {
      const photo = await camera.current?.takePhoto({ quality: 70 })
      if (photo && route.params?.onPhotoCaptured) {
        route.params.onPhotoCaptured({ uri: `file://${photo.path}`, type: 'image/jpeg', fileName: 'photo.jpg' })
        navigation.goBack()
      }
    } catch (e) {}
  }

  if (!hasPermission || !device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive photo />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 },
  closeButton: { position: 'absolute', top: 50, right: 20 },
  captureButton: {
    width: 70, height: 70, borderRadius: 35,
    borderWidth: 4, borderColor: 'white',
    justifyContent: 'center', alignItems: 'center',
  },
  captureInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'white' },
})

export default CameraPhotoScreen
