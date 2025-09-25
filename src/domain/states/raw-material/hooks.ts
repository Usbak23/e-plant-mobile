import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import {INormSubActivity} from '@app/models/eplant/NormSubactivity'
import {IRawMaterialRow} from '@app/models/eplant/RawMaterial'
import {useSelector} from 'react-redux'
import {RootStateType} from '../store'

const formatOption = (item: IStdEntity): IOption => ({
  value: item.id,
  label: item.name,
})
export const useRawMaterialFull = (organizationId?: string): IRawMaterialRow[] => {
  const data = useSelector((state: RootStateType) => state.rawMaterial?.rawMaterialAll?.data || [])
  if (organizationId) {
    return data.filter(item => item?.organization?.id === organizationId)
  }

  return data
}

export const useRawMaterialOptions = (organizationId?: string): IOption[] => {
  const data = useSelector((state: RootStateType) => state.rawMaterial?.rawMaterialAll?.data || [])
  if (organizationId) {
    return data.filter(item => item?.organization?.id === organizationId).map(formatOption)
  }
  return data.map(formatOption)
}

export const useRawMaterialOptionsByType = (organizationId?: string, type?: string): IOption[] => {
  const data = useSelector((state: RootStateType) => state.rawMaterial?.rawMaterialAll?.data || [])
  if (organizationId) {
    return data.filter(item => item?.organization?.id === organizationId && item?.type == type).map(formatOption)
  }
  return []
}

export const useNormaSubActivities = (organizationId: string, year: number | string, type: string): IOption[] => {
  const data = useSelector((state: RootStateType) => state.rawMaterial?.normaSubactivities?.data || [])
  const filtered = data
    .filter((row: INormSubActivity) => {
      if (
        row?.subActivity != null &&
        row?.subActivity?.category?.toLowerCase() == type.toLowerCase() &&
        row?.norm?.year == year &&
        row?.norm?.organization?.id == organizationId
      ) {
        return true
      }
      return false
    })
    .map((row: INormSubActivity) => ({value: row?.subActivity?.id || '-', label: row?.subActivity?.name || '-'}))

  return filtered
}
