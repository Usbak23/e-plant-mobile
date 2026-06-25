import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from './actions'
import {StreamType} from '@app/domain/states/types'
import uuid from 'react-native-uuid'

const getSpbLocalList: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getSpbLocalList.request)),
    switchMap(action =>
      from(api.spbLocalService.list(action.payload.data)).pipe(
        map(({data}: any) => actions.getSpbLocalList.success({loading: false, data: data.response})),
        catchError(error => of(actions.getSpbLocalList.failure({loading: false, error}))),
      ),
    ),
  )
}

const getSpbLocalDetail: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getSpbLocalDetail.request)),
    switchMap(action =>
      from(api.spbLocalService.detail(action.payload.data)).pipe(
        map(({data}: any) => actions.getSpbLocalDetail.success({loading: false, data: data.response})),
        catchError(error => of(actions.getSpbLocalDetail.failure({loading: false, error}))),
      ),
    ),
  )
}

const createSpbLocal: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createSpbLocal.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      const tempId = uuid.v4() as string
      if (!isConnected && newData) {
        return of(
          actions.addSpbLocalTemp({...action.payload.data, tempId}),
          actions.createSpbLocal.success({loading: false, data: {success: true, tempId, offline: true, timestamp: Date.now()}}),
          // Jangan clear form di sini, biarkan form yang handle
          // actions.clearSpbLocalForm(),
          actions.syncSpbLocal(),
        )
      }
      return from(api.spbLocalService.create(action.payload.data)).pipe(
        concatMap(({data}: any) => {
          const syncingTempId = action.payload.data?.tempId
          const result: any[] = [
            actions.createSpbLocal.success({loading: false, data: data.response}),
            actions.clearSpbLocalForm(),
            actions.syncSpbLocal(),
          ]
          if (syncingTempId) result.unshift(actions.deleteSpbLocalTemp(action.payload.data) as any)
          return result
        }),
        catchError(error => {
          const syncingTempId = action.payload.data?.tempId
          if (newData && error.message === 'Network Error') {
            return of(
              actions.addSpbLocalTemp({...action.payload.data, tempId: uuid.v4() as string}),
              actions.createSpbLocal.success({loading: false, data: {success: true, offline: true, timestamp: Date.now()}}),
              // Jangan clear form di sini
              // actions.clearSpbLocalForm(),
            )
          }
          if (syncingTempId) {
            return of(
              actions.updateSpbLocalTempStatus({tempId: syncingTempId, syncStatus: 'failed', syncError: error?.message}),
              actions.createSpbLocal.failure({loading: false, error}),
              actions.clearSpbLocalForm(),
            )
          }
          return of(actions.createSpbLocal.failure({loading: false, error}), actions.clearSpbLocalForm())
        }),
      )
    }),
  )
}

const updateSpbLocal: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.updateSpbLocal.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return of(
          actions.editSpbLocalTemp(action.payload.data),
          actions.updateSpbLocal.success({loading: false, data: {}}),
          actions.clearSpbLocalForm(),
        )
      }
      return from(api.spbLocalService.update(action.payload.data.id, action.payload.data)).pipe(
        concatMap(({data}: any) => [
          actions.updateSpbLocal.success({loading: false, data: data.response}),
          actions.clearSpbLocalForm(),
        ]),
        catchError(error => of(actions.updateSpbLocal.failure({loading: false, error}), actions.clearSpbLocalForm())),
      )
    }),
  )
}

const deleteSpbLocal: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteSpbLocal.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId != undefined || Boolean(action.payload.data?.isTemp)
      if (isTemp) {
        return of(
          actions.deleteSpbLocalTemp(action.payload.data),
          actions.deleteSpbLocal.success({loading: false, data: {}}),
          actions.clearSpbLocalDelete(),
        )
      }
      return from(api.spbLocalService.deleteSpbLocal(action.payload.data)).pipe(
        concatMap(({data}: any) => [
          actions.deleteSpbLocal.success({loading: false, data: data.response}),
          actions.clearSpbLocalDelete(),
        ]),
        catchError(error => of(actions.deleteSpbLocal.failure({loading: false, error}), actions.clearSpbLocalDelete())),
      )
    }),
  )
}

const syncSpbLocal: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncSpbLocal)),
    concatMap(() => {
      const loading = state$?.value?.spbLocal?.formStatus?.loading
      const isConnected = state$?.value?.network.isConnected
      const listTemp = state$?.value?.spbLocal?.spbLocalListTemp || []
      
      // Cari item pending (belum di-sync atau failed)
      const pendingItems = listTemp.filter((item: any) => 
        item.syncStatus === 'pending' || item.syncStatus === 'failed'
      )
      
      const allow = Boolean(isConnected && !loading && pendingItems.length > 0)
      
      if (!allow) return EMPTY
      
      // Ambil item pertama dari pending list untuk di-sync
      const itemToSync = pendingItems[0]
      
      console.log(`🔄 Syncing SPB Local (${pendingItems.length} remaining): ${itemToSync.tempId}`)
      
      return [
        actions.updateSpbLocalTempStatus({tempId: itemToSync.tempId, syncStatus: 'syncing'}),
        actions.createSpbLocal.request({loading: true, data: itemToSync}),
      ]
    }),
  )
}

// Auto-sync saat network kembali online
const autoSyncOnOnline: StreamType = (action$, state$) => {
  return action$.pipe(
    filter((action: any) => action.type === '@@network-connectivity/CONNECTION_CHANGE'),
    concatMap((action: any) => {
      const isNowOnline = action.payload?.isConnected === true
      const listTemp = state$.value?.spbLocal?.spbLocalListTemp || []
      const hasPendingItems = listTemp.length > 0
      
      // Trigger sync jika baru online dan ada pending items
      if (isNowOnline && hasPendingItems) {
        console.log(`🔄 Network back online! Auto-syncing ${listTemp.length} pending SPB Local items...`)
        return [actions.syncSpbLocal()]
      }
      return EMPTY
    }),
  )
}

export default [getSpbLocalList, getSpbLocalDetail, createSpbLocal, updateSpbLocal, deleteSpbLocal, syncSpbLocal, autoSyncOnOnline]
