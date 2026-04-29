export interface Organization {
  id: string
  name: string
  address: string
  phone: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
}

export interface Division {
  id: string
  name: string
  area: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  organization: Organization
}

// 353
export interface Role {
  id: string
  name: string
  // roleCategory: string
  roleCategory: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Foreman {
  id: string
  nip: string
  email: string
  password: string
  passwordGenerate?: any
  name: string
  address: string
  phoneNumber: string
  gender: string
  organization?: any
  approver: string
  token?: any
  tokenExpired?: any
  isApproved: boolean
  isActive: boolean
  registerDate: Date
  isEmailConfirm: boolean
  deletedAt?: any
  role: Role
}

export interface Bpbks {
  id: string
  date: Date
  totalLength: number
  division: Division
  foreman: Foreman
  gardenTonnage?: {
    id?: string
    item?: { id?: string; name?: string; serialNumber?: string }
  }
}

export interface Harvester {
  id: string
  nip: string
  email: string
  password: string
  passwordGenerate?: any
  name: string
  address: string
  phoneNumber: string
  gender: string
  organization?: any
  approver: string
  token?: any
  tokenExpired?: any
  isApproved: boolean
  isActive: boolean
  registerDate: Date
  isEmailConfirm: boolean
  deletedAt?: any
  role: Role
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
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
}

export interface Tph {
  id: string
  name: string
  fileGeoJson?: any
  geoJson?: any
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  block: Block
}

export interface Doc {
  id: string
  absent: boolean
  cutNumber: string
  numberOfLength: number
  loose: number
  plantingYear?: string
  ripeFruitChecked: number
  rawFruitChecked: number
  lateRipeChecked: number
  rottenFruitChecked: number
  longHandleChecked: number
  looseChecked: number
  harvester: Harvester
  tph: Tph
  bpbks: Bpbks
}

export interface IBPBKSResponse {
  bpbks: Bpbks
  docs: Doc[]
}

export type BPBKSSyncStatus = 'pending' | 'syncing' | 'synced' | 'failed'

export interface IBPBKSFormDataCreate {
  tempId?: string
  syncStatus?: BPBKSSyncStatus
  syncError?: string
  divisionId: string
  date: string
  foremanId: string
  harvesterId: string
  cutNumber: number | string
  gardenTonnageId?: string
  tphs: {
    cutNumber: number | string
    tphId: string
    numberOfLength: number
    loose: number
    ripeFruitChecked: number
    rawFruitChecked: number
    lateRipeChecked: number
    rottenFruitChecked: number
    longHandleChecked: number
    looseChecked: number
    plantingYear: string
  }[]
}

export interface IBPBKSFormDataUpdate {
  id?: string
  tempId?: string
  harvesterId: string
  cutNumber: number
  tphId: string
  numberOfLength: number
  loose: number
  ripeFruitChecked: number
  rawFruitChecked: number
  lateRipeChecked: number
  rottenFruitChecked: number
  longHandleChecked: number
  looseChecked: number
}
