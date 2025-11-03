export interface IDailyActivityForm {
  id?: string
  blockId: string
  itemId: string
  subActivityId: string
  date: string
  time: string
  kmStart: number | null
  kmEnd: number | null
  kmCalculation?: number | null
  bbmBase: number
  bbmTaken: number
  bbmUsed: number | null
  uomId: string
  workResult: number
  oilSae: string | null
  oilLiter: number | null
  description: string
}

export interface IDailyActivity {
  id: string
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
  item: {
    id: string
    name: string
    typeItem: string
    serialNumber: string
    model: string
    yearOfPurchase: string
    capacity: number
    weight: number
    bbmBase: number
    personResponsible: string
    organization: string
  }
  subActivity: {
    id: string
    accountNumber: string
    name: string
    description: string
    category: string
  }
  user: {
    id: string
    nip: string
    email: string
    name: string
  }
  date: string
  time: string
  kmStart: number
  kmEnd: number
  kmCalculation: number
  bbmBase: number
  bbmTaken: number
  bbmUsed: number
  uom: {
    id: string
    name: number
  }
  workResult: number
  oilSae: string
  oilLiter: number
  description: string
  driver?: string | null
}
