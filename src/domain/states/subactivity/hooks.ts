import IOption from '@app/models/commons/IOption'
import IStdEntity from '@app/models/commons/IStdEntity'
import {ISubActivity} from '@app/models/eplant/SubActivity'
import {useSelector} from 'react-redux'
import {RootStateType} from '../store'

const formatOption = (item: IStdEntity): IOption => ({
  value: item.id,
  label: item.name,
})

export const useSubActivityOptions = (category?: string): IOption[] => {
  const data = useSelector((state: RootStateType) => state.subActivity?.subActivityAll?.data || [])
  if (category) {
    const c = category.toLowerCase()
    if (c == 'rawat' || c == 'panen') {
      return data.filter(d => d.category.toLowerCase() == c).map(formatOption)
    }
    return data.map(formatOption)
  }
  return data.map(formatOption)
}

export const useSubActivityOptionsCode = (category?: string): IOption[] => {
  const data = useSelector((state: RootStateType) => state.subActivity?.subActivityAll?.data || [])
  if (category) {
    const c = category.toLowerCase()
    if (c == 'rawat' || c == 'panen') {
      return data
        .filter(d => d.category.toLowerCase() == c)
        .map((i: ISubActivity) => {
          return {
            value: i.id,
            label: i.accountNumber + ' - ' + i.name,
          }
        })
    }
    return data.map((i: ISubActivity) => {
      return {
        value: i.id,
        label: i.accountNumber + ' - ' + i.name,
      }
    })
  }
  return data.map((i: ISubActivity) => {
    return {
      value: i.id,
      label: i.accountNumber + ' - ' + i.name,
    }
  })
}
