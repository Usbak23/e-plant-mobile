import IStdEntity from '@models/commons/IStdEntity'
import { Division } from './Division'

export interface IOrganizationRowAll {
  id: string
  name: string
  address: string
  phone: string
  manajerEstate: string
  isDeleted: boolean
  createdAt: Date
  createdBy: number
  updatedAt: Date
  updatedBy: number
  divisions: Division[]
  organizationArea?: number
  usedArea?: number | null
  unusedArea?: number | null
  totalUser?: number
}

export interface IOrganizationRow extends IOrganizationRowAll {
  district: IStdEntity
}

export interface IOrganizationDetail {
  id: string
  name: string
  address: string
  phone: string
  province: IStdEntity
  district: IStdEntity
  manajerEstate: IStdEntity
  divisions: number
  organizationArea?: number
  usedArea?: number | null,
  unusedArea?: number | null
}

export interface IOrganizationFormData {
  id?: number
  name: string
  address: string
  provinceId: string
  districtId: string
  phone: string
  manajerEstate: number,
  organizationArea?: number,
  usedArea?: number,
  unusedArea?: number
}
