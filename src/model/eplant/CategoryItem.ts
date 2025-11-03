import IStdEntity from '@models/commons/IStdEntity'
import {IMasterItemRow} from './MasterItem'

export interface ICategoryItemRowAll {
  id: string
  name: string
  description: string
}

export interface ICategoryItemRow extends ICategoryItemRowAll {
  totalMasterItem: number
}

export interface ICategoryItemDetail {
  id: string
  name: string
  description: string
  totalMasterItem: number
  masterItems: IMasterItemRow[]
}

export interface ICategoryItemFormData {
  id?: string
  name: string
  description: string
}
