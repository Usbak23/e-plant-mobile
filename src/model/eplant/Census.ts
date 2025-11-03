import { IBlockRow } from './Block'

export interface IQuarterYearCensus {
  quarter: number
  month: number
  labelMonth: string
}

export interface ICaturwulan {
  caturwulan: number
  month: number
  labelMonth: string
}

export const ICaturwulanCensus: ICaturwulan[] = [
  {
    caturwulan: 1,
    labelMonth: 'Januari',
    month: 1,
  },
  {
    caturwulan: 1,
    labelMonth: 'Februari',
    month: 2,
  },
  {
    caturwulan: 1,
    labelMonth: 'Maret',
    month: 3,
  },
  {
    caturwulan: 1,
    labelMonth: 'April',
    month: 4,
  },
  {
    caturwulan: 2,
    labelMonth: 'Mei',
    month: 5,
  },
  {
    caturwulan: 2,
    labelMonth: 'Juni',
    month: 6,
  },
  {
    caturwulan: 2,
    labelMonth: 'Juli',
    month: 7,
  },
  {
    caturwulan: 2,
    labelMonth: 'Agustus',
    month: 8,
  },
  {
    caturwulan: 3,
    labelMonth: 'September',
    month: 9,
  },
  {
    caturwulan: 3,
    labelMonth: 'Oktober',
    month: 10,
  },
  {
    caturwulan: 3,
    labelMonth: 'November',
    month: 11,
  },
  {
    caturwulan: 3,
    labelMonth: 'Desember',
    month: 12,
  },
]

export const QuarterYearCensus: IQuarterYearCensus[] = [
  {
    quarter: 1,
    labelMonth: 'Januari',
    month: 1,
  },
  {
    quarter: 1,
    labelMonth: 'Februari',
    month: 2,
  },
  {
    quarter: 1,
    labelMonth: 'Maret',
    month: 3,
  },
  {
    quarter: 2,
    labelMonth: 'April',
    month: 4,
  },
  {
    quarter: 2,
    labelMonth: 'Mei',
    month: 5,
  },
  {
    quarter: 2,
    labelMonth: 'Juni',
    month: 6,
  },
  {
    quarter: 3,
    labelMonth: 'Juli',
    month: 7,
  },
  {
    quarter: 3,
    labelMonth: 'Agustus',
    month: 8,
  },
  {
    quarter: 3,
    labelMonth: 'September',
    month: 9,
  },
  {
    quarter: 4,
    labelMonth: 'Oktober',
    month: 10,
  },
  {
    quarter: 4,
    labelMonth: 'November',
    month: 11,
  },
  {
    quarter: 4,
    labelMonth: 'Desember',
    month: 12,
  },
]

export interface ICensusMonthsFormData {
  month: number
  percentage: string | number
  scatter: string | number
  janjangPerMonth: string | number
}
export interface ICensusFormData {
  blockId: string
  yearOfCensus: string | number
  quarter: number
  totalTree: number
  totalTreeChecked: number
  totalFruit: number
  averageFruit: number
  totalFruitOfBlock: number
  bjr: number
  totalTonnage: number
  tonnagePerHectare: number
  censusMonth: ICensusMonthsFormData[]
}

export interface ICensusEditFormData {
  id: string
  formData: ICensusFormData
}

export interface ICensusRow {
  id: string
  dateCensus: string
  numberCensus: string
  yearOfCensus: string
  quarter: number
  totalTree: number
  totalTreeChecked: number
  totalFruit: number
  averageFruit: number
  totalFruitOfBlock: number
  bjr: number
  totalTonnage: number
  tonnagePerHectare: number
  createdAt: string
  updatedAt: string
  block: IBlockRow
}

export interface ICensusDetail extends ICensusRow {
  censusMonths: {
    id: string
    month: number
    percentage: number
    scatter: number
    janjangPerMonth?: number | string
    yield?: number | string
    bjr?: number | string
  }[]
}
