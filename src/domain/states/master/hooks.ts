import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'
import IOption from '@models/commons/IOption'
import IStdEntity from '@models/commons/IStdEntity'
import {IMinimumAKP, IRangeYear} from '@app/models/eplant/Master'

export const formatOption = (item: IStdEntity): IOption => ({
  value: item.id,
  label: item.name,
})

export const useProvinceOptions = (): IOption[] => {
  const provinces = useSelector((state: RootStateType) => state.master?.provinces?.data || [])
  return provinces.map(formatOption)
}

export const useTypeEmployeeOptions = (): IOption[] => {
  const data = useSelector((state: RootStateType) => state.master?.typeEmployees?.data || [])
  return data.map(formatOption)
}

export const useUomOptions = (): IOption[] => {
  const uoms = useSelector((state: RootStateType) => state.master?.uoms?.data || [])
  if (uoms && Array.isArray(uoms)) {
    return uoms.map(formatOption)
  }
  return []
}
export const useSupervisionOptions = (): IOption[] => {
  const data = useSelector((state: RootStateType) => state.master?.supervisions?.data || [])
  if (data && Array.isArray(data)) {
    return data.map(formatOption)
  }
  return []
}
export const useWorkStatusOptions = (): IOption[] => {
  const data = useSelector((state: RootStateType) => state.master?.workStatuses?.data || [])
  if (data && Array.isArray(data)) {
    return data.map(formatOption)
  }
  return []
}

export const useMinimumAKP = (): IMinimumAKP | undefined => {
  const minimumAkp = useSelector((state: RootStateType) => state.master?.minimumAkp?.data || undefined)
  if (minimumAkp) {
    return minimumAkp
  }
  return undefined
}

export const useRangeYear = (): IRangeYear | undefined => {
  const rangeYear = useSelector((state: RootStateType) => state.master?.rangeYear?.data || undefined)
  if (rangeYear) {
    return rangeYear
  }
  return undefined
}

export const useRangeYears = (): IOption[] => {
  const rangeYear = useRangeYear()
  const end = rangeYear?.end || 2100
  const start = rangeYear?.start || 1970
  const years = Array.from(Array(end - (start - 1)), (_, i) => (i + start).toString())
  return years.map(y => ({value: y, label: y}))
}

export const useRangeMonths = (): IOption[] => {
  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]
  return monthNames.map((y, i) => ({value: i + 1 < 10 ? `0${i + 1}` : (i + 1).toString(), label: y}))
}

export const useCityOptions = (province?: string): IOption[] => {
  const provinces = useSelector((state: RootStateType) => state.master?.provinces?.data || [])
  if (province) {
    return provinces.find(e => e?.id === province)?.districts?.map(formatOption) || []
  }
  return provinces
    .map(e => e.districts)
    .flat()
    .map(formatOption)
}
