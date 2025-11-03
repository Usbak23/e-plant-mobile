import IStdEntity from '../commons/IStdEntity'

export interface Organization {
  id: string
  name: string
  address: string
  phone: string
}

export interface Division {
  id: string
  name: string
  area: number
  organization: Organization
}

export interface Block {
  id: string
  code: string
  blockArea: number
  totalTree: number
  plantingYear?: any
  harvestChapel: number
  numberOfLine: number
  varieties?: any
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  division: Division
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
  tokenExpired?: any
  isApproved: boolean
  isActive: boolean
  registerDate: Date
  isEmailConfirm: boolean
  deletedAt?: any
  typeEmployee: IStdEntity
  role?: any
  userDivisions: any[]
  costEmployee?: any
}

export interface IAKPRowAll {
  id: string
  numbersOfLines: number
  totalTree: number
  totalBunches: number
}

export interface AkpLine {
  id: string
  numbersOfLines: string
  totalTree: string
  totalBunches: string
}

export interface IAKPRow {
  id: string
  temp: string
  isTemp?: boolean
  tempId?: string
  numberAkp: string
  harvestDate: Date
  akpPercent: number
  totalTree: number
  totalBunches: number
  isHaveTaksasi: boolean
  createdBy: string
  block: Block
  akpLines: AkpLine[]
  taxation?: any
  isStandard?: boolean
}

export interface IAKPDetail {
  id: string
  temp: string
  numberAkp: string
  harvestDate: Date
  akpPercent: number
  totalTree: number
  totalBunches: number
  isHaveTaksasi: boolean
  block: Block
  akpLines: AkpLine[]
  user: User
}

export interface IAKPFormData {
  id?: string
  tempId: string
  blockId: string
  harvestDate: string
  akpLines: AkpLine[]
}
