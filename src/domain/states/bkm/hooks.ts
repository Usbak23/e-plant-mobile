import { useSelector } from 'react-redux'
import { RootStateType } from '@domain/states/store'
import generateListTemp from '../utils/generateListTemp'
import { BkmEmployee2 } from '@app/models/eplant/BKM'

export const useBKMLists = ({ divisionId, foremanId, date, subActivityId }: any): { hasOffline: Boolean; docs: BkmEmployee2[] } => {
  const { bkmDetailMobile, bkmListTemp } = useSelector((state: RootStateType) => state.bkm)

  const listTemp = bkmListTemp
    ?.filter((item: any) => item.divisionId === divisionId &&
      item.foremanId === foremanId &&
      item.date === date &&
      item?.subActivityId == subActivityId)
    .map((item: any) => item.bkmEmployee)
    .flat()

  const list =
    bkmDetailMobile?.data?.date === date &&
      bkmDetailMobile?.data?.divisionId === divisionId &&
      bkmDetailMobile?.data?.foremanId === foremanId &&
      bkmDetailMobile?.data?.subActivityId == subActivityId
      ? bkmDetailMobile?.data?.bkmEmployees
      : []
  return {
    docs: generateListTemp(list, listTemp).map(e => ({
      ...e,
      s: e?.user?.name,
      s2: e?.user?.nip,
      s3: e?.workStatus?.name,
      s4: e?.block?.code,
    })),
    hasOffline: Boolean(listTemp?.length),
  }
}
