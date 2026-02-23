import { useSelector } from 'react-redux'
import { RootStateType } from '@domain/states/store'
import IStdEntity from '@app/models/commons/IStdEntity'
import IOption from '@app/models/commons/IOption'
import { ICurrentUser, ICurrentUserDivisionInfo, IUserRow, IUserStd } from '@app/models/eplant/User'
import { ROLE_ACCESS_SLUG } from '@app/models/eplant/Role'

export const useAccessIdsCrm = () => {
  const userAccessCRM = useSelector(
    (state: RootStateType) => state?.user?.userAccess?.data?.role?.accessMenus?.CRM || [],
  )
  const mapped = userAccessCRM.map(el => [el.accessMenu._id, ...el.accessTypes.map(type => type._id)]).flat()
  return mapped
}

export const formatOption = (item: IUserRow | IUserStd): IOption => ({
  value: item.id,
  label: item.name + ' - ' + item.nip,
})

export const useUserDataLogin = () => {
  const user = useSelector((state: RootStateType) => state.user?.userProfile)
  return user
}

export const useUserDataCredential = () => {
  const user = useSelector((state: RootStateType) => state.user?.userCredential)
  return user
}

export const useUsersByOrganization = (organizationId?: string): IOption[] => {
  const users = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  if (users && Array.isArray(users) && organizationId) {
    const filtered = users.filter((user: IUserRow) => user.organization == organizationId)
    return filtered.map(formatOption)
  }
  return []
}

// 353 -> checked. looks ok
export const useUsersByOrganizationAndRole = (organizationId?: string, roleCategory?: string): IOption[] => {
  const users = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  if (users && organizationId) {
    const filtered = users.filter(
      (user: IUserRow) =>
        user?.userDivisions?.some(d => d?.division?.organization?.id === organizationId) &&
        user?.role?.roleCategory?.map(r => r?.toLowerCase()).includes(roleCategory ? roleCategory?.toLowerCase() : ''),
    )
    return filtered.map(formatOption)
  }
  return []
}

export const useUsersByOrganization2 = (organizationId?: string): IOption[] => {
  const users = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  if (users && organizationId) {
    const filtered = users.filter((user: IUserRow) =>
      user?.userDivisions?.some(d => d?.division?.organization?.id === organizationId),
    )
    return filtered.map(formatOption)
  }
  return []
}

export const useUsersByDivision = (divisionId?: string): IOption[] => {

  const users = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  console.log(users.length)
  if (users && Array.isArray(users) && divisionId) {
    const filtered = users.filter((user: IUserRow) => user?.userDivisions?.some(d => d?.division?.id === divisionId))
    return filtered.map(formatOption)
  }
  return []
}

export const useUsersByOrganizationFull = (organizationId?: string): IUserRow[] => {
  const users = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  if (users && Array.isArray(users) && organizationId) {
    const filtered = users.filter((user: IUserRow) => user.organization == organizationId)
    return filtered
  }
  return []
}

export const useUsersByDivisionFull = (divisionId?: string): IUserRow[] => {
  const users = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  if (users && Array.isArray(users) && divisionId) {
    const filtered = users.filter((user: IUserRow) => user?.userDivisions?.some(d => d?.division?.id === divisionId))
    return filtered
  }
  return []
}

export const useUsers = (organizationId?: string): IOption[] => {
  const users = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  return users.map(formatOption)
}

export const useUsersByRole = (roleId?: string) => {
  const users = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  if (users && Array.isArray(users) && roleId) {
    const filtered = users.filter(user => user?.role?.id == roleId)
    return filtered
  }
  return []
}

export const useUsersCostByRoleId = (roleId?: string) => {
  const users = useSelector((state: RootStateType) => state.user?.userAllCost?.data?.employee || [])
  if (users && Array.isArray(users) && roleId) {
    const filtered = users.filter(user => user?.role?.id == roleId)
    return filtered
  }

  return []
}

export const useCurrentUserInfo = (): ICurrentUser | undefined => {
  const user = useSelector((state: RootStateType) => state.user?.currentUserInfo?.data)
  return user
}

