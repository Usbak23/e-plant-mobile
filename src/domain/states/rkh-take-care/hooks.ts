import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'
import generateListTemp from '../utils/generateListTemp'
import {IRKHTakeCareRow} from '@app/models/eplant/RKHTakeCare'
import moment from 'moment'

export const useRKHTakeCareLists = (): IRKHTakeCareRow[] => {
  const {rkhTakeCareList, rkhTakeCareListTemp} = useSelector((state: RootStateType) => state.rkhTakeCare)
  return generateListTemp(rkhTakeCareList?.data?.docs, rkhTakeCareListTemp)
}

export const useRKHTakeCareOnLatestPeriod = (divisionId?: string): IRKHTakeCareRow[] => {
  const {rkhTakeCareList, rkhTakeCareListTemp} = useSelector((state: RootStateType) => state.rkhTakeCare)
  if (rkhTakeCareList?.data?.docs && Array.isArray(rkhTakeCareList.data.docs)) {
    const filtered = rkhTakeCareList.data.docs
      .filter((rkh: IRKHTakeCareRow) => {
        return rkh.category == 'Rawat' && rkh.block?.division?.id == divisionId
      })
      .map((e: IRKHTakeCareRow) => ({
        ...e,
        a: e?.subActivity?.name,
        b: e?.block?.code,
        c: e?.block?.harvestForeman?.name,
      }))

    return generateListTemp(filtered, rkhTakeCareListTemp).sort((a: any, b: any) => {
      return (new Date(a.rkh?.dateRkh) as any) - (new Date(b.rkh?.dateRkh) as any)
    })
  }
  return generateListTemp([], rkhTakeCareListTemp).sort((a: any, b: any) => {
    return (new Date(a.rkh?.dateRkh) as any) - (new Date(b.rkh?.dateRkh) as any)
  })
}

export const useRKHTakeCareAllOnSameMonthAndYear = (
  month: string,
  year: string,
  divisionId?: string,
): IRKHTakeCareRow[] => {
  const {rkhTakeCareList, rkhTakeCareListTemp} = useSelector((state: RootStateType) => state.rkhTakeCare)
  if (rkhTakeCareList?.data?.docs && Array.isArray(rkhTakeCareList.data.docs)) {
    const filtered = rkhTakeCareList.data.docs
      .filter((rkh: IRKHTakeCareRow) => {
        const parsedDate = moment(rkh.rkh.dateRkh).format('MMYYYY')
        return (
          parsedDate.toString() == `${month}${year}` && rkh.category == 'Rawat' && rkh.block?.division?.id == divisionId
        )
      })
      .map((e: IRKHTakeCareRow) => ({
        ...e,
        a: e?.subActivity?.name,
        b: e?.block?.code,
        c: e?.block?.harvestForeman?.name,
      }))
    return generateListTemp(filtered, rkhTakeCareListTemp).sort((a: any, b: any) => {
      return (new Date(a.rkh?.dateRkh) as any) - (new Date(b.rkh?.dateRkh) as any)
    })
  }
  return generateListTemp([], rkhTakeCareListTemp).sort((a: any, b: any) => {
    return (new Date(a.rkh?.dateRkh) as any) - (new Date(b.rkh?.dateRkh) as any)
  })
}

export const useRKHTakeCareAll = (date: string, divisionId?: string): IRKHTakeCareRow[] => {
  const rkhTakeCareListTemp = useSelector((state: RootStateType) => state.rkhTakeCare?.rkhTakeCareListTemp) //TODO: Please check this rkhTakeCareListTemp
  const rkhTakeCareList = useSelector((state: RootStateType) => state.rkhTakeCare?.rkhTakeCareList)
  const drafts = rkhTakeCareListTemp || []
  const filteredDrafts = drafts.filter((d: any) => {
    const parsedDate = moment(d?.rkh?.dateRkh).format('DDMMYYYY')
    return (
      parsedDate === moment(date).format('DDMMYYYY') && d.category == 'Rawat' && d.block?.division?.id == divisionId
    )
  })
  if (rkhTakeCareList?.data?.docs && Array.isArray(rkhTakeCareList.data.docs)) {
    const filtered = rkhTakeCareList.data.docs
      .filter((rkh: IRKHTakeCareRow) => {
        const parsedDate = moment(rkh.rkh.dateRkh).format('DDMMYYYY')
        return (
          parsedDate === moment(date).format('DDMMYYYY') &&
          rkh.category == 'Rawat' &&
          rkh.block?.division?.id == divisionId
        )
      })
      .map((e: IRKHTakeCareRow) => ({
        ...e,
        a: e?.subActivity?.name,
        b: e?.block?.code,
        c: e?.block?.harvestForeman?.name,
      }))

    return generateListTemp(filtered, filteredDrafts) // <-- TODO: probably we need to filter the temp list too
  }
  return generateListTemp([], filteredDrafts)
}
