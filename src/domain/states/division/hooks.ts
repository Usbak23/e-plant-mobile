import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import {useSelector} from 'react-redux'
import {RootStateType} from '../store'

const formatOption = (item: IStdEntity): IOption => ({
  value: item.id,
  label: item.name,
})

export const useDivisions = (): IOption[] => {
  const divisions = useSelector((state: RootStateType) => state.division?.divisionAll?.data || [])
  return divisions.map(formatOption)
}

export const useDivisionsByOrganization = (organizationId?: string): IOption[] => {
  const divisions = useSelector((state: RootStateType) => state.division?.divisionAll?.data || [])
  if (organizationId && Array.isArray(divisions)) {
    return divisions.filter(e => e?.organization?.id === organizationId)?.map(formatOption) || []
  }
  return []
}

export const useDivisionsByOrganizationFull = (organizationId?: string) => {
  const divisions = useSelector((state: RootStateType) => state.division?.divisionAll?.data || [])
  if (organizationId && Array.isArray(divisions)) {
    return divisions.filter(e => e?.organization?.id === organizationId) || []
  }
  return []
}

export const useDivisionsByOrganizationAll = (organizationId?: string) => {
  const divisions = useSelector((state: RootStateType) => state.division?.divisionAll?.data || [])
  if (organizationId && Array.isArray(divisions)) {
    return divisions?.filter(e => e?.organization?.id === organizationId) || []
  }
  return []
}
