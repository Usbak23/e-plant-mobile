export interface Organization {
  id: string
  name: string
  address: string
  phone: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
}

export interface Division {
  id: string
  name: string
  area: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: any
  organization: Organization
}

export interface Harvest {
  harvestAchievement: number
  target: number
  achieved: number
}

export interface TakeCare {
  takeCareAchievement: number
  target: number
  achieved: number
}

export interface IRKHSummary {
  harvest: Harvest
  takeCare: TakeCare
}

export interface IRKHRow {
  id: string
  temp: string
  tempId: string
  isTemp: boolean
  division: Division
  dateRkh: string
  numberRkh: string
  plan: string
  totalHkPlan: number
  totalHkRealization: number
  costPlan: number
  costRealization: number
}

export interface IRKHDetail {
  id: string
  temp: string
  divisionId: string
  dateRkh: string
  numberRkh: string
  plan: string
  totalHkPlan: number
  totalHkRealization: number
  costPlan: number
  costRealization: number
}

export interface IRKHFormData {
  id: string
  tempId: string
  divisionId: string
  dateRkh: string
}

export interface IRKHAllRow extends IRKHSummary {
  docs: IRKHRow[]
}
