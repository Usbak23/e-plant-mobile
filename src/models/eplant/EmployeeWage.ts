export interface IEmployeeWageRow {
  daily: Daily
  borongan: Borongan
}

export interface Daily {
  costPanen: CostPanen[]
  costRawat: CostRawat[]
  totalCost: TotalCost
}

export interface CostPanen {
  blockId: string
  id: string
  name: string
  plantingYear: number
  workResultHa: number
  workResultKg: number
  workDay: string
  month?: number
  bunchBasisOne?: number
  category?: string
  bunchBasisTwo?: number
  kgBasisOne?: number
  kgBasisTwo?: number
  eggBasisTwo?: number
  numberEggBasisTwo?: number
  perEggRpBasisTwo?: number
  wages?: number
  incentive?: number
  employeeName: string
  areaHa: number
  bunchKg: number
  costBaseOne: number
  costBaseTwo: number
  egg?: number
  eat?: number
  totalHarvestWage: number
  totalPieces: number
  totalWage: number
}

export interface CostRawat {
  name: string
  workDay: string
  wagebkm: any
  hkAmount: number
  wages: number
  employeeName: string
  numberWorkingDay: number
  totalMaintenanceFee: number
}

export interface TotalCost {
  costPanen: number
  costRawat: number
  totalCost: number
}

export interface Borongan {
  costPanen: CostPanen2[]
  costRawat: CostRawat2[]
  totalCost: TotalCost2
}

export interface CostPanen2 {
  name: string
  plantingYear: number
  workDay: string
  hkAmount: number
  workResultHa: number
  workResultKg: number
  rpKg?: number
  bjr?: number
  minHk?: number
  incentiveHk: number
  naturaKg?: number
  employeeName: string
  workingDay: number
  bunchKg: number
  boronganWage: number
  natureKg: number
  totalWage: number
}

export interface CostRawat2 {
  bkmWages?: number
  name: string
  workResultHa: number
  workDay: string
  maintenanceCost?: number
  subAktivitas: string
  satuan?: string
  employeeName: string
  subActivityName: string
  unit?: string
  workResult: number
  totalMaintenanceFee: number
}

export interface TotalCost2 {
  costPanen: number
  costRawat: number
  totalCost: number
  natura: number
}
