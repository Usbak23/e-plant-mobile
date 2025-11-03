import flux, {RootStateType} from '@domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
let syncInv: any
const FIVE_SEC_IN_MILISEC = 1000 * 5
const defaultInterval = FIVE_SEC_IN_MILISEC

export const syncData = () => {
  flux.store.dispatch(flux.actions.syncAKP())
  flux.store.dispatch(flux.actions.syncRKH())
  // flux.store.dispatch(flux.actions.syncRKHTakeCare())
}

const useSyncData = (interval = defaultInterval) => {
  const isConnected = useSelector((state: RootStateType) => state.network.isConnected)

  useEffect(() => {
    clearInterval(syncInv)
    syncInv = setInterval(() => {
      if (isConnected) {
        syncData()
      }
    }, interval)
  }, [])

  useEffect(() => {
    if (isConnected) {
      syncData()
    }
  }, [isConnected])

  return null
}

export default useSyncData
