import IStdEntity from '../commons/IStdEntity'

export type typeItem = 'Kendaraan' | 'Perlengkapan' | 'Peralatan'
export type vehicleOwnership = 'Sewa' | 'Milik sendiri'
export interface IItemRowAll {
  id: string
  name: string
  typeItem: typeItem
  vehicleOwnership: vehicleOwnership
  bbmBase?: number
  serialNumber: string
  model: string
  yearOfPurchase: number
  capacity: string
  organizationId: string
  itemMaster: {
    id: string
    name: string
    description: string
    itemCategory: {
      id: string
      name: string
      description: string
    }
  }
}

export interface IItemRow extends IItemRowAll {
  id: string
  name: string
  typeItem: typeItem
  vehicleOwnership: vehicleOwnership
  serialNumber: string
  model: string
  yearOfPurchase: number
  capacity: string
  organization: IStdEntity | string
  personResponsible: IStdEntity | string
  itemMaster: {
    id: string
    name: string
    description: string
    itemCategory: {
      id: string
      name: string
      description: string
    }
  }
}

export interface IItemDetail {
  id: string
  itemMasterId: string
  name: string
  typeItem: typeItem
  vehicleOwnership: vehicleOwnership
  serialNumber: string
  model: string
  yearOfPurchase: number
  capacity: string
  weight: string
  itemMaster: IStdEntity
  organization: IStdEntity
  personResponsible: IStdEntity
}

export interface IItemFormData {
  id?: string
  name: string
  typeItem: typeItem
  vehicleOwnership: vehicleOwnership
  serialNumber: string
  model: string
  yearOfPurchase: number
  capacity: string
  organizationId: string
  personResponsibleId: string
  itemMasterId: string
}
