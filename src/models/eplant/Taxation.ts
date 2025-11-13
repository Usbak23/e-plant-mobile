import {IBlockRow} from './Block'

export interface ITaxationHaRealizationParam {
  date: string
  akpId: string
}

export interface ITaxationFormData {
  id?: string
  akpId: string
  harvestChapel: string | number
  akpPercent: number
  sph: number
  totalHectares: number
  hectareRestOfToday: number
  hectareRestOfTommorow: number
  ripeFruit: number
  bjr: number
  kilogram: number
  calculationReference: string
  numberOfEmployees: number
  kilogramPerHk: number
}

export interface ITaxationHaRealization {
  date: string
  block: {
    id: string
    code: string
  }
  haRealization: number
}

export interface ITaxationRow {
  id: string
  isAvaliableCreateTaxation: boolean
  temp: string | null
  numberAkp: string
  harvestDate: string
  akpPercent: number
  totalTree: number
  totalBunches: number
  harvestChapel: string
  isHaveTaksasi: boolean
  createdAt: string
  createdBy: any
  block: IBlockRow
  akpLines: any
  sph: number
  lastTaxation: any
  isValidTaxation: boolean
  taxation: {
    status: string
    date: string
    id: string
    numberTaxation: string
    harvestChapel: string | number
    akpPercent: number
    sph: number
    totalHectares: number
    hectareRestOfToday: number
    hectareRestOfTommorow: number
    ripeFruit: number
    bjr: number
    kilogram: number
    calculationReference: string
    numberOfEmployees: number
    kilogramPerHk: number
    user: {
      id: string
      nip: string
      email: string | null
      name: string
      address: string
      phoneNumber: string
      gender: string
      // 353
      role: {
        id: string
        name: string
        // roleCategory: string
        roleCategory: string[]
      }
    }
    createdAt: string
    updatedAt: string
  } | null
}

export interface ITaxationDetail {
  id: string
  numberTaxation: string
  harvestChapel: string | number
  sph: number
  totalHectares: number
  hectareRestOfToday: number
  hectareRestOfTommorow: number
  ripeFruit: number
  bjr: number
  kilogram: number
  calculationReference: string
  numberOfEmployees: number
  kilogramPerHk: number
  user: {
    id: string
    nip: string
    email: string | null
    name: string
    address: string
    phoneNumber: string
    gender: string
    isEmailConfirm: boolean
  }
}

export const CalculationReferences: {label: string; value: string}[] = [
  {
    label: 'Jumlah HK',
    value: 'Jumlah Karyawan',
  },
  {
    label: 'Kilogram/HK',
    value: 'Kilogram/HK',
  },
]
