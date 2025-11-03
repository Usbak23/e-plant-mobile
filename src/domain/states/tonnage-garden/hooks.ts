import IOption from '@app/models/commons/IOption'
import {ITonnageGardenRow} from '@app/models/eplant/TonnageGarden'
import {useSelector} from 'react-redux'
import {RootStateType} from '../store'

export const useTonnageGardenByItemId = (itemId: string): ITonnageGardenRow[] => {
  const tonnages = useSelector((state: RootStateType) => state.tonnageGarden?.tonnageGardenAll?.data || [])
  return tonnages.filter((t: ITonnageGardenRow) => t.item?.id == itemId)
}

export const useTonnageGardenWithoutPKSByItemId = (itemId: string): ITonnageGardenRow[] => {
  const tonnages = useSelector((state: RootStateType) => state.tonnageGarden?.tonnageGardenWithoutPKS?.data || [])
  return tonnages.filter((t: ITonnageGardenRow) => t.item?.id == itemId)
}
