import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/sync-queue/actions'
import {ISyncQueueItem} from '@app/domain/states/sync-queue/actions'

export interface IRSSyncQueue {
  queue: ISyncQueueItem[]
  pendingCount: number
}

const DEFAULT_STATE: IRSSyncQueue = {
  queue: [],
  pendingCount: 0,
}

const syncQueueReducer = createReducer<IRSSyncQueue>(DEFAULT_STATE)
  .handleAction(actions.addToSyncQueue, (state, action) => {
    const newQueue = [...state.queue, action.payload]
    return {
      ...state,
      queue: newQueue,
      pendingCount: newQueue.filter(item => item.status === 'pending').length,
    }
  })
  .handleAction(actions.removeFromSyncQueue, (state, action) => {
    const newQueue = state.queue.filter(item => item.id !== action.payload)
    return {
      ...state,
      queue: newQueue,
      pendingCount: newQueue.filter(item => item.status === 'pending').length,
    }
  })
  .handleAction(actions.updateSyncStatus, (state, action) => {
    const newQueue = state.queue.map(item =>
      item.id === action.payload.id
        ? {...item, status: action.payload.status, error: action.payload.error}
        : item,
    )
    return {
      ...state,
      queue: newQueue,
      pendingCount: newQueue.filter(item => item.status === 'pending').length,
    }
  })
  .handleAction(actions.clearSyncQueue, (state) => {
    return DEFAULT_STATE
  })

export default syncQueueReducer
