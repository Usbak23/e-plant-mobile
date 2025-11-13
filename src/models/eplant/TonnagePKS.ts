import { string } from "yup"

export interface ITonnagePKSFormData {
  id?: string
  gardenTonnageId: string
  poNumberPks: string
  date: string
  driver: string
  itemId: string
  decision: 'Diterima' | 'Ditolak'
  grossWeight: number
  tareWeight: number
  nettoFirst: number
  nettoSecond: number
  refraksiKg: number
  refraksi: number
  tenera: number
  dura: number
  total: number
  halfRipe: number
  raw: number
  abnormal: number
  peram: number
  jangkos: number
  rottenLooseFruit: number
  rubbish: number
  lateRipe: number
  longStalk: string | null
  fruitReturned: number
  etc: string | null
  //phase3
  janjang: string | number
  bjr: string | number
}

export interface ITonnagePKSGarden {
  id: string
  poNumber: string
  date: string
  grossWeight: string
  tareWeight: number
  netto: number
}

export interface ITonnagePKSDriver {
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

export interface ITonnagePKSItem {
  id: string
  name: string
  typeItem: string
  serialNumber: string
  model: string
  vehicleOwnership: string
  yearOfPurchase: string
  capacity: number
  weight: number
}

export interface ITonnagePKSRow {
  id: string
  // gardenTonnage: ITonnagePKSGarden
  // poNumberPks: string
  date: string
  driver: string
  item: ITonnagePKSItem
  decision: string
  grossWeight: number
  tareWeight: number
  nettoFirst: number
  nettoSecond: number
  refraksi: number
  tenera: number
  dura: number
  total: number
  halfRipe: number
  raw: number
  abnormal: number
  peram: number
  jangkos: number
  rottenLooseFruit: number
  rubbish: number
  lateRipe: number
  longStalk: string | null
  fruitReturned: number
  etc: string | null
  bjr: number | string
  janjang: number | string
  spb: {
    id: string
    date: string
    pksName: string
    transportType: number
    driver: string
    po: {
      id: string
      date: string
      poNumber: string
      driver: string
    }
  }
}

export interface ITonnagePKSDetail {
  id: string
  gardenTonnage: ITonnagePKSGarden
  poNumber: string
  date: string
  driver: string
  item: ITonnagePKSItem
  decision: string
  grossWeight: number
  tareWeight: number
  nettoFirst: number
  nettoSecond: number
  refraksi: number
  tenera: number
  olira: number
  halfRipe: number
  raw: number
  abnormal: number
  peram: number
  jangkos: number
  rottenLooseFruit: number
  rubbish: number
  lateRipe: number
  longStalk: string
  etc: string
}

export interface ISPBListRow {
  id: string
  date: string
  pksName: string
  transportType: number
  driver: string
  description: string
  createdAt: string
  updatedAt: string | null
  deletedAt: null | string
  organization: {
    id: string
    name: string
    address: string | null
  }
  item: {
    id: string
    name: string
    typeItem: string
    serialNumber: string
    model: string
    yearOfPurchase: string
    vehicleOwnership: string
  }
  po: {
    id: string
    date: string
    poNumber: string
    driver: string
    grossWeight: number
    tareWeight: number
    netto: number
    janjang: number
    bjr: number
    createdAt: string
  }
  tonnagePks: {
    id: string
    date: string
    driver: string
    grossWeight: number
    tareWeight: number
    refraksi: number
    refraksiKg: number
    tenera: number
    dura: number
    total: number
    halfRipe: number
    raw: number
    abnormal: number
    peram: number
    jangkos: number
    rottenLooseFruit: number
    rubbish: number
    lateRipe: number
    fruitReturned: number
    decision: string
    longStalk: number
    etc: string
    janjang: number
    bjr: number
    createdAt: string
  }

}
