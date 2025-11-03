import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/rkh/actions'
import {StreamType} from '@app/domain/states/types'
import {IRKHFormData} from '@app/models/eplant/RKH'
import uuid from 'react-native-uuid'

const syncRKH: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncRKH)),
    concatMap(() => {
      const loading = state$?.value?.rkh.formRKHStatus?.loading
      const listTemporary = state$?.value?.rkh?.rkhListTemp || []
      const isConnected = state$?.value?.network.isConnected
      const allow = Boolean(isConnected && !loading && listTemporary.length > 0)
      if (!allow) {
        return EMPTY
      }
      const lastIndex = listTemporary.length - 1
      return [actions.createRKH.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const createRKH: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createRKH.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      if (!isConnected && newData) {
        Object.assign(action.payload.data, {tempId: uuid.v4()})
        return of(
          actions.addRKHTemp(action.payload.data),
          actions.createRKH.success({
            loading: false,
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormRKHStatus(),
          actions.syncRKH(),
        )
      }
      return from(api.rkhService.createRKH(action.payload.data as IRKHFormData)).pipe(
        concatMap((data: any) => [
          actions.deleteRKHTemp(action.payload.data),
          actions.createRKH.success({loading: false, data}),
          actions.clearFormRKHStatus(),
          actions.syncRKH(),
        ]),
        catchError(error => {
          if (newData && error.message === 'Network Error') {
            Object.assign(action.payload.data, {tempId: uuid.v4()})
            return of(
              actions.addRKHTemp(action.payload.data),
              actions.createRKH.success({
                loading: false,
                data: {data: {status: 'success', code: 200, response: action.payload.data}},
              }),
              actions.clearFormRKHStatus(),
            )
          }
          return of(actions.createRKH.failure({loading: false, error}), actions.clearFormRKHStatus())
        }),
      )
    }),
  )
}

const editRKH: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editRKH.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return [
          actions.editRKHTemp(action.payload.data),
          actions.editRKH.success({
            loading: false,
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormRKHStatus(),
        ]
      }
      return from(api.rkhService.editRKH(action.payload.data as IRKHFormData)).pipe(
        concatMap((data: any) => [actions.editRKH.success({loading: false, data}), actions.clearFormRKHStatus()]),
        catchError(error => of(actions.editRKH.failure({loading: false, error}), actions.clearFormRKHStatus())),
      )
    }),
  )
}

const deleteRKH: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteRKH.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return of(
          actions.deleteRKHTemp(action.payload.data),
          actions.deleteRKH.success({loading: false, data: action.payload.data}),
          actions.clearDeleteRKHStatus(),
        )
      }
      return from(api.rkhService.deleteRKH(action.payload.data.id)).pipe(
        concatMap(data => [actions.deleteRKH.success({loading: false, data}), actions.clearDeleteRKHStatus()]),
        catchError(error => of(actions.deleteRKH.failure({loading: false, error}), actions.clearDeleteRKHStatus())),
      )
    }),
  )
}
const getRKHLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKHLists.request)),
    switchMap(action =>
      from(api.rkhService.getRKHLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getRKHLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getRKHLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getRKHSummary: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKHSummary.request)),
    switchMap(action =>
      from(api.rkhService.getRKHSummary(action.payload.data)).pipe(
        map(({data}: any) => {
          return actions.getRKHSummary.success({loading: false, data: data.response})
        }),
        catchError(error => {
          return of(actions.getRKHSummary.failure({loading: false, error}), actions.clearRKHSummary())
        }),
      ),
    ),
  )
}
const getRKHDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKHDetail.request)),
    switchMap(action =>
      from(api.rkhService.getRKHDetail(action.payload.data as string)).pipe(
        map(({data}: any) => actions.getRKHDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getRKHDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getRKHAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKHAll.request)),
    switchMap(action =>
      from(api.rkhService.getRKHAll()).pipe(
        concatMap(({data}: any) => {
          if (action?.payload?.next) {
            return [actions.getRKHAll.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getRKHAll.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getRKHAll.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getRKHAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const clearRkhDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearRkhDraft.request)),
    switchMap(() => {
      return of(actions.clearRkhDraft.success({loading: false, data: []}))
    }),
  )
}

export default [
  createRKH,
  editRKH,
  deleteRKH,
  getRKHLists,
  syncRKH,
  getRKHDetail,
  getRKHAll,
  getRKHSummary,
  clearRkhDraft,
]
