import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/rkh-take-care/actions'
import {StreamType} from '@app/domain/states/types'
import {IRKHTakeCareFormData} from '@app/models/eplant/RKHTakeCare'
import uuid from 'react-native-uuid'

const syncRKHTakeCare: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncRKHTakeCare)),
    concatMap(() => {
      const loading = state$?.value?.rkhTakeCare.formRKHTakeCareStatus?.loading
      const listTemporary = state$?.value?.rkhTakeCare?.rkhTakeCareListTemp || []
      const isConnected = state$?.value?.network.isConnected
      const allow = Boolean(isConnected && !loading && listTemporary.length > 0)
      if (!allow) {
        return EMPTY
      }
      const lastIndex = listTemporary.length - 1
      return [actions.createRKHTakeCare.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const createRKHTakeCare: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createRKHTakeCare.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      if (!isConnected) {
        if (newData) {
          Object.assign(action.payload.data, {tempId: uuid.v4()})
        }
        return of(
          actions.addRKHTakeCareTemp(action.payload.data),
          actions.createRKHTakeCare.success({
            loading: false,
            data: {
              //@ts-ignore
              data: {
                status: 'success',
                code: 200,
                response: action.payload.data,
              },
            },
          }),
          // actions.clearFormRKHTakeCareStatus(), // <-- this is called before previous done. it is a "race condition"
          actions.syncRKHTakeCare(),
        )
      }
      return from(api.rkhTakeCareService.createRKHTakeCare(action.payload.data as IRKHTakeCareFormData)).pipe(
        concatMap((data: any) => [
          actions.deleteRKHTakeCareTemp(action.payload.data),
          actions.createRKHTakeCare.success({loading: false, data}),
          actions.clearFormRKHTakeCareStatus(),
          actions.syncRKHTakeCare(),
          actions.getRKHTakeCareAll.request({loading: true}),
        ]),
        catchError(error => {
          if (newData && error.message == 'Network Error') {
            Object.assign(action.payload.data, {tempId: uuid.v4()})
            return of(
              actions.addRKHTakeCareTemp(action.payload.data),
              actions.createRKHTakeCare.success({
                loading: false,
                data: {data: {status: 'success', code: 200, response: action.payload.data}},
              }),
              actions.clearFormRKHTakeCareStatus(),
            )
          }
          return of(actions.createRKHTakeCare.failure({loading: false, error}), actions.clearFormRKHTakeCareStatus())
        }),
      )
    }),
  )
}

const editRKHTakeCare: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editRKHTakeCare.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return [
          actions.editRKHTakeCareTemp(action.payload.data),
          actions.editRKHTakeCare.success({
            loading: false,
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormRKHTakeCareStatus(),
        ]
      }
      return from(api.rkhTakeCareService.editRKHTakeCare(action.payload.data as IRKHTakeCareFormData)).pipe(
        concatMap((data: any) => [
          actions.editRKHTakeCare.success({loading: false, data}),
          actions.clearFormRKHTakeCareStatus(),
        ]),
        catchError(error =>
          of(actions.editRKHTakeCare.failure({loading: false, error}), actions.clearFormRKHTakeCareStatus()),
        ),
      )
    }),
  )
}

const deleteRKHTakeCare: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteRKHTakeCare.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId

      if (isTemp) {
        return of(
          actions.deleteRKHTakeCareTemp(action.payload.data),
          actions.deleteRKHTakeCare.success({loading: false, data: action.payload.data}),
          actions.clearDeleteRKHTakeCareStatus(),
        )
      }
      return from(api.rkhTakeCareService.deleteRKHTakeCare(action.payload.data.id)).pipe(
        concatMap(data => [
          actions.deleteRKHTakeCare.success({loading: false, data}),
          actions.clearDeleteRKHTakeCareStatus(),
        ]),
        catchError(error =>
          of(actions.deleteRKHTakeCare.failure({loading: false, error}), actions.clearDeleteRKHTakeCareStatus()),
        ),
      )
    }),
  )
}
const getRKHTakeCareLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKHTakeCareLists.request)),
    switchMap(action =>
      from(api.rkhTakeCareService.getRKHTakeCareLists(action.payload.data)).pipe(
        map(({data}: any) => {
          return actions.getRKHTakeCareLists.success({loading: false, data: data.response})
        }),
        catchError(error => {
          return of(actions.getRKHTakeCareLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getRKHTakeCareAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKHTakeCareAll.request)),
    switchMap(action =>
      from(api.rkhTakeCareService.getRKHTakeCareAll()).pipe(
        concatMap(({data}: any) => {
          if (action?.payload?.next) {
            return [actions.getRKHTakeCareAll.success({loading: false, data: data.response}), action?.payload?.next]
          }

          return [actions.getRKHTakeCareAll.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getRKHTakeCareAll.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getRKHTakeCareAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getRKHTakeCareDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKHTakeCareDetail.request)),
    switchMap(action =>
      from(api.rkhTakeCareService.getRKHTakeCareDetail(action.payload.data as string)).pipe(
        map(({data}: any) => actions.getRKHTakeCareDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getRKHTakeCareDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const clearRkhTakeCareDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearRkhTakeCareDraft.request)),
    switchMap(() => {
      return of(actions.clearRkhTakeCareDraft.success({loading: false, data: []}))
    }),
  )
}

export default [
  createRKHTakeCare,
  editRKHTakeCare,
  deleteRKHTakeCare,
  getRKHTakeCareLists,
  syncRKHTakeCare,
  getRKHTakeCareDetail,
  getRKHTakeCareAll,
  clearRkhTakeCareDraft,
]
