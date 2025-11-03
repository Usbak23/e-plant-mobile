import {IItemDetail, IItemRow} from './Item'

export interface IMyRequestForm {
  id?: string
  divisionId: string
  blockId: string[]
  subActivityId: string
  date: string
  type: string
  purpose: string
  materialId: string
  itemId: string
  qty: number
}

export interface IRequestHistory {
  id: string
  date: string
  status: string
  notes: null | string
  json: null | string
  user?: {
    id: string
    name: string
    nip: string
  }
}

export interface IMyRequestDetailSubActivity {
  id: string
  accountNumber: string
  name: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface IMyRequestDetailItem {
  id: string
  name: string
}

export interface IMyRequestDetailMaterial {
  id: string
  name: string
  code: string
  location: string
  minStock: number
  isLessThanStock: boolean
}

export interface IMyRequestBlock {
  id: string
  block: {
    id: string
    code: string
    blockArea: number
    totalTree: number
    plantingYear: string[]
    harvestChapel: string
    numberOfLine: number
    varieties: string[]
  }
}

export interface IMyRequestDetail {
  id: string
  date: string
  requestNumber: string
  type: string
  purpose: string
  name: string
  qty: number
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak'
  createdAt: string
  createdBy: string
  updatedAt: string
  division: {
    id: string
    name: string
    area: number
  }
  user: {
    id: string
    nip: string
    email: string
    name: string
    address: string
  }
  subActivity: IMyRequestDetailSubActivity | null
  item: IItemDetail | null
  material: IMyRequestDetailMaterial | null
  requestHistories: IRequestHistory[]
  requestBlocks: IMyRequestBlock[]
}

export interface IMyRequest {
  id: string
  date: string
  type: string
  requestNumber: string
  purpose: string
  name: string
  blocks: string // value separated by comma(?)
  qty: number
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak'
  createdAt: string
  updatedAt: string
  division: {
    id: string
    name: string
    area: number
    createdAt: string
    updatedAt: string
    organization: {
      id: string
      name: string
    }
  }
  requestHistories: IRequestHistory[]
  user: {
    id: string
    nip: string
    email: string
    name: string
  }
}
