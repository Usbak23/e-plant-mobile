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
import { useNetInfo } from '@react-native-community/netinfo'

const QRScannerScreen = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const device = useCameraDevice('back')
  const [hasPermission, setHasPermission] = useState(false)
  const [scanning, setScanning] = useState(true)

  // Network status
  const netInfo = useNetInfo()
  const isOnline = netInfo.isConnected && netInfo.isInternetReachable !== false

  // Get TPH data from Redux (cached for offline)
  const tphAll = useSelector((state: RootStateType) => state.tph?.tphAll?.data || [])
  const blockAll = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  const tphCacheEmpty = !tphAll || tphAll.length === 0
  const blockCacheEmpty = !blockAll || blockAll.length === 0

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const parseQRCodeOffline = (qrCode: string) => {
    try {
      const trimmedCode = qrCode.trim()

      // QR format wajib: "I/A01/043:3" (kode TPH + ":" + nomor versi print)
      const colonIdx = trimmedCode.lastIndexOf(':')
      if (colonIdx === -1) {
        throw new Error('QR Code tidak valid atau versi lama. Gunakan QR Code terbaru.')
      }

      const tphCode = trimmedCode.substring(0, colonIdx).trim()
      const scannedVersion = parseInt(trimmedCode.substring(colonIdx + 1).trim(), 10)
      if (!tphCode || isNaN(scannedVersion)) {
        throw new Error('Format QR Code tidak valid.')
      }

      const upperCode = tphCode.toUpperCase()
      const tph = tphAll.find((t: any) =>
        t.name?.toUpperCase() === upperCode ||
        t.code?.toUpperCase() === upperCode
      )

      if (!tph) {
        const cacheStatus = tphAll.length === 0 
          ? 'Cache TPH kosong. Login sekali saat online untuk sync data.' 
          : `TPH "${tphCode}" tidak ditemukan (${tphAll.length} TPH di cache).`
        throw new Error(cacheStatus)
      }

      // Validasi versi print — wajib ada di cache dan harus cocok/lebih baru
      const activeVersion = tph.printVersion ?? tph.print_version ?? null
      if (activeVersion === null) {
        throw new Error(`Data TPH "${tphCode}" belum memiliki versi. Lakukan sync ulang saat online.`)
      }
      if (scannedVersion < activeVersion) {
        throw new Error(`QR Code tidak aktif (versi ${scannedVersion}, versi aktif ${activeVersion}). Gunakan QR Code terbaru.`)
      }

      const block = blockAll.find((b: any) => b.id === tph.block?.id)
      const plantingYear = tph.plantingYear || block?.plantingYear || []

      return {
        tphId: tph.id,
        blockId: tph.block?.id || block?.id,
        plantingYear: Array.isArray(plantingYear) ? plantingYear : [plantingYear],
        tph,
        block: block || tph.block,
      }
    } catch (error: any) {
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
      console.log('🌐 Network status:', isOnline ? 'ONLINE' : 'OFFLINE')
      console.log('💾 Cache status: TPH =', tphAll.length, ', Block =', blockAll.length)

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
        // Check cache availability
        if (tphCacheEmpty) {
          console.error('❌ Data TPH kosong, tidak bisa scan offline')
          showErrorToast('Mode offline: Data TPH belum tersedia. Login sekali saat online untuk sync data.')
          setTimeout(() => setScanning(true), 2000)
          return
        }

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
        {/* Network Status Indicator */}
        <View style={[styles.statusBadge, isOnline ? styles.statusOnline : styles.statusOffline]}>
          <Icon name={isOnline ? 'wifi' : 'wifi-off'} size={16} color="white" />
          <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>

        {/* Cache Warning */}
        {!isOnline && tphCacheEmpty && (
          <View style={styles.warningBanner}>
            <Icon name="warning" size={20} color="#856404" />
            <Text style={styles.warningText}>Data TPH belum tersedia untuk mode offline</Text>
          </View>
        )}

        {!isOnline && !tphCacheEmpty && (
          <View style={styles.infoBanner}>
            <Icon name="info" size={16} color="#004085" />
            <Text style={styles.infoText}>Mode offline: {tphAll.length} TPH tersedia</Text>
          </View>
        )}

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
  statusBadge: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  statusOnline: {
    backgroundColor: 'rgba(40, 167, 69, 0.9)',
  },
  statusOffline: {
    backgroundColor: 'rgba(220, 53, 69, 0.9)',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  warningBanner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 243, 205, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9,
  },
  warningText: {
    flex: 1,
    color: '#856404',
    fontSize: 13,
    marginLeft: 8,
  },
  infoBanner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(204, 229, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9,
  },
  infoText: {
    flex: 1,
    color: '#004085',
    fontSize: 13,
    marginLeft: 8,
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
