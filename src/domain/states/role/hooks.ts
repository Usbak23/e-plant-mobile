import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import {IRoleRow} from '@app/models/eplant/Role'
import {useSelector} from 'react-redux'
import {RootStateType} from '../store'

// #353 -> propably not used anymore. gonna delete this on next deployment
const formatOption = (item: IRoleRow): {value: string; label: string; roleCategory: string[]} => ({
  value: item.id,
  label: item.name,
  roleCategory: item.roleCategory || [],
})

export const useRoles = (
  organizationId?: string,
  roleType?: string,
): {value: string; label: string; roleCategory: string[]}[] => {
  const roles = useSelector((state: RootStateType) => state.role?.roleAll?.data || [])
  if (roles && Array.isArray(roles)) {
    if (organizationId) {
      if (roleType) {
        return roles
          .filter(r => {
            // const cat = r.roleCategory ? r.roleCategory.toString().toLowerCase() : ''
            const cats = r.roleCategory ? r.roleCategory.map(r => r.toLocaleLowerCase()) : []
            return r.organization?.id == organizationId && cats.includes(roleType.toLowerCase())
          })
          .map(formatOption)
      }
      return roles.filter(r => r.organization?.id == organizationId).map(formatOption)
    }
    return roles.map(formatOption)
  }
  return []
}
