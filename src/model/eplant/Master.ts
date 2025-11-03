import IStdEntity from '@models/commons/IStdEntity'

export interface IProvince extends IStdEntity {
  districts: IStdEntity[]
}

export interface IMinimumAKP {
  min: number
}

export interface IRangeYear {
  start: number
  end: number
}

export interface IRangeBreakTime {
  time: string
  length: number
}

export interface IUom extends IStdEntity {}
