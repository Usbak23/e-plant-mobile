import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'
import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import generateListTemp from '../utils/generateListTemp'
import {IAKPRow} from '@app/models/eplant/AKP'

const formatOption = (item: IStdEntity): IOption => ({
  value: item.id,
  label: item.name,
})

export const useAKPOptions = (): IOption[] => {
  const data = useSelector((state: RootStateType) => state.akp?.akpAll?.data || [])
  return data.map(formatOption)
}

export const useAKPLists = (divisionId: string, date: string): IAKPRow[] => {
  const {akpList, akpListTemp} = useSelector((state: RootStateType) => state.akp)
  const filteredTemp = akpListTemp?.filter(item => item?.divisionId === divisionId && item?.harvestDate === date)
  return generateListTemp(akpList?.data?.docs, filteredTemp)
}
