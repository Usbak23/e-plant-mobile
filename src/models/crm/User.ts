import IStdEntity from '@app/models/commons/IStdEntity'
import {FirebaseUser} from '@domain/services/firebase/AuthenticationService'

export interface IArvisUserData {
  _id: string
  email: string // emailAddress
  emailVerified?: boolean
  name?: string
  nickname?: string
  registerDate?: Date // registrationDate
  phoneNumber?: string
  organization?: IStdEntity
  organizationGroup?: IStdEntity
  copsecAccess?: boolean
  teamManagementAccess?: boolean
  tagAndCategoryAccess?: boolean
  uploadDocumentAccess?: boolean
  hrAppUrl?: string
  membership?: string
}

export default class User implements IArvisUserData {
  readonly _id: string
  readonly email: string
  readonly emailVerified?: boolean
  readonly registerDate?: Date // registrationDate
  readonly name?: string
  readonly nickname?: string
  readonly phoneNumber?: string
  readonly membership?: string
  readonly copsecAccess?: boolean
  readonly teamManagementAccess?: boolean
  readonly tagAndCategoryAccess?: boolean
  readonly uploadDocumentAccess?: boolean
  readonly hrAppUrl?: string
  readonly organization?: IStdEntity
  readonly organizationGroup?: IStdEntity
  firebaseUser?: FirebaseUser

  constructor(arvisData: IArvisUserData) {
    this._id = arvisData._id
    this.email = arvisData.email
    this.emailVerified = arvisData?.emailVerified
    this.registerDate = arvisData?.registerDate
    this.name = arvisData?.name
    this.nickname = arvisData?.nickname
    this.phoneNumber = arvisData?.phoneNumber
    this.membership = arvisData?.membership
    this.copsecAccess = arvisData?.copsecAccess
    this.teamManagementAccess = arvisData?.teamManagementAccess
    this.tagAndCategoryAccess = arvisData?.tagAndCategoryAccess
    this.uploadDocumentAccess = arvisData?.uploadDocumentAccess
    this.hrAppUrl = arvisData?.hrAppUrl
    this.organization = arvisData.organization
    this.organizationGroup = arvisData.organizationGroup
  }
}

export interface CRM {
  _id: string
  accessMenu: IStdEntity
  accessTypes: IStdEntity[]
}

export interface AccessMenus {
  CRM: CRM[]
  SmartDoc: any[]
}

export interface Role {
  _id: string
  name: string
  accessMenus: AccessMenus
}

export interface IUserAccess {
  _id: string
  groups: IStdEntity[]
  createdBy: string
  updatedBy: string
  name: string
  email: string
  role: Role
  manager: IStdEntity
  user: string
  createdDate: Date
  updatedDate: Date
}
