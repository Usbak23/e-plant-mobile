import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'
import generateListTemp from '../utils/generateListTemp'
import {BkmEmployee2} from '@app/models/eplant/BKMTakeCare'

export const useBKMTakeCareLists = (
  {divisionId, foremanId, date}: any,
  subActivityId: string,
): {hasOffline: Boolean; docs: BkmEmployee2[]} => {
  if (!subActivityId) {
    return {hasOffline: false, docs: []}
  }

  const bkmTakeCareAPIResponse = useSelector((state: RootStateType) => state?.bkmTakeCare.bkmTakeCareDetailMobile)
  return {hasOffline: false, docs: []}
  const {bkmTakeCareDetailMobile, bkmTakeCareListTemp} = useSelector((state: RootStateType) => state.bkmTakeCare)
  const listTemp = bkmTakeCareListTemp
    ?.filter(
      (item: any) =>
        item.divisionId === divisionId &&
        item.foremanId === foremanId &&
        item.date === date &&
        item?.subActivity == subActivityId,
    )
    .map((item: any) => item.bkmEmployee)
    .flat()
  // const list =
  //   bkmTakeCareDetailMobile?.data?.date === date &&
  //   bkmTakeCareDetailMobile?.data?.divisionId === divisionId &&
  //   bkmTakeCareDetailMobile?.data?.foremanId === foremanId &&
  //   bkmTakeCareDetailMobile?.data?.subActivity?.id === subActivityId
  //     ? bkmTakeCareDetailMobile?.data?.bkmEmployees
  //     : []

  const list =
    bkmTakeCareDetailMobile?.data?.date === date &&
    bkmTakeCareDetailMobile?.data?.division?.id === divisionId &&
    bkmTakeCareDetailMobile?.data?.foreman?.id === foremanId &&
    bkmTakeCareDetailMobile?.data?.subActivity?.id === subActivityId
      ? bkmTakeCareDetailMobile?.data?.bkmEmployees
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
