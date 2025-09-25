import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import {useSelector} from 'react-redux'
import {RootStateType} from '../store'

const formatOption = (item: IStdEntity): IOption => ({
  value: item.id,
  label: item.name,
})

export const useOrganizationOptions = (): IOption[] => {
  const organizations = useSelector((state: RootStateType) => state.organization?.organizationAll?.data || []) || []
  if (Array.isArray(organizations)) {
    return organizations.map(formatOption)
  }
  return []
}

export const useOrganizationAll = () => {
  const organizations = useSelector((state: RootStateType) => state.organization?.organizationAll?.data || []) || []
  if (Array.isArray(organizations)) {
    return organizations.map(formatOption)
  }
  return []
}
