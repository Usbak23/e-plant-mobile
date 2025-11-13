import {Division} from './Division'

export interface IArvisUserData {
  id: string
  nip: string
  email: string
  name: string
}

export interface IArvisCredential {
  data: IArvisUserData
  name: string
  idToken: string
  expiresIn: number
  refreshToken: string
  expiresDate: number
  expiresDateRefreshtoken: number
}

export interface IUserRow {
  id: string
  nip: string
  email: string | null
  name: string
  address: string
  phoneNumber: string
  typeEmployee: ITypeEmployee
  organization: string
  userDivisions: {
    id: string
    division: Division
  }[]
  role: IRole
}

export interface ITypeEmployee {
  id: string
  name: string
  category: string
}

// #353
export interface IRole {
  id: string
  name: string
  // roleCategory?: string | null
  roleCategory?: string[]
}

export interface IUserStd {
  id: string
  nip: string
  name: string
  division: Division
  position?: string
}

export interface IEmployeeCost {
  id: string
  nip: string
  email: string | null
  name: string
  address: string
  phoneNumber: string
  gender: string
  organization: string
  approver: null
  token: null
  tokenExpired: null
  isApproved: boolean
  isActive: boolean
  registerDate: string
  isEmailConfirm: boolean
  typeEmployee: {
    id: string
    name: string
  }
  role: IRole
  userDivisions: {
    id: string
    division: {
      id: string
      name: string
      organization: {
        id: string
        name: string
      }
    }
  }[]
  costEmployee: {
    id: string
    wages: number
    qtyMin: number
    ripeFruitNotHarvested: number
    sunFruit: number
    looseOnThePlate: number
    looseOnTph: number
    brokenMidrib: number
    midribOnThePlate: number
    rawFruit: number
    rottenFruit: number
    overripeFruit: number
    longHandle: number
    looseFruitNotQuoted: number
  }
}

export interface IUserCost {
  totalEmployee: number
  totalCost: number
  averageCost: number
  employee: IEmployeeCost[]
}

// 353
export interface ICurrentUserRoleInfo {
  id: string
  name: string
  // roleCategory: string
  roleCategory?: string[]
  roleModules: ICurrentUserRoleModuleInfo[]
  createdAt: string
  updatedAt: string
  isSuperAdmin?: boolean
}

export interface ICurrentUserRoleModuleInfo {
  id: string
  slug: string
  name: string
  module: string
  moduleSlug: string
}

export interface ICurrentUserPersonalInfo {
  id: string
  nip: string
  email?: string | null
  imageProfile?: string | null
  passwordGenerate: string
  name: string
  address: string
  phoneNumber: string
  gender: string
  // organization: string
  // approver: null
  isApproved: boolean
  isActive: boolean
  registerDate: string
  isEmailConfirm: boolean
  typeEmployee: {
    id: string
    name: string
  }
}

export interface ICurrentUserDivisionInfo {
  id: string
  division: {
    id: string
    name: string
    area: number
    blocks: {
      id: string
      code: string
      blockArea: number
      totalTree: number
    }[]
    organization: {
      id: string
      name: string
      address: string
      phone: string
    }
  }
}

export interface ICurrentUserApproval {
  id: string
  nip: string
  email?: string
  name: string
  address: string
  phoneNumber: string
  gender: string
  organization: string
  approver: string | null
  isApproved: boolean
  isActive: boolean
  registerDate: string
  isEmailConfirm: boolean
  // 353
  role: {
    id: string
    name: string
    // roleCategory: null | string
    roleCategory?: string[]
    createdAt: string
    updatedAt: string
  }
}

export interface ICurrentUser extends ICurrentUserPersonalInfo {
  role: ICurrentUserRoleInfo
  userDivisions: ICurrentUserDivisionInfo[]
  approvals: ICurrentUserApproval[]
}
