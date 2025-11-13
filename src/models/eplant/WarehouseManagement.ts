export interface IManagamentWarehouseBPUForm {
  managementWarehouseId: string
  bpus: [
    {
      blockId: string
      kgPerPokok: number
      tonnage: number
      kgPerUntil: number
    },
  ]
}

export interface IManagementWarehouseApproveForm {
  managementWarehouseId: string
  status: 'Dikeluarkan' | 'Menunggu Persetujuan' | 'Dibatalkan'
  notes: string
}

export interface IManagementWarehouse {
  id: string
  requestNumber: string
  name: string
  date: string
  qty: number
  requestModule: string
  requestType: string
  materialType: string
  user: {
    id: string
    nip: string
    email: string
    name: string
  }
  status: 'Dikeluarkan' | 'Menunggu Persetujuan' | 'Dibatalkan' | 'Disetujui'
  notes: null | string
  bpus?: []
}

export interface IManagementWarehouseRequestHistories {
  id: string
  date: string
  status: string
  notes: null | string
  json: null | string
}

export interface IManagementWarehouseBPU {
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
  kgPerPokok: number
  tonnage: number
  kgPerUntil: number
}

export interface IManagementWarehouseDetail {
  id: string
  requestNumber: string
  name: string
  date: string
  requestModule: string
  requestType: string
  materialType: string
  user: {
    id: string
    nip: string
    email: string
    name: string
  }
  material: {
    id: string
    name: string
    code: string
    location: string
    minStock: number
    uom: {
      id: string
      name: string
    }
    stock: number
  }
  item: any
  status: string
  notes: null | string
  request: {
    id: string
    date: string
    type: string
    requestNumber: string
    purpose: string
    name: string
    blocks: any // string? arr of string?
    qty: number
    status: string
    requestHistories: IManagementWarehouseRequestHistories[]
    requestBlocks: {id: string; block: {id: string; code: string}}[]
  }
  bkmTakecare: any
  bpus: IManagementWarehouseBPU[]
  subActivity?: {
    id: string
    accountNumber: string
    name: string
    description: string
    category: string
  }
}