export const useLoggedInOrganizationsAndDivision = () => {
  const divisions = useSelector((state: RootStateType) => state.user?.currentUserInfo?.data?.userDivisions || [])
  const orgs: { value: string; label: string; divisions: IOption[] }[] = []
  divisions.forEach((d: ICurrentUserDivisionInfo) => {
    const isExists = orgs.find(v => v.value == d.division?.organization?.id)
    if (!isExists && d.division) {
      const tempDivs = divisions
        .filter(
          (x: ICurrentUserDivisionInfo) =>
            x.division?.organization?.id == d.division?.organization?.id &&
            x.division != null &&
            x.division != undefined,
        )
        .map((d: ICurrentUserDivisionInfo) => ({
          label: d.division?.name,
          value: d.division?.id,
        }))
      tempDivs.sort((a: IOption, b: IOption) => (a.label > b.label ? 1 : -1))
      orgs.push({
        value: d.division?.organization?.id || '',
        label: d.division?.organization?.name || '',
        divisions: tempDivs,
      })
    }
  })
  orgs.sort((a, b) => (a.label > b.label ? 1 : -1))
  return orgs
}

export const useLoggedInOrganizationsAndDivisionAndBlock = () => {
  const divisions = useSelector((state: RootStateType) => state.user?.currentUserInfo?.data?.userDivisions || [])
  const orgs: { value: string; label: string; divisions: any[] }[] = []
  divisions.forEach((d: ICurrentUserDivisionInfo) => {
    const isExists = orgs.find(v => v.value == d.division?.organization?.id)
    if (!isExists && d.division) {
      const tempDivs = divisions
        .filter(
          (x: ICurrentUserDivisionInfo) =>
            x.division?.organization?.id == d.division?.organization?.id &&
            x.division != null &&
            x.division != undefined,
        )
        .map((d: ICurrentUserDivisionInfo) => {
          return {
            label: d.division?.name,
            value: d.division?.id,
            blocks: d.division?.blocks
              ? d.division?.blocks.map(b => ({ value: b.id, label: b.code })).sort((a, b) => (a.label > b.label ? 1 : -1))
              : [],
          }
        })
      tempDivs.sort((a: IOption, b: IOption) => (a.label > b.label ? 1 : -1))
      orgs.push({
        value: d.division?.organization?.id || '',
        label: d.division?.organization?.name || '',
        divisions: tempDivs,
      })
    }
  })
  orgs.sort((a, b) => (a.label > b.label ? 1 : -1))
  return orgs
}

// It is for master data collection
export const useManagedOrganizations = () => {
  const workingDivisions = useCurrentUserInfo()?.userDivisions || []
  const organizationsUnique: { id: string; name: string }[] = []
  workingDivisions.forEach((w: ICurrentUserDivisionInfo) => {
    const isExists = organizationsUnique.find(o => o.id == w.division?.organization?.id)
    if (!isExists) {
      organizationsUnique.push({ id: w.division?.organization?.id, name: w.division?.organization?.name })
    }
  })
  return organizationsUnique
}

export const useManagedDivisions = () => {
  const workingDivisions = useCurrentUserInfo()?.userDivisions || []
  const managedDivisions: { id: string; name: string }[] = []
  workingDivisions.forEach((w: any) => {
    const isExists = managedDivisions.find(d => d.id == w.division?.id)
    if (!isExists) {
      managedDivisions.push({ id: w.division?.id, name: w.division?.name })
    }
  })
  return managedDivisions
}

export const useIsAllowedToSeeOrganization = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_ORGANIZATION)
  }
  return false
}

export const useIsAllowedToOrganizationOrganization = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  // if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
  //   return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_ORGANIZATION)
  // }
  return false
}

export const useIsAllowedToSeeDivision = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_DIVISION)
  }
  return false
}

export const useIsAllowedToOrganizeDivision = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_DIVISION)
  }
  return false
}

export const useIsAllowedToSeeBlock = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_BLOCK)
  }
  return false
}

