import { IOrganizationRowAll } from './Organization'

export interface Division {
  id: string
  name: string
  area: number
  assistantDivision: IAssistantDivision
  organization: IOrganizationRowAll
  blocks: number
  totalTree: number
  sph: number
  isDeleted: boolean
  createdAt: Date
  createdBy: number
  updatedAt: Date
  updatedBy: number
  // phase 3
  totalUser?: number
  usedArea?: number
  unusedArea?: number
  plantingYear?: string[] | number[]
}

export interface IAssistantDivision {
  id: string
  nip: string
  name: string
}

export interface IDivisionFormData {
  id?: number
  name: string
  area: number
  organizationId: string
  assistantDivision: string
}
