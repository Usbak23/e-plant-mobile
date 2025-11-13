export interface IRKBMaterialBlock {
  id: string
  code: string
  blockArea: number
  totalTree: number
  plantingYear: string[]
  harvestChapel: string | number
  numberOfLine: number
  varieties: string[]
}

export interface IRKBMaterialSubActivity {
  id: string
  accountNumber: string
  name: string
  description: string
  category: string
}

export interface IRKBMaterialMaterial {
  materialName: string
  qtyPlanning: number
  qtyRealization: number
}

export interface IRKBMaterialTable {
  block: IRKBMaterialBlock
  subActivity: IRKBMaterialSubActivity
  year: string
  month: string
  material: IRKBMaterialMaterial[]
}
