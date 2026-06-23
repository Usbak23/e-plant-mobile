import IStdEntity from '@app/models/commons/IStdEntity'
import {GeoJSON} from 'geojson'

export interface ITPHRowAll {
  id: string
  name: string
  geoJson: any
  fileGeoJson: string
  printVersion: number | null
  block?: any
}

export interface ITPHRow {
  id: string
  name: string
  geoJson: GeoJSON | null | undefined
  fileGeoJson: string
}

export interface Organization {
  id: string
  name: string
  address: string
  phone: string
  deletedAt?: any
}

export interface Division {
  id: string
  name: string
  area: number
  deletedAt?: any
  organization: Organization
}

export interface Block {
  id: string
  code: string
  blockArea: number
  totalTree: number
  plantingYear: string[]
  harvestChapel: string | number
  numberOfLine: number
  varieties: string[]
  fileGeoJson?: any
  geoJson: GeoJSON | null | undefined
  deletedAt?: any
  division: Division
}

export interface ITPHDetail {
  id: string
  name: string
  fileGeoJson?: any
  geoJson: GeoJSON | null | undefined
  deletedAt?: any
  block: Block
}

export interface ITPHFormData {
  id: string
  name: string
  geoJson: GeoJSON | null | undefined
  fileGeoJson: string | null | undefined
  blockId: string
}
