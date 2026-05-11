export interface ITonnageGardenFileFormData {
  organizationId: string
  date: string
  file: any
}

export interface ITonnageGardenFormData {
  id?: string
  poNumber: string
  date: string
  organizationId: string
  driver: string
  itemId: string
  grossWeight: number
  tareWeight: number
  netto: number
  gardenTonnageBlocks: ITonnageGardenBlockFormData[]
  //phase 3
  janjang?: number
  bjr?: number
  status?: 'draft' | 'submitted'
}

export interface ITonnageGardenDraftOption {
  id: string
  item: {
    id: string
    name: string
    serialNumber: string
  }
  date: string
  poNumber: string
  driver: string
}

export interface ITonnageGardenBlockFormData {
  blockId: string
  totalJanjang: number
}

export interface ITonnageGardenDriver {
  id: string
  nip: string
  email: string
  name: string
  address: string
  phoneNumber: string
  gender: string
  isActive: boolean
  isEmailConfirm: boolean
}

export interface ITonnageGardenItem {
  id: string
  name: string
  typeItem: string
  serialNumber: string
  model: string
  yearOfPurchase: string
  capacity: number
  weight: number
}

export interface ITonnageGardenRow {
  id: string
  poNumber: string
  organization: {
    id: string
    name: string
    address: string
    phone: string
  }
  date: string
  driver: string
  item: ITonnageGardenItem
  grossWeight: number
  tareWeight: number
  netto: number
}

export interface ITonnageGardenBlok {
  block: {
    id: string
    code: string
    blockArea: number
    totalTree: number
    plantingYear: string[]
    harvestChapel: string | number
    numberOfLine: number
    varieties: string[]
  }
  totalJanjang: number
}

export interface ITonnageGardenDetail {
  id: string
  poNumber: string
  organization: {
    id: string
    name: string
    address: string
    phone: string
  }
  date: string
  driver: string
  item: ITonnageGardenItem
  grossWeight: number
  tareWeight: number
  netto: number
  gardenTonnageBlocks: ITonnageGardenBlok[]
}
