export interface INormSubActivity {
  id: string
  subActivity: {
    id: string
    accountNumber: string
    name: string
    description: string
    category: string
  }
  qty: number
  maintenanceCost: number
  rotation: number
  norm: {
    id: string
    year: number
    organization: {
      id: string
      name: string
      address: string
      phone: string
      createdAt: string
      updatedAt: string
      deletedAt: null | string
    }
    assumtionPrice: number
    hkPerHaHarvest: number
    harvestCost: number
  }
}
