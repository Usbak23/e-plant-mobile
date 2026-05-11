import {map, catchError, filter, switchMap, concatMap, delay} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/sync-queue/actions'
import {StreamType} from '@app/domain/states/types'
import {ISyncQueueItem} from '@app/domain/states/sync-queue/actions'

const autoSyncOnConnectionRestore: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter((action: any) => {
      // Listen untuk connection restored
      return action.type === 'Network/CONNECTION_CHANGE' && action.payload?.isConnected === true
    }),
    switchMap(() => {
      const state = state$.value
      const queue = state.syncQueue?.queue || []
      const pendingItems = queue.filter((item: ISyncQueueItem) => item.status === 'pending')

      if (pendingItems.length === 0) {
        return of()
      }

      console.log(`🔄 Auto-sync started: ${pendingItems.length} pending items`)

      return from(pendingItems).pipe(
        concatMap((item: ISyncQueueItem) => {
          // Update status to syncing
          return of(
            actions.updateSyncStatus({
              id: item.id,
              status: 'syncing',
            }),
          ).pipe(
            switchMap(() => {
              // Attempt to sync based on type
              if (item.type === 'BPBKS') {
                return from(api.bpbksService.createBPBKS(item.data)).pipe(
                  map((response: any) => {
                    console.log(`✅ BPBKS synced: ${item.id}`)
                    return actions.updateSyncStatus({
                      id: item.id,
                      status: 'success',
                    })
                  }),
                  catchError((error: any) => {
                    console.error(`❌ BPBKS sync failed: ${item.id}`, error.message)
                    return of(
                      actions.updateSyncStatus({
                        id: item.id,
                        status: 'error',
                        error: error?.response?.data?.message?.id || error.message || 'Sync failed',
                      }),
                    )
                  }),
                )
              }

              // Add more types here (RKT, RKB, RKH, etc.)
              return of(
                actions.updateSyncStatus({
                  id: item.id,
                  status: 'error',
                  error: `Unknown type: ${item.type}`,
                }),
              )
            }),
            delay(500), // Delay between syncs to avoid overwhelming server
          )
        }),
      )
    }),
  )
}

export default [autoSyncOnConnectionRestore]
