import {GeoJSON} from 'geojson'

export const isGeoJSONExist = (kml: GeoJSON | null | undefined) => {
  if (kml == null || kml == undefined) {
    return false
  }
  if (typeof kml === 'object') {
    return Object.keys(kml).length !== 0
  }
  return true
}

export const isShouldGeoJSONNull = (geoJson: GeoJSON | null | undefined) => {
  if (geoJson == null || geoJson == undefined) {
    return null
  }

  if (typeof geoJson === 'object') {
    return Object.keys(geoJson).length == 0 ? null : geoJson
  }
  return null
}
