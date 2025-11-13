import { Division } from './Division'
import { IUserStd } from './User'
import { GeoJSON } from 'geojson'

export interface IBlockFormData {
  id?: string
  divisionId: string
  code: string
  blockArea: number
  harvestChapel: string | number
  numberOfLine: number
  varieties: string[]
  harvestForeman: string | null
  careForeman: string | null
  harvestClerk: string | null
  geoJson: GeoJSON | null | undefined
  fileGeoJson: GeoJSON | null | undefined
  totalTree?: number
  plantingYear?: string[]
  //phase 3
  totalTreeEachYear?: string[]
  blockAreaEachYear?: string[]
  usedArea?: number | null
  unusedArea?: number | null
  bjr?: number
}

export interface IBlockRow {
  id: string
  code: string
  blockArea: number
  totalTree: number
  plantingYear: string[]
  harvestChapel: string | number
  numberOfLine: number
  varieties: string[]
  harvestForeman?: IUserStd | null
  careForeman?: IUserStd | null
  harvestClerk?: IUserStd | null
  fileGeoJson?: string | null | undefined
  geoJson?: GeoJSON | null | undefined
  division: Division
  tphs: number
  //phase3
  usedArea?: number | null
  unusedArea?: number | null
  sph?: number | null
  bjr?: number | null
  totalTreeEachYear?: string[]
  blockAreaEachYear?: string[]
}