export const useIsAllowedToOrganizeBlock = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_BLOCK)
  }
  return false
}

export const useIsAllowedToSeeTPH = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_TPH)
  }
  return false
}

export const useIsAllowedToOrganizeTPH = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_TPH)
  }
  return false
}

export const useIsAllowedToSeeMaterial = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_MATERIAL)
  }
  return false
}

export const useIsAllowedToOrganizeMaterial = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_MATERIAL)
  }
  return false
}

export const useIsAllowedToOrganizePurchasementMaterial = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some(
      (role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_MATERIAL_PURCHASEMENT,
    )
  }
  return false
}

export const useIsAllowedToOrganizeReceivementMaterial = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_MATERIAL_RECEIVEMENT)
  }
  return false
}

export const useIsAllowedToOrganizeStock = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_STOCK)
  }
  return false
}

export const useIsAllowedToSeeToolsAndItems = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_ALAT)
  }
  return false
}

export const useIsAllowedToOrganizeToolsAndItems = () => {
  const currentUser = useCurrentUserInfo()

  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_ALAT)
  }
  return false
}

// Rencana
export const useIsAllowedToSeeAKP = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_AKP)
  }
  return false
}

export const useIsAllowedToOrganizeAKP = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_AKP)
  }
  return false
}

export const useIsAllowedToSeeTaxation = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_TAXATION)
  }
  return false
}

export const useIsAllowedToOrganizeTaxation = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_TAXATION)
  }
  return false
}

export const useIsAllowedToSeeCensus = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_CENSUS)
  }
  return false
}

export const useIsAllowedToOrganizeCensus = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_CENSUS)
  }
  return false
}

export const useIsAllowedToSeeRKH = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_RKH)
  }
  return false
}

export const useIsAllowedToOrganizeRKH = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_RKH)
  }
  return false
}

//absensi
export const useIsAllowedToSeeAbsensi = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_ABSENSI)
  }
  return false
}

export const useIsAllowedToOrganizeAbsensi = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_ABSENSI)
  }
  return false
}

//panen
export const useIsAllowedToSeeBKMHarvest = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_BKM_HARVEST)
  }
  return false
}

export const useIsAllowedToOrganizeBKMHarvest = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_BKM_HARVEST)
  }
  return false
}

export const useIsAllowedToSeePMA = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_PMA)
  }
  return false
}

export const useIsAllowedToOrganizePMA = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_PMA)
  }
  return false
}

export const useIsAllowedToSeeBPBKS = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_BPBKS)
  }
  return false
}

export const useIsAllowedToOrganizeBPBKS = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_BPBKS)
  }
  return false
}

export const useIsAllowedToSeeTonnageGarden = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_TONNAGE_GARDEN)
  }
  return false
}

export const useIsAllowedToOrganizeTonnageGarden = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_TONNAGE_GARDEN)
  }
  return false
}

export const useIsAllowedToSeeTonnagePKS = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_TONNAGE_PKS)
  }
  return false
}

export const useIsAllowedToOrganizeTonnagePKS = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_TONNAGE_PKS)
  }
  return false
}

//report
export const useIsAllowedToSeeReportAKP = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_AKP)
  }
  return false
}

export const useIsAllowedToSeeReportPMB = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_PMB)
  }
  return false
}

export const useIsAllowedToSeeReportYield = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_YIELD)
  }
  return false
}

export const useIsAllowedToSeeReportRKBTakeCare = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_RKB_TAKE_CARE)
  }
  return false
}

export const useIsAllowedToSeeReportRKBHarvest = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_RKB_HARVEST)
  }
  return false
}

export const useIsAllowedToSeeReportBJR = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BJR)
  }
  return false
}

export const useIsAllowedToSeeReportWage = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_WAGE_EMPLOYEE)
  }
  return false
}

export const useIsAllowedToSeeReportWageDeduction = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_WAGE_DEDUCTION)
  }
  return false
}

export const useIsAllowedToSeeReportRRP = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_RRP)
  }
  return false
}

export const useIsAllowedToSeeReportCropBook = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_CROPBOOK)
  }
  return false
}

