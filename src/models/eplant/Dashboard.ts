export interface IDashboardChartRow {
  label: string
  slug: string
  data: {
    iframe: string
  }
}

export interface IProductionOrganizationChartRow {
  title: string
  slug: string
  data: {
    iframe: string
  }
}

export interface IProductionOrganizationRow {
  productionOrganization: ProductionOrganization[]
  productionGroup: ProductionGroup
}

export interface ProductionOrganization {
  name: string
  budget: number
  realisasi: number
  persentase: number
  status: number
}

export interface ProductionGroup {
  budget: number
  realisasi: number
  persentase: Persentase
}

export interface Persentase {
  data: number
  status: number
}
