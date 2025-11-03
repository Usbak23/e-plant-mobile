import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'
import {IRKHHarvestAllRowData} from '@app/models/eplant/RKHHarvest'

//default behavior is filtered
export const useRKHHarvestAll = (divisionId: string, dateParams: string): IRKHHarvestAllRowData[] => {
  const {rkhHarvestAll} = useSelector((state: RootStateType) => state.rkhHarvest)
  if (rkhHarvestAll?.data?.docs && Array.isArray(rkhHarvestAll.data.docs)) {
    const filtered = rkhHarvestAll.data.docs.filter(r => {
      const temp = r.numberTaxation.slice(-6)
      let date = ''
      if (!isNaN(parseInt(temp))) {
        date = temp
      }
      return date == dateParams && r.akp?.block?.division?.id == divisionId
    })
    return filtered
  }
  return []
}
