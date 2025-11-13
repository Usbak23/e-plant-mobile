export const ENUM_REQUEST_TYPE = {
  ALAT: 'Alat',
  MATERIAL: 'Material',
  UANG_TUNAI: 'Uang Tunai',
  TRANSPORTASI: 'Transportasi',
}

export interface IProcessRequest {
  id: string
  status: 'Disetujui' | 'Ditolak'
  notes?: string
}

export const REQUEST_STATUS = [
  {
    value: 'Menunggu Persetujuan',
    label: 'Menunggu Persetujuan',
  },
  {
    value: 'Disetujui',
    label: 'Disetujui',
  },
  {
    value: 'Ditolak',
    label: 'Ditolak',
  },
]

export const REQUEST_TYPE = [
  {
    value: 'Alat',
    label: 'Alat',
  },
  {
    value: 'Material',
    label: 'Material',
  },
  // {
  //   value: 'Uang Tunai',
  //   label: 'Uang Tunai',
  // },
  {
    value: 'Transportasi',
    label: 'Transportasi',
  },
]

export interface IRequestHistory {
  user: {
    id: string
    nip: string
    email: string
    name: string
  }
  status: 'Menunggu Persetujuan' | 'Ditolak' | 'Disetujui'
  date: string
  notes: string
}

export interface IMyRequest {
  id: string
  requestNumber: string
  division: {
    id: string
    name: string
    area: number
    createdAt: string
    updatedAt: string
    deletedAt: null
    organization: {
      id: string
      name: string
      address: string
    }
    totalTree: number
    plantingYear: string[]
    sph: number
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
    email?: string | null
    name: string
  }
  date: string
  type: 'Uang Tunai' | 'Material' | 'Transportasi' | 'Alat'
  name: string
  qty: number
  purpose: string
  status: 'Menunggu Persetujuan' | 'Ditolak' | 'Disetujui'
  requestHistories: IRequestHistory[]
}
