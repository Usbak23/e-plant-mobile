import IStdEntity from '@app/models/commons/IStdEntity'

export interface ILeadRow {
  _id: string
  tempId: string
  name?: string
  companyName?: string
  selected?: boolean
  phone?: string
  email?: string
  method?: string
  status?: IStdEntity
  rating?: IStdEntity
  owner?: IStdEntity
  createdDate?: Date
  updatedDate?: Date
  title?: string // ??
  source?: IStdEntity // ??
}

export interface ILeadRowAll {
  _id: string
  name: string
  companyName: string
  displayName: string
}

export interface ILeadDetail extends ILeadRow {
  title?: string
  source?: IStdEntity
  totalEmployees?: number
  industry?: IStdEntity
  country?: IStdEntity
  province?: {_id: string; name: string; country: string}
  city?: {_id: string; name: string; province: string}
  street?: string
  postCode?: string
  createdBy?: IStdEntity
  updatedBy?: IStdEntity
  convertedDate?: Date
  accountName?: string
  contactName?: string
  opportunityName?: string
}

export interface ILeadFormData {
  _id?: string
  tempId?: string
  name: string
  companyName: string
  totalEmployees?: number
  industry?: string
  status: string
  rating?: string
  email?: string
  phone?: string
  title?: string
  source?: string
  country?: string
  province?: string
  city?: string
  street?: string
  postalCode?: string
  method?: string
}

export interface IConvertFormData {
  _id: string
  accountName: string
  contactName: string
  opportunityName: string
  estimationDate: string
  createOpportunity?: boolean
}

export interface ILeadStatusHistories {
  _id: string
  lead: string
  status: IStdEntity
  createdDate: string
  unqualifiedReason?: IStdEntity
}

export const LeadStatus = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  NURTURING: 'Nurturing',
  CONVERTED: 'Converted',
  UNQUALIFIED: 'Unqualified',
}
