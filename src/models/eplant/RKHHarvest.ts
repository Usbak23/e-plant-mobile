import IStdEntity from '../commons/IStdEntity'
import {IAKPRow} from './AKP'
import {IBlockRow} from './Block'
import {IRoleRow} from './Role'
import {IUserRow} from './User'

export interface IRKHHarvestWorker {
  id: string
  typeEmployeeId: string
  qty: number
  cost: number
}

export interface IRKHHarvestFormData {
  isOffline?: boolean
  tempId?: string
  rkhId: string
  taxationId: string
  worker: IRKHHarvestWorker[]
}

export interface IRKHHarvestList {
  id: string
  temp?: string | null
  category: string
  hectaresTomorrow: number
  totalPlanHectare: number
  totalActualHectare: number
  costPlan: number
  actualCost: number
  rkhActivities?:
    | {
        id: string
        category: string
        qty: number
        cost: number
      }[]
    | null
}

export interface IRKHHarvestRow {
  id: string
  numberTaxation: string
  harvestChapel: string | number
  akpPercent: number
  sph: number
  totalHectares: number
  HectareRestOfToday: number
  HectareRestOfTommorow: number
  ripeFruit: number
  bjr: number
  kilogram: number
  calculationReference: string
  numberOfEmployees: number
  kilogramPerHk: number
  isHaveRkh: boolean
  user: IUserRow
  rkhList: IRKHHarvestList
  block: IBlockRow
}

export interface IRKHHarvestDetail {
  id: string
  temp?: string
  category: string
  hectaresTomorrow: number
  totalPlanHectare: number
  totalActualHectare: number
  costPlan: number
  actualCost: number
  block: IBlockRow
  taxation: {
    id: string
    numberTaxation: string
    harvestChapel: string | number
    akpPercent: number
    sph: number
    totalHectares: number
    HectareRestOfToday: number
    HectareRestOfTommorow: number
    ripeFruit: number
    bjr: number
    kilogram: number
    calculationReference: string
    numberOfEmployees: number
    kilogramPerHk: number
    isHaveRkh: boolean
  }
  subActivity: string
  rkhActivities: {
    workers: {
      totalCostPlan: number
      totalActualCost: number
      totalPlanHectare: number
      totalActualHectare: number
      worker_list: [
        {
          id: string
          category: string
          qty: number
          cost: number
        },
        {
          id: string
          category: string
          qty: number
          cost: number
        },
      ]
    }
  }
}

export interface IRKHHarvestListModel {
  id: string
  temp?: string
  category: string
  hectaresTomorrow: number
  totalPlanHectare: number
  totalActualHectare: number
  costPlan: number
  actualCost: number
  createdAt: string
  updatedAt: string
}

export interface IRKHHarvestActivity {
  id: string
  category: string
  qty: number
  cost: number
  role?: IRoleRow
  typeEmployee?: IStdEntity
}

export interface IRKHHarvestListWithActivities extends IRKHHarvestListModel {
  rkhActivities: IRKHHarvestActivity[]
}

export interface IRKHHarvestAllRowData {
  id: string
  numberTaxation: string
  harvestChapel: number
  akpPercent: number
  sph: number
  totalHectares: number
  HectareRestOfToday: number
  HectareRestOfTommorow: number
  ripeFruit: number
  bjr: number
  kilogram: number
  calculationReference: string
  numberOfEmployees: number
  kilogramPerHk: number
  isHaveRkh: boolean
  lastUpdatedRkh: string
  createdRkh: string
  createdAt: string
  updatedAt: string
  akp: {
    id: string
    temp: string
    numberAkp: string
    harvestDate: string
    akpPercent: number
    totalTree: number
    totalBunches: number
    isHaveTaksasi: boolean
    createdTaxation: string
    lastUpdatedTaxation: string
    createdAt: string
    createdBy: string
    updatedAt: string
    deletedAt: null | string
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
      harvestForeman: {
        id: string
        nip: string
        email: string
        name: string
        // 353
        role: {
          id: string
          name: string
          // roleCategory: string
          roleCategory: string[]
        }
      }
      division: {
        id: string
        name: string
        area: number
        createdAt: string
        updatedAt: string
        organization: {
          id: string
          name: string
          address: string
          createdAt: string
          updatedAt: string
        }
      }
    }
  }
  rkhList: {
    id: string
    temp: string
    category: string
    hectaresTomorrow: number
    totalPlanHectare: number
    totalActualHectare: number
    createdAt: string
    updatedAt: string
    deletedAt: null | string
  }
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
    harvestForeman: {
      id: string
      nip: string
      email: string
      name: string
      // 353
      role: {
        id: string
        name: string
        // roleCategory: string
        roleCategory: string[]
      }
    }
    division: {
      id: string
      name: string
      area: number
      createdAt: string
      updatedAt: string
      organization: {
        id: string
        name: string
        address: string
        createdAt: string
        updatedAt: string
      }
    }
  }
  totalPlanHk: number
  totalActualHk: number
  planHectareArea: number
  actualHectareArea: number
  subActivity: string
  rkhHarvestId: string
}

export interface IRKHHarvestAllRow {
  docs: IRKHHarvestAllRowData
}

export interface IRKHHarvestRowDataOffline extends IRKHHarvestAllRowData {
  isOffline: boolean
}
