import IPagingDocs from '../commons/IPagingDocs'

export interface IRealizationFertilizationApproveForm {
  id?: string
  rktId: string
  materialId: string
  blockId: string
  rotation: number
  date: string
  realizationKgPerPokok: number
  realizationTonnage: number
}

export interface IRealizationFertilizationRowMaterial {
  id: string
  name: string
  code: string
  location: string
  minStock: number
  isLessThanStock: boolean
  type: string
  createdAt: string
  updatedAt: string
  deletedAt: null | string
}

export interface IRealizationFertilizationRow {
  id: string
  material: IRealizationFertilizationRowMaterial
  block: {
    id: string
    code: string
    blockArea: number
    totalTree: number
    plantingYear: string[]
    harvestChapel: number
    numberOfLine: number
    varieties: string[]
  }
  rotation: number
  date: string
  planKgPerPokok: number
  realizationKgPerPokok: number
  planTonnage: number
  realizationTonnage: number
}

export interface IRealizationFertilizationRKTMaterial {
  id: string
  category: string
  qty: number
  rotation: number
  physicalVolume: number
  totalMaterial: number
  createdAt: string
  createdBy: string
  updatedAt: string
  deletedAt: null | string
  rawMaterial: {
    id: string
    name: string
    code: string
    location: string
    minStock: number
    isLessThanStock: boolean
    type: string
    createdAt: string
    updatedAt: string
    deletedAt: null | string
  }
  rktMonths: {
    id: string
    month: number
    qty: number
  }[]
  block: {
    id: string
    code: string
    blockArea: number
    totalTree: number
    plantingYear: string[]
    harvestChapel: number
    numberOfLine: number
    varieties: string[]
    createdAt: string
    updatedAt: string
    deletedAt: null | string
  }
}

export interface IRealizationFertilizationRKT {
  id: string
  year: number
  status: string
  lockRkt: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  deletedAt: null | string
  organization: {
    id: string
    name: string
    address: string
    phone: string
    createdAt: string
    updatedAt: string
    deletedAt: null | string
  }
  division: {
    id: string
    name: string
    area: number
    createdAt: string
    updatedAt: string
    deletedAt: null | string
  }
  subActivity: {
    id: string
    accountNumber: string
    name: string
    description: string
    category: string
    createdAt: string
    updatedAt: string
    deletedAt: null | string
  }
  rktActivities: {
    material: IRealizationFertilizationRKTMaterial[]
  }
}

export interface IRealizationFertilizationPagingDocs extends IPagingDocs<IRealizationFertilizationRow> {
  rkt?: IRealizationFertilizationRKT
}
