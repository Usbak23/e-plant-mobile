import {IUom} from './Master'
import {IOrganizationDetail, IOrganizationRow} from './Organization'

export interface INormMaterialMaterial {
  id: string
  rawMaterial: {
    id: string
    name: string
    code: string
    location: string
    minStock: number
    type: string
    uom: {
      id: string
      name: string
    }
  }
  qty: number
  price: number
  unit: number
  unitPokok: number
}

export interface INormMaterial {
  id: string
  year: number
  organization: {
    id: string
    name: string
    address: string
    phone: string
  }
  material: INormMaterialMaterial[]
}

export enum MaterialType {
  PUPUK = 'Pupuk',
  NON_PUPUK = 'Non Pupuk',
}

export interface IRawMaterialFormData {
  id?: string
  organizationId: string
  uomId: string
  name: string
  code: string
  location: string
  minStock: number
  purchaseOrder: string
  qty: number
  price: number
  date: string
  type: MaterialType | string
}

export interface IRawMaterialUpdateFormData {
  id?: string
  organizationId: string
  uomId: string
  name: string
  code: string
  location: string
  minStock: number
}

export interface IRawMaterialUOM {
  id: string
  name: string
}

export interface IRawMaterialRow {
  id: string
  type: 'Pupuk' | 'Non Pupuk'
  name: string
  code: string
  price: string
  location: string
  minStock: number
  isLessThanStock: boolean
  uom: IRawMaterialUOM
  qty: string | null
  organization?: {
    id: string
    name: string
  }
  unitPrice: number
}

export interface IRawMaterialDetail {
  id: string
  name: string
  code: string
  location: string
  minStock: number
  uom: IUom
  unitPrice: number
  puchaseStock: number
  stock: number | null
  usedStock: number
  totalStock: number
  totalPrice: number
  organization: IOrganizationDetail
  rawMaterialHistories?: IPurchasementHistoryRow[] | null
  type: 'Pupuk' | 'Non Pupuk' | string
}

export interface IRawPurchasementHistoryFormData {
  rawMaterialId?: string
  id?: string
  qty: number
  date: string
  price: number
  purchaseOrder: string
}

export interface IRawReceptionHistoryFormData {
  id?: string
  qtyAccepted: number
  dateAccepted: string
}

export interface IPurchasementHistoryRow {
  id: string
  qty: number
  price: number
  purchaseOrder: string
  date: string
  dateAccepted: string | null
  rawMaterial: IRawMaterialRow
  user: {
    id: string
    name: string
  }
}

export interface IReceptionHistoryRow {
  id: string
  qty: number
  qtyAccepted: number | null
  date: string
  purchaseOrder: string
  dateAccepted: string | null
  consignee: null | {
    id: string
    name: string
  }
}
