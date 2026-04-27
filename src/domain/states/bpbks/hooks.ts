import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'
import generateListTemp from '../utils/generateListTemp'
import {BkmEmployee2} from '@app/models/eplant/BKM'
import moment from 'moment'

export const useBPBKSLists = ({divisionId, foremanId, date}: any): {hasOffline: Boolean; docs: BkmEmployee2[]} => {
  const {bpbksAll, bpbksListTemp} = useSelector((state: RootStateType) => state.bpbks)
  const listTemp = bpbksListTemp
    ?.filter((item: any) => item.divisionId === divisionId && item.foremanId === foremanId && item.date === date)
    .map((item: any) => {
      return item?.tphs?.map((t: any) => ({...t, cutNumber: item.cutNumber, syncStatus: item.syncStatus, syncError: item.syncError}))
    })
    .flat()

  const list =
    moment(bpbksAll?.data?.bpbks?.date).format('YYYY-MM-DD') === date &&
    bpbksAll?.data?.bpbks?.division?.id === divisionId &&
    bpbksAll?.data?.bpbks?.foreman?.id === foremanId
      ? bpbksAll?.data?.docs
      : []

  return {
    docs: generateListTemp(list, listTemp).map(e => ({
      ...e,
      a: e?.harvester?.name,
      b: e?.bpbks?.foreman?.name,
      c: e?.harvester?.nip,
      d: e?.tph?.name,
      e: e?.tph?.block?.code,
      f: e?.harvester?.role?.name,
    })),
    hasOffline: Boolean(listTemp?.length),
  }
}
