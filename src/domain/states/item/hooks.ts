import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import { useSelector } from 'react-redux'
import { RootStateType } from '../store'

export const useItemOptionsWithMandatoryTypeItem = (typeItem?: string, organizationId?: string): IOption[] => {
  const data = useSelector((state: RootStateType) => state.item?.itemAll?.data || [])
  if (typeItem) {
    return data
      .filter(e => {
        if (organizationId) {
          return e.typeItem == typeItem && e.organizationId == organizationId
        }
        return e.typeItem == typeItem
      })
      .map(t => ({
        label: `${t.name || ''} - ${t.serialNumber}`,
        value: t.id,
      }))
  }
  return []
}

export const useItemOptionsWithExcludeTypeItem = (typeItem?: string, organizationId?: string): IOption[] => {
  const data = useSelector((state: RootStateType) => state.item?.itemAll?.data || [])
  if (typeItem) {
    return data
      .filter(e => {
        if (organizationId) {
          return e.typeItem != typeItem && e.organizationId == organizationId
        }
        return e.typeItem != typeItem
      })
      .map(t => ({
        label: `${t.name || ''} - ${t.serialNumber}`,
        value: t.id,
      }))
  }
  if (organizationId) {
    return data
      .filter(i => i.organizationId == organizationId)
      .map(t => ({
        label: `${t.name || ''} - ${t.serialNumber}`,
        value: t.id,
      }))
  }
  return data.map(t => ({
    label: `${t.name || ''} - ${t.serialNumber}`,
    value: t.id,
  }))
}

export const useItemOptions = (typeItem?: string, organizationId?: string, preferEmpty?: boolean): IOption[] => {
  const data = useSelector((state: RootStateType) => state.item?.itemAll?.data || [])
  if (Boolean(preferEmpty) && !organizationId) {
    return []
  }
  if (typeItem) {
    return data
      .filter(e => {
        if (organizationId) {
          return e.typeItem === typeItem && e.organizationId == organizationId
        }
        return e.typeItem === typeItem
      })
      .map(t => ({
        label: `${t.name || ''} - ${t.serialNumber}`,
        value: t.id,
      }))
  }

  if (organizationId) {
    return data
      .filter(i => i.organizationId == organizationId)
      .map(t => ({
        label: `${t.name || ''} - ${t.serialNumber}`,
        value: t.id,
      }))
  }


  return data.map(t => ({
    label: `${t.name || ''} - ${t.serialNumber}`,
    value: t.id,
  }))
}

export const useItemOptionsByOrganizationId = (typeItem?: string, organizationId?: string): IOption[] => {
  const data = useSelector((state: RootStateType) => state.item?.itemAll?.data || [])
  if (typeItem && organizationId) {
    return data
      .filter(e => e.typeItem === typeItem && e.organizationId == organizationId)
      .map(t => ({
        label: `${t.name || ''} - ${t.serialNumber}`,
        value: t.id,
      }))
  }
  return []
}
