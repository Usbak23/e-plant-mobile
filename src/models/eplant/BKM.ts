import IStdEntity from '../commons/IStdEntity'
import { IBlockRow } from './Block'

export interface BkmEmployee {
  userId: string
  supervisionId: string
  workStatusId: string
  plantingYear?: string
  subActivityId?: string
  typeEmployee?: string
  workday?: string
  blockId: string
  workResultHa: number
  workResultKg?: number
  hkAmount: number
  categoryChapel?: string
}

export interface IBKMFormDataCreate {
  tempId?: string
  divisionId: string
  foremanId: string
  cutNumber: number | string
  date: string
  supervisionId?: string
  workStatusId?: string
  subActivityId?: string
  subActivity?: { label: string, value: string }
  typeEmployee?: string
  workday?: string
  bkmEmployee: BkmEmployee[]
}

export interface IBKMFormDataUpdate {
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
  categoryChapel?: string
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

export interface IBKMRow {
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
  plantingYear?: string | number
  workResultHa: number
  workResultKg?: number | string
  workDay?: string
  hkAmount: number
  empty_bkm: boolean
  employee_do_not_take_attendance: boolean
  user: User
  role: Role
  cutNumber: number | string
  supervision: IStdEntity
  workStatus: IStdEntity
  block: IBlockRow
}

export interface IBKMDetail {
  id: string
  date: Date
  status: string
  divisionId?: string
  foremanId?: string
  subActivityId?: string
  bkmEmployees: BkmEmployee2[]
  user: User
}
