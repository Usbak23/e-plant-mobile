export interface IMaintenanceMaterialForm {
  materialId: string
  materialName?: string
  qty: number
  uomId: string
  price: number
  totalPrice: number
}

export interface IMaintenanceForm {
  id?: string
  itemId: string
  subActivityId: string
  date: string
  time: string
  description: string
  materials: IMaintenanceMaterialForm[]
}

export interface IMaintenanceMaterial {
  material: {
    id: string
    name: string
    code: string
    location: string
    minStock: number
    createdAt: string
    updatedAt: string
    uom: {
      id: string
      name: string
    }
  }
  qty: number
  uom: {
    id: string
    name: string
  }
  price: number
  totalPrice: number
}

export interface IMaintenance {
  id: string
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
  description: string
  materials: IMaintenanceMaterial[]
}
