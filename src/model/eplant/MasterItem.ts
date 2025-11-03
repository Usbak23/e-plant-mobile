import {IItemRow} from '@models/eplant/Item'
import IStdEntity from '../commons/IStdEntity'

export interface IMasterItemRowAll {
  id: string
  name: string
  description: string
}

export interface IMasterItemRow extends IMasterItemRowAll {
  totalItems: number
  categoryItem: IStdEntity
}

export interface IMasterItemDetail {
  id: string
  name: string
  description: string
  totalItems: number
  categoryItem: IStdEntity
  items: IItemRow[]
}

export interface IMasterItemFormData {
  id?: string
  categoryItemId?: string
  name: string
  description: string
}
