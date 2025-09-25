import {useSelector} from 'react-redux'
import {RootStateType} from '../store'

export const useTphByBlocksFull = (blockId?: string) => {
  const tphs = useSelector((state: RootStateType) => state.tph?.tphAll?.data || [])
  if (blockId && Array.isArray(tphs)) {
    return tphs.filter(e => e?.block?.id === blockId) || []
  }
  return []
}
