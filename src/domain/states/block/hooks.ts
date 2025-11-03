import IOption from '@app/models/commons/IOption'
import { IBlockRow } from '@app/models/eplant/Block'
import { useSelector } from 'react-redux'
import { RootStateType } from '../store'
import { formatOption as formatOptionUser } from '@app/domain/states/user/hooks'
import { IUserStd } from '@app/models/eplant/User'

const formatOption = (item: any): IOption => ({
  value: item.id,
  label: item.code,
})

export const useBlockOptions = (divisionId?: string): IOption[] => {
  const blocks = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  if (Array.isArray(blocks)) {
    return blocks?.filter(b => b.division?.id == divisionId).map(formatOption) || []
  }
  return []
}

export const useBlockOptionsByOrganization = (organizationId?: string): IOption[] => {
  const blocks = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  if (Array.isArray(blocks)) {
    return (
      blocks
        ?.filter(b => b.division?.organization?.id == organizationId)
        .map(b => {
          return {
            value: b.id,
            label: b.code + ' - ' + b.division?.name,
          }
        }) || []
    )
  }
  return []
}

export const useForemanTakeCareOptions = (divisionId?: string, preferEmpty?: boolean): IOption[] => {
  const data = useSelector((state: RootStateType) => state.block?.foremanList?.data || [])
  if (divisionId) {
    return (
      data
        ?.filter(b => {
          return b.division?.id == divisionId && b.position == 'Mandor Rawat'
        })
        .map(formatOptionUser) || []
    )
  }
  return preferEmpty ? [] : data?.map(formatOptionUser) || []
}

export const useForemanHarvestOptions = (divisionId?: string, preferEmpty?: boolean): IOption[] => {
  const data = useSelector((state: RootStateType) => state.block?.foremanList?.data || [])
  if (divisionId) {
    return data?.filter(b => b.division?.id == divisionId && b.position == 'Mandor Panen').map(formatOptionUser) || []
  }
  return preferEmpty ? [] : data?.map(formatOptionUser) || []
}

export const useForemanOptions = (divisionId?: string, preferEmpty?: boolean): IOption[] => {
  const data = useSelector((state: RootStateType) => state.block?.foremanList?.data || [])
  if (divisionId) {
    return data?.filter(b => b.division?.id == divisionId).map(formatOptionUser) || []
  }
  return preferEmpty ? [] : data?.map(formatOptionUser) || []
}

export const useForemanFullByDivision = (divisionId?: string): IUserStd[] => {
  const data = useSelector((state: RootStateType) => state.block?.foremanList?.data || [])
  if (divisionId) {
    return data?.filter(b => b.division?.id == divisionId) || []
  }
  return []
}

export const useForemanHarvestFullByDivision = (divisionId?: string): IUserStd[] => {
  const data = useSelector((state: RootStateType) => state.block?.foremanList?.data || [])
  if (divisionId) {
    return data?.filter(b => b.division?.id == divisionId && b.position == 'Mandor Panen') || []
  }
  return []
}

export const useBlocksByDivisionStd = (divisionId?: string): IOption[] => {
  const blocks = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  if (divisionId) {
    return blocks?.filter((e: IBlockRow) => e?.division?.id === divisionId)?.map(formatOption) || []
  }
  return []
}

export const useBlocksWithPlantingYearByDivisionStd = (divisionId?: string): { label: string, value: string, plantingYear: IOption[] }[] => {
  if (!divisionId) {
    return []
  }
  const blocks = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  if (divisionId) {
    return blocks?.filter((e: IBlockRow) => e?.division?.id === divisionId)?.map(v => ({
      label: v.code,
      value: v.id,
      plantingYear: (v.plantingYear || [])?.map(year => ({ label: year, value: year }))
    })) || []
  }
  return []
}

export const usePlantingYearsByBlockId = (blockId?: string): IOption[] => {
  if (!blockId) {
    return []
  }
  const blocks = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  return blocks?.find((b: IBlockRow) => {
    return b.id == blockId
  })?.plantingYear?.map(b => ({ label: b, value: b })) || []
}

export const useBlocksByDivisionFull = (divisionId?: string) => {
  const blocks = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  if (divisionId && Array.isArray(blocks)) {
    return blocks.filter(e => e?.division?.id === divisionId)
  }
  return []
}

export const useSingleBlockById = (id: string): IBlockRow | undefined => {
  const blocks = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  return blocks.find((b: IBlockRow) => b?.id == id)
}
