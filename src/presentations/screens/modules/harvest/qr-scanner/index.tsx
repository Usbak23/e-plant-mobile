import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { theme } from '@app/presentations/utils/styles'
import System from '@app/domain/services/System'
import { showErrorToast } from '@app/presentations/_shared-components/Toast'
import { useSelector } from 'react-redux'
import { RootStateType } from '@app/domain/states/store'
import NetInfo from '@react-native-community/netinfo'

const QRScannerScreen = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const device = useCameraDevice('back')
  const [hasPermission, setHasPermission] = useState(false)
  const [scanning, setScanning] = useState(true)

  // Get TPH data from Redux (cached for offline)
  const tphAll = useSelector((state: RootStateType) => state.tph?.tphAll?.data || [])
  const blockAll = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const parseQRCodeOffline = (qrCode: string) => {
    try {
      console.log('📋 Raw QR Code:', qrCode)
      console.log('📋 QR Code length:', qrCode.length)
      
      // Trim whitespace
      const trimmedCode = qrCode.trim()
      
      // QR Code format adalah TPH Code (plain text): "I/A03/068"
      // Bukan JSON, jadi cari TPH berdasarkan code/name
      
      console.log('🔍 Searching TPH by code:', trimmedCode)
      console.log('🔍 Total TPH in cache:', tphAll.length)
      console.log('🔍 Total Block in cache:', blockAll.length)
      
      // Cari TPH berdasarkan code atau name
      const tph = tphAll.find((t: any) => 
        t.code === trimmedCode || 
        t.name === trimmedCode ||
        t.code?.toUpperCase() === trimmedCode.toUpperCase() ||
        t.name?.toUpperCase() === trimmedCode.toUpperCase()
      )

      if (!tph) {
        console.error('❌ TPH not found in cache')
        console.log('Available TPH codes:', tphAll.slice(0, 5).map((t: any) => t.code || t.name))
        throw new Error(`TPH "${trimmedCode}" tidak ditemukan di cache. Pastikan data sudah ter-sync.`)
      }

      console.log('✅ TPH found:', tph)
      
      // Cari block dari TPH
      const block = blockAll.find((b: any) => b.id === tph.block?.id)
      
      console.log('✅ Block found:', !!block)

      // Extract planting year dari block atau TPH
      const plantingYear = tph.plantingYear || block?.plantingYear || []

      return {
        tphId: tph.id,
        blockId: tph.block?.id || block?.id,
        plantingYear: Array.isArray(plantingYear) ? plantingYear : [plantingYear],
        tph: tph,
        block: block || tph.block,
      }
    } catch (error: any) {
      console.error('❌ Parse error:', error)
      throw new Error(error.message || 'QR Code tidak valid')
    }
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: async (codes) => {
      if (!scanning || codes.length === 0) return
      setScanning(false)
      
      const qrCode = codes[0].value
      console.log('📷 QR Code scanned:', qrCode)

      // Check network status
      const netInfoState = await NetInfo.fetch()
      const isOnline = netInfoState.isConnected && netInfoState.isInternetReachable !== false

      console.log('🌐 Network status:', isOnline ? 'ONLINE' : 'OFFLINE')

      // ONLINE: Hit API untuk validasi
      if (isOnline) {
        System.instance.bpbksService.scanQRCode(qrCode).then((res: any) => {
          const data = res?.data?.response
          if (data && route.params?.onScanSuccess) {
            console.log('✅ QR Code valid (from API):', data)
            route.params.onScanSuccess(data)
            navigation.goBack()
          }
        }).catch((err: any) => {
          console.error('❌ QR Code validation failed:', err)
          showErrorToast(err?.response?.data?.message?.id || 'QR Code tidak valid')
          setTimeout(() => setScanning(true), 2000)
        })
      } 
      // OFFLINE: Parse QR code secara lokal
      else {
        try {
          const data = parseQRCodeOffline(qrCode)
          console.log('✅ QR Code valid (offline mode):', data)
          
          if (route.params?.onScanSuccess) {
            route.params.onScanSuccess(data)
            navigation.goBack()
          }
        } catch (error: any) {
          console.error('❌ QR Code parsing failed (offline):', error.message)
          showErrorToast(error.message)
          setTimeout(() => setScanning(true), 2000)
        }
      }
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
