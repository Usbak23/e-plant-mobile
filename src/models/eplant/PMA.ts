export interface IPMAMerged {
  tempId?: string
  id?: string
  datePma: string
  divisionId: string
  foremanId: string
  employee: IPMAEmployeeMerged[]
  //below is offline
  division?: {
    id: string
    name: string
    organization: {
      id: string
      name: string
    }
  }
  foremanPma?: {
    id: string
    name: string
    nip: string
  }
}

export interface IPMAEmployeeFormData {
  id?: string
  employeeTempId?: string
  isDraft?: boolean
  userId: string
  blockId: string
  plantingYear?: string
  ancak: number
  notHarvestFruit: number
  sunFruit: number
  looseOnPlateAndPikul: number
  looseOnTph: number
  brokenMidrib: number
  onPlateMidrib: number
  checkedTree?: number | string
  remainingFruitTree?: number | string
  brondolanEachTree?: number | string

  //below is for offline
  user?: {
    id: string
    name: string
    nip: string
    role?: {
      id: string
      name: string
    }
  }

  block?: {
    id: string
    code: string
  }
}

export interface IPMAFormData {
  tempId?: string
  datePma: string
  divisionId: string
  foremanId: string
  employee: IPMAEmployeeFormData[]
  //below is offline
  division?: {
    id: string
    name: string
    organization: {
      id: string
      name: string
    }
  }
  foremanPma?: {
    id: string
    name: string
    nip: string
  }
}

export interface IPMAFormEmployeeUpdate {
  id?: string
  userId: string
  blockId: string
  ancak: number
  notHarvestFruit: number
  sunFruit: number
  looseOnPlateAndPikul: number
  looseOnTph: number
  brokenMidrib: number
  onPlateMidrib: number
  checkedTree?: number | string
  remainingFruitTree?: number | string
  brondolanEachTree?: number | string
}

export interface IPMAFormUdpate extends IPMAFormData {
  id: string
}

export interface IPMAEmployeeMerged {
  isDraft?: boolean
  id?: string
  tempId?: string
  employeeTempId?: string
  user: {
    id: string
    nip: string
    name: string
  }
  role: {
    id: string
    name: string
  }
  block: {
    id: string
    code: string
  }
  plantingYear?: string
  ancak: number
  notHarvestFruit: number
  sunFruit: number
  looseOnPlateAndPikul: number
  looseOnTph: number
  brokenMidrib: number
  onPlateMidrib: number
  checkedTree?: number | string
  remainingFruitTree?: number | string
  brondolanEachTree?: number | string
}

export interface IPMAEmployee {
  id: string
  tempId?: string
  user: {
    id: string
    nip: string
    email: string
    name: string
    address: string
    phoneNumber: string
  }
  // 353
  role: {
    id: string
    name: string
    // roleCategory: string
    roleCategory?: string[]
  }
  block: {
    id: string
    code: string
    blockArea: number
    totalTree: number
    plantingYear: string[]
    harvestChapel: string | number
    numberOfLine: number
    varieties: string[]
  }
  plantingYear?: string
  ancak: number
  notHarvestFruit: number
  sunFruit: number
  looseOnPlateAndPikul: number
  looseOnTph: number
  brokenMidrib: number
  onPlateMidrib: number
  checkedTree?: number | string
  remainingFruitTree?: number | string
  brondolanEachTree?: number | string
}

export interface IPMADivision {
  id: string
  name: string
  area: number
  createdAt: string
  updatedAt: string
  organization: {
    id: string
    name: string
    address: string
    phone: string
    createdAt: string
    updatedAt: string
  }
}

export interface IPMAForeman {
  id: string
  nip: string
  email: string
  name: string
  address: string
  phoneNumber: string
  gender: string
  // organization: null
  // 353
  role: {
    id: string
    name: string
    // roleCategory: string
    roleCategory: string[]
  }
}

export interface IPMA {
  id: string
  datePma: string
  pmaEmployees: IPMAEmployee[]
  division: IPMADivision
  foremanPma: IPMAForeman
}

export interface IPMADetailEmployee {
  id: string
  ancak: number
  notHarvestFruit: number
  sunFruit: number
  looseOnPlateAndPikul: number
  looseOnTph: number
  brokenMidrib: number
  onPlateMidrib: number
  user: IPMADetailUser
  // 353
  role: {
    id: string
    name: string
    // roleCategory: string
    roleCategory: string[]
  }
  block: {
    id: string
    code: string
    blockArea: number
    totalTree: number
    plantingYear: string[]
    harvestChapel: string | number
    numberOfLine: number
    varieties: string[]
  }
}

export interface IPMADetailUser {
  id: string
  nip: string
  email: string
  name: string
  address: string
  phoneNumber: string
  gender: string
  //   organization: '4d1c2c15-520b-43e6-8445-6fb3ec3f35b4'
}

export interface IPMADetail {
  id: string
  datePma: string
  createdAt: string
  updatedAt: string
  division: IPMADivision
  pmaEmployees: IPMADetailEmployee[]
}

export interface IPMARow {
  id: string
  datePma: string
  division: IPMADivision
  foreman: IPMAForeman
}
