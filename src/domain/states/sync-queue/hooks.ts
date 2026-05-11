import {useSelector} from 'react-redux'
import {RootStateType} from '@app/domain/states/store'

export const useSyncQueue = () => {
  return useSelector((state: RootStateType) => state.syncQueue?.queue || [])
}

export const usePendingSyncCount = () => {
  return useSelector((state: RootStateType) => state.syncQueue?.pendingCount || 0)
}

export const usePendingSyncByType = (type: string) => {
  return useSelector((state: RootStateType) => {
    const queue = state.syncQueue?.queue || []
    return queue.filter(item => item.type === type && item.status === 'pending')
  })
}

export const useSyncQueueById = (id: string) => {
  return useSelector((state: RootStateType) => {
    const queue = state.syncQueue?.queue || []
    return queue.find(item => item.id === id)
  })
}
