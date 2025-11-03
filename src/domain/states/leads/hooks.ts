import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'
import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import {ILeadRow} from '@app/models/crm/Lead'
import generateListTemp from '../utils/generateListTemp'

const formatOption = (item: IStdEntity): IOption => ({
  value: item._id,
  label: item.name,
})

export const useLeadOptions = (): IOption[] => {
  const data = useSelector((state: RootStateType) => state.lead?.leadAll?.data || [])
  return data.map(formatOption)
}

export const useLeadLists = (): ILeadRow[] => {
  const {leadList, leadListTemp} = useSelector((state: RootStateType) => state.lead)
  return generateListTemp(leadList?.data?.docs, leadListTemp)
}
