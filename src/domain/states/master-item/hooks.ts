import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import {useSelector} from 'react-redux'
import {RootStateType} from '../store'

const formatOption = (item: IStdEntity): IOption => ({
  value: item.id,
  label: item.name,
})

export const useMasterItemOptions = (): IOption[] => {
  const data = useSelector((state: RootStateType) => state.masterItem?.masterItemAll?.data || [])
  return data.map(formatOption)
}
