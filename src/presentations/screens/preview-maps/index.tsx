import React, {useEffect, useState} from 'react'
import MapView, {PROVIDER_GOOGLE, Geojson, MapEvent} from 'react-native-maps'
import {Linking, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/core'
import {Text} from '@app/presentations/_shared-components'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {theme} from '@app/presentations/utils/styles'

// interface IMapsPreviewProps {
//   geoJson: any
// }
const defaultLatLng = {
  latitude: -6.879704,
  longitude: 109.125595,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}

const MapsPreview = () => {
  const navigation: any = useNavigation()
  const routes: any = useRoute()
  const geoJSON = routes?.params?.geoJSON
  const [defaultMidPoint, setDefaultMidPoint] = useState(defaultLatLng)
  const [mapsGeoJSON, setMapsGeoJSON] = useState(geoJSON)

  const checkIsAllEmpty = () => {
    return geoJSON?.features == undefined
  }

  const updateDefaultMidPoint = () => {
    const midPoint = geoJSON?.features?.find((feature: any) => feature.geometry.type == 'Point')
    if (midPoint) {
      const longitude = midPoint.geometry.coordinates[0]
      const latitude = midPoint.geometry.coordinates[1]
      setDefaultMidPoint({
        ...defaultMidPoint,
        latitude: latitude,
        longitude: longitude,
      })
    } else {
      const polygon = geoJSON?.features?.find((feature: any) => feature.geometry.type == 'Polygon')
      if (polygon) {
        const longitude = polygon.geometry.coordinates[0][0][0]
        const latitude = polygon.geometry.coordinates[0][0][1]
        setDefaultMidPoint({
          ...defaultMidPoint,
          latitude: latitude,
          longitude: longitude,
        })
      }
    }
  }

  const onMarkerPress = async (event: any) => {
    if (Platform.OS == 'android') {
      const lat = event.feature.geometry.coordinates[1]
      const lng = event.feature.geometry.coordinates[0]

      if (lat && lng) {
        await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`)
      }
    }
  }

  useEffect(() => {
    updateDefaultMidPoint()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={defaultMidPoint}>
        {mapsGeoJSON && (
          <Geojson
            geojson={mapsGeoJSON}
            strokeColor="#F0B10D"
            fillColor="rgba(240, 177, 13, 0.12)"
            strokeWidth={4}
            onPress={(event: MapEvent) => onMarkerPress(event)}
          />
        )}
      </MapView>
      <View
        style={{
          flex: 1,
          margin: 8,
          top: 0,
          alignSelf: 'flex-start',
          alignItems: 'center',
          position: 'absolute',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}>
          <View style={styles.button}>
            <Icon name="arrow-left" size={14} color={theme.colors.textThinBlack} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default MapsPreview

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    height: 40,
    width: 40,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
