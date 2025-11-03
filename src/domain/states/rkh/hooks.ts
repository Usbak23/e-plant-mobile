import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'
import generateListTemp from '../utils/generateListTemp'
import {IRKHAllRow, IRKHRow} from '@app/models/eplant/RKH'
import {useRKHTakeCareAll} from '../rkh-take-care/hooks'
import {useRKHHarvestAll} from '../rkh-harvest/hooks'
import moment from 'moment'

export const useRKHLists = (): IRKHRow[] => {
  const {rkhList, rkhListTemp} = useSelector((state: RootStateType) => state.rkh)
  return generateListTemp(rkhList?.data?.docs, rkhListTemp)
}

export const useRKHAll = (organizationId: string, divisionId: string, year: string, month: string): IRKHAllRow[] => {
  const {rkhAll, rkhListTemp} = useSelector((state: RootStateType) => state.rkh) //TODO: Please check this rkhListTemp
  if (rkhAll?.data?.docs && Array.isArray(rkhAll.data.docs)) {
    const filtered = rkhAll.data.docs.filter((rkh: IRKHRow) => {
      const date = rkh.dateRkh.substring(0, 10)
      const _month = date.substring(5, 7)
      const _year = date.substring(0, 4)
      return rkh.division?.id == divisionId && _year == year && _month == month
    })
    return generateListTemp(filtered, rkhListTemp) // <-- TODO: probably we need to filter the temp list too
  }
  return generateListTemp([], rkhListTemp)
}

export const useSummaryRKH = (divisionId: string, dateParam: string) => {
  const rkhTakeCareList = useRKHTakeCareAll(dateParam)
  const rkhHarvestList = useRKHHarvestAll(divisionId, moment(dateParam).format('DDMMYY'))
  const mergedList = [...rkhTakeCareList, ...rkhHarvestList]
  const totalPlanHk = mergedList.reduce((acc, cur) => acc + cur.totalPlanHk, 0)
  const totalActualHk = mergedList.reduce((acc, cur) => acc + cur.totalActualHk, 0)
  return {
    totalPlanHk,
    totalActualHk,
  }
}
