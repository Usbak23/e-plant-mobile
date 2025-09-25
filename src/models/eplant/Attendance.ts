export interface IAttendanceFileFormData {
  divisionId: string
  date: string
  file: any
}

// 353 -> ok
export interface IAttendanceFormData {
  tempId?: string
  divisionId: string
  date: string
  userId: string
  in: string
  out: string
  nip?: string
  name?: string
  // roleCategory?: string
  roleCategory?: string[]
  workingHours?: number
  type?: string
}

export interface IAttendanceOrganization {
  id: string
  name: string
  address: string
  phone: string
}

export interface IAttendanceDivision {
  id: string
  name: string
  area: number
  organization: IAttendanceOrganization
}

// #353 -> ok
export interface IAttendanceEmployee {
  id: string
  in: string
  out: string
  workingHours: number
  type: string
  user: {
    id: string
    tempId?: string
    nip: string
    email: string
    name: string
    address: string
    phoneNumber: string
    gender: string
    isApproved: boolean
    isActive: boolean
  }
  role: {
    id: string
    name: string
    // roleCategory: string
    roleCategory?: string[]
  }
}

export interface IAttendance {
  id: string
  date: string
  division: IAttendanceDivision
  attendanceEmployees: IAttendanceEmployee[]
}

// 353 ->
export interface IAttendanceOffline {
  user: {
    nip: string
    name: string
  }
  role: {
    // roleCategory: string
    roleCategory?: string[]
  }

  date: string
  workingHours: number
  in: string
  out: string
  type: string
  form: {
    tempId?: string
    divisionId: string
    date: string
    userId: string
    in: string
    out: string
  }
}
