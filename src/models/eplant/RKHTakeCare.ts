import {IAKPRow} from './AKP'
import {IBlockRow} from './Block'
import {IUserRow} from './User'

export interface Itemform {
  id: string
  qty: string
  cost: string
}

export interface SubActivity {
  id: string
  accountNumber: string
  name: string
  description: string
  category: string
}

// 353
export interface Role {
  id: string
  name: string
  // roleCategory: string
  roleCategory: string[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkerList {
  id: string
  category: string
  role: Role
  qty: number
  cost: number
  item?: any
  rawMaterial?: any
}

export interface Workers {
  totalCostPlan: number
  totalActualCost: number
  totalPlanHectare: number
  totalActualHectare: number
  workers: WorkerList[]
}

export interface Item {
  id: string
  name: string
  typeItem: string
  serialNumber: string
  model: string
  yearOfPurchase: string
  capacity: number
  weight: number
}

export interface ToolList {
  id: string
  category: string
  role?: any
  qty: number
  cost: number
  item: Item
  rawMaterial?: any
}

export interface ItemList {
  id: string
  category: string
  qty: number
  cost: number
  role?: any
  item: Item
  rawMaterial?: any
}
export interface Items {
  totalCostPlan: number
  totalActualCost: number
  totalPlanItem: number
  totalActualItem: number
  items: ItemList[]
}
export interface Tools {
  totalCostPlan: number
  totalActualCost: number
  totalPlanTool: number
  totalActualTool: number
  tool_lists: ToolList[]
}

export interface Uom {
  id: string
  name: string
}

export interface RawMaterial {
  id: string
  name: string
  code: string
  location: string
  minStock: number
  isLessThanStock: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  uom: Uom
  qty: number
}

export interface MaterialList {
  id: string
  category: string
  role?: any
  qty: number
  cost: number
  item?: any
  rawMaterial: RawMaterial
}

export interface Taxation {
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
  lastUpdatedRkh?: any
  createdRkh?: any
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  akp: IAKPRow
  user: IUserRow
}

export interface Materials {
  totalCostPlan: number
  totalActualCost: number
  totalPlanMaterial: number
  totalActualMaterial: number
  materials: MaterialList[]
}

export interface RkhActivities {
  worker: Workers
  tools: Tools
  material: Materials
  item: Items
}

export interface IRKHTakeCareFormData {
  id: string
  tempId: string
  rkhId: string
  realizationToThisDay: number
  rkh: any
  category: string
  blockId: string
  block: any
  subActivityId: string
  subActivity: any
  hectaresTomorrow: number
  //added
  totalPlanHectare: number
  planHectareArea: number
  hkPerHa: number
  totalPlanHk: number
  material: Itemform[]
}

export interface IRKHTakeCareRow {
  id: string
  tempId: string
  isTemp: boolean
  status: string
  temp: string
  category: string
  hectaresTomorrow: number
  totalPlanHectare: number
  realizationToThisDay: number
  hkPerHa: number
  totalPlanHk: number
  totalActualHk: number
  costPlan: number
  actualCost: number
  actualHectareArea: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  subActivity: SubActivity
  block: {
    id: string
    code: string
    blockArea: number
    totalTree: number
    plantingYear: string[]
    harvestChapel: string | number
    numberOfLine: number
    varieties: string[]
    createdAt: string
    updatedAt: string
    division: {
      id: string
      name: string
      area: number
      organization: {
        id: string
        name: string
        address: string
        phone: string
      }
    }
    harvestForeman: {
      id: string
      nip: string
      email?: string
      name: string
      address: string
      phoneNumber: string
      // 353
      role: {
        id: string
        name: string
        // roleCategory: string
        roleCategory: string[]
      }
    }
    careForeman: {
      id: string
      nip: string
      email?: string
      name: string
      address: string
      phoneNumber: string
      // 353
      role: {
        id: string
        name: string
        // roleCategory: string
        roleCategory: string[]
      }
    }
  }
  rkhActivities: RkhActivities
  rkh: {
    id: string
    temp: string
    numberRkh: string
    dateRkh: string
    plan: string
    createdAt: Date
    createdBy: string
    updatedAt: Date
    deletedAt?: any
  }
  totalHa: number
  planHectareArea: number
  realizationHectareArea: number // luas ha realisasi from bkm rawat
  totalHkPlan: number //total HK rencana
  totalHkRealization: number //total HK realisasi
}

export interface IRKHTakeCareDetail {
  id: string
  temp: string
  category: string
  hectaresTomorrow: number
  hkPerHa: number
  totalPlanHk: number
  totalPlanHectare: number
  totalActualHectare: number
  costPlan: number
  actualCost: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  subActivity: SubActivity
  block: IBlockRow
  taxation: Taxation
  rkhActivities: RkhActivities
}
