import {createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/sync-queue/constants'

export interface ISyncQueueItem {
  id: string
  type: 'BPBKS' | 'RKT' | 'RKB' | 'RKH' | string
  data: any
  timestamp: number
  status: 'pending' | 'syncing' | 'success' | 'error'
  error?: string
}

export const addToSyncQueue = createAction(c.ADD_TO_SYNC_QUEUE)<ISyncQueueItem>()
export const removeFromSyncQueue = createAction(c.REMOVE_FROM_SYNC_QUEUE)<string>()
export const updateSyncStatus = createAction(c.UPDATE_SYNC_STATUS)<{id: string; status: 'pending' | 'syncing' | 'success' | 'error'; error?: string}>()
export const clearSyncQueue = createAction(c.CLEAR_SYNC_QUEUE)()
