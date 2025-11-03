import IStdEntity from '../commons/IStdEntity'
import {IBlockRow} from './Block'

export interface BkmEmployee {
  userId: string
  supervisionId: string
  workStatusId: string
  blockId: string
  workResultHa: number
  hkAmount: number
  bkmMaterials: BkmMaterials[]
}
export interface BkmMaterials {
  materialId: string
  qty: number
}

export interface Uom {
  id: string
  name: string
}

export interface Material {
  id: string
  name: string
  code: string
  location: string
  minStock: number
  isLessThanStock: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  uom: Uom
  qty: number
}

export interface IBKMTakeCareFormDataCreate {
  tempId?: string
  divisionId: string
  foremanId: string
  date: string
  supervisionId?: string
  workStatusId?: string
  bkmEmployee: BkmEmployee[]
  subActivityId: string
  subActivity: any
  wages: string
  typeEmployee: string
}

export interface IBKMTakeCareFormDataUpdate {
  tempId?: string
  id?: string
  divisionId: string
  date: string
  userId: string
  supervisionId: string
  workStatusId: string
  blockId: string
  workResultHa: number
  hkAmount: number
  bkmMaterials: BkmMaterials[]
  subActivityId: string
  subActivity: any
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

export interface IBKMTakeCareRow {
  id: string
  date: Date
  status: string
  foreman: Foreman
}

export interface User {
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
  role?: Role
  tokenExpired?: any
  isApproved: boolean
  isActive: boolean
  registerDate: Date
  isEmailConfirm: boolean
  deletedAt?: any
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

export interface BkmEmployee2 {
  id: string
  workResultHa: number
  hkAmount: number
  empty_bkm: boolean
  employee_do_not_take_attendance: boolean
  user: User
  role: Role
  supervision: IStdEntity
  workStatus: IStdEntity
  block: IBlockRow
  typeEmployee: string
  wages: string
  bkmMaterials: {
    materialId?: string
    name?: string
    material: Material
    qty: number
  }[]
  subActivity: {
    id: string
    accountNumber: string
    name: string
    description: string
    category: string
    deletedAt: null
  }
}

export interface IBKMTakeCareDetail {
  id: string
  date: string
  status: string
  division?: {
    id: string
    name: string
  }
  foreman?: {
    id: string
    nip: string
    name: string
  }
  bkmEmployees: BkmEmployee2[]
  bkmMaterials: {
    material: Material
    qty: number
  }[]
  user: User
  subActivity: {
    id: string
    accountNumber: string
    name: string
    description: string
    category: string
    deletedAt: null
  }
}