export const useIsAllowedToSeeReportTonnageGarden = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_TONNAGE_GARDEN)
  }
  return false
}

export const useIsAllowedToSeeReportTonnagePKS = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_TONNAGE_PKS)
  }
  return false
}

export const useIsAllowedToSeeReportPMA = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_PMA)
  }
  return false
}

export const useIsAllowedToSeeReportBPK = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BPK)
  }
  return false
}

export const useIsAllowedToSeeReportKapelPusingan = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_CHAPEL)
  }
  return false
}

export const useIsAllowedToSeeReportBMP = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BMP)
  }
  return false
}

//rawat
export const useIsAllowedToSeeBKMTakeCare = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_BKM_TAKE_CARE)
  }
  return false
}

export const useIsAllowedToOrganizeBKMTakeCare = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_BKM_TAKE_CARE)
  }
  return false
}

export const useIsAllowedToOrganizeFertilizationRealization = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_FERTILIZATION_REALIZATION)
  }
  return false
}

export const useIsAllowedToSeeFertilizationRealization = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_FERTILIZATION_REALIZATION)
  }
  return false
}

//berita acara
export const useIsAllowedToSeeFieldReport = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_FIELD_REPORT)
  }
  return false
}

export const useIsAllowedToOrganizeFieldReport = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_FIELD_REPORT)
  }
  return false
}

//request (permintaan)
export const useIsAllowedToSeeMyRequest = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_MY_REQUEST)
  }
  return false
}

export const useIsAllowedToOrganizeMyRequest = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_MY_REQUEST)
  }
  return false
}

export const useIsAllowedToSeeListOfRequest = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_LIST_OF_REQUEST)
  }
  return false
}

export const useIsAllowedToOrganizeListOfRequest = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_LIST_OF_REQUEST)
  }
  return false
}

export const useIsAllowedToSeeWarehouseManagement = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_WAREHOUSE_MANAGEMENT)
  }
  return false
}

export const useIsAllowedToOrganizeWarehouseManagement = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.ORGANIZE_WAREHOUSE_MANAGEMENT)
  }
  return false
}


//dashboard
export const useIsAllowedToSeeDashboard = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    // return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD)
    return currentUser.role.roleModules.some((role: any) => {
      return (
        role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_TOTAL_PRODUCTION ||
        role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_TOTAL_TAKECARE_AND_FERTILIZATION ||
        role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_PRODUCTION_PER_MANDOR ||
        role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_PRODUCTION_PER_HARVESTER ||
        role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_QUALITY_OF_FRUIT_PER_BLOCK
      )
    })
  }
  return false
}

export const useIsAllowedToSeeDashboardTakeCareResult = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_TAKE_CARE_RESULT)
  }
  return false
}

export const useIsAllowedToSeeDashboardBudgeting = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_BUDGETING)
  }
  return false
}

export const useIsAllowedToSeeDashboardTakeCareBudget = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_TAKE_CARE_BUDGET)
  }
  return false
}

export const useIsAllowedToSeeDashboardHarvestBudget = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
    return currentUser.role.roleModules.some((role: any) => role.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_HARVEST_BUDGET)
  }
  return false
}

export const useTypeEmployeeOptionsBoronganHarian = () => {
  return [
    { label: 'Karyawan Borongan', value: 'Karyawan Borongan' },
    { label: 'Karyawan Harian', value: 'Karyawan Harian' }
  ]
}

export const useWorkDay = () => {
  return [
    { label: 'Hari Biasa', value: 'Hari Biasa' },
    { label: 'Hari Minggu/Libur', value: 'Hari Minggu/Libur' }
  ]
}

// Approval/Persetujuan
export const useIsAllowedToApproveRKT = () => {
  const currentUser = useCurrentUserInfo()
  if (currentUser?.role?.isSuperAdmin) {
    return true
  }
  // Check if user has approvals assigned (user is an approver)
  // Backend should handle the actual approval logic based on user's approval level
  return currentUser?.approvals && currentUser.approvals.length > 0
}






