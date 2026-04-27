import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { theme } from '@app/presentations/utils/styles'
import System from '@app/domain/services/System'
import { showErrorToast } from '@app/presentations/_shared-components/Toast'

const QRScannerScreen = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const device = useCameraDevice('back')
  const [hasPermission, setHasPermission] = useState(false)
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (!scanning || codes.length === 0) return
      setScanning(false)
      
      const qrCode = codes[0].value
      System.instance.bpbksService.scanQRCode(qrCode).then((res: any) => {
        const data = res?.data?.response
        if (data && route.params?.onScanSuccess) {
          route.params.onScanSuccess(data)
          navigation.goBack()
        }
      }).catch((err: any) => {
        showErrorToast(err?.response?.data?.message?.id || 'QR Code tidak valid')
        setTimeout(() => setScanning(true), 2000)
      })
    },
  })

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Membutuhkan izin kamera</Text>
      </View>
    )
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.scanArea} />
        <Text style={styles.instruction}>Arahkan kamera ke QR Code TPH</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  instruction: {
    position: 'absolute',
    bottom: 100,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
})

export default QRScannerScreen
