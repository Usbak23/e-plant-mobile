import { map, catchError, filter, switchMap, concatMap } from 'rxjs/operators'
import { from, of, EMPTY } from 'rxjs'
import { isActionOf } from 'typesafe-actions'
import * as actions from '@app/domain/states/bkm/actions'
import { StreamType } from '@app/domain/states/types'
import { IBKMFormDataCreate, IBKMFormDataUpdate } from '@app/models/eplant/BKM'
import uuid from 'react-native-uuid'

const syncBKM: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncBKM)),
    concatMap(() => {
      const loading = state$?.value?.bkm.formBKMStatus?.loading
      const data = state$?.value?.bkm.formBKMStatus?.data
      const isConnected = state$?.value?.network.isConnected
      const listTemporary = state$?.value?.bkm?.bkmListTemp || []
      const lastIndex = listTemporary.length - 1
      const allow = Boolean(
        isConnected && !loading && listTemporary.length > 0 && data?.tempId !== listTemporary[lastIndex].tempId,
      )
      if (!allow) {
        return EMPTY
      }
      const sorted = listTemporary.sort((a, b) => {
        return (new Date(a.date) as any) - (new Date(b.date) as any)
      })
      return [actions.createBKM.request({ loading: true, data: sorted[0] })]
      // return [actions.createBKM.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const createBKM: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createBKM.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      const tempId = uuid.v4()
      if (!isConnected && newData) {
        const bkmEmployee = action.payload.data?.bkmEmployee?.map(item => ({
          ...item,
          tempId,
          employeeTempId: uuid.v4(),
        }))
        Object.assign(action.payload.data, { tempId, bkmEmployee })
        return of(
          actions.addBKMTemp(action.payload.data),
          actions.createBKM.success({
            loading: false,
            //@ts-ignore
            data: { data: { status: 'success', code: 200, response: action.payload.data } },
          }),
          actions.clearFormBKMStatus(),
          actions.syncBKM(),
        )
      }
      return from(api.bkmService.createBKM(action.payload.data as IBKMFormDataCreate)).pipe(
        concatMap((data: any) => [
          actions.deleteBKMTemp(action.payload.data),
          actions.createBKM.success({ loading: false, data }),
          actions.clearFormBKMStatus(),
          actions.getBKMMobile.request({ 
            loading: true, 
            data: {
              divisionId: action.payload.data?.divisionId,
              date: action.payload.data?.date,
              foremanId: action.payload.data?.foremanId,
              subActivityId: action.payload.data?.subActivityId,
            }
          }),
          actions.syncBKM(),
        ]),
        catchError(error => {
          if (newData && error.message === 'Network Error') {
            Object.assign(action.payload.data, { tempId: uuid.v4() })
            return of(
              actions.addBKMTemp(action.payload.data),
              actions.createBKM.success({
                loading: false,
                //@ts-ignore
                data: { data: { status: 'success', code: 200, response: action.payload.data } },
              }),
              actions.clearFormBKMStatus(),
            )
          }
          return of(actions.createBKM.failure({ loading: false, error }), actions.clearFormBKMStatus())
        }),
      )
    }),
  )
}

const editBKM: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editBKM.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return [
          actions.editBKMTemp(action.payload.data),
          actions.editBKM.success({
            loading: false,
            //@ts-ignore
            data: { data: { status: 'success', code: 200, response: action.payload.data } },
          }),
          actions.clearFormBKMStatus(),
        ]
      }
      return from(api.bkmService.editBKM(action.payload.data as IBKMFormDataUpdate)).pipe(
        concatMap((data: any) => [
          actions.getBKMMobile.request({ 
            loading: true, 
            data: {
              divisionId: action.payload.data?.divisionId,
              date: action.payload.data?.date,
            }
          }),
          actions.editBKM.success({ loading: false, data }),
          actions.clearFormBKMStatus(),
        ]),
        catchError(error => of(actions.editBKM.failure({ loading: false, error }), actions.clearFormBKMStatus())),
      )
    }),
  )
}

const deleteBKM: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteBKM.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return of(
          actions.deleteBKMEmployeeTemp(action.payload.data),
          actions.deleteBKM.success({ loading: false, data: action.payload.data }),
          actions.clearDeleteBKMStatus(),
        )
      }
      return from(api.bkmService.deleteBKM(action.payload.data?.id as string)).pipe(
        //@ts-ignore
        concatMap(data => [actions.deleteBKM.success({ loading: false, data }), actions.clearDeleteBKMStatus()]),
        catchError(error => of(actions.deleteBKM.failure({ loading: false, error }), actions.clearDeleteBKMStatus())),
      )
    }),
  )
}
const getBKMLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBKMLists.request)),
    switchMap(action =>
      from(api.bkmService.getBKMLists(action.payload.data)).pipe(
        map(({ data }: any) => actions.getBKMLists.success({ loading: false, data: data.response })),
        catchError(error => {
          return of(actions.getBKMLists.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}
const getBKMDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBKMDetail.request)),
    switchMap(action =>
      from(api.bkmService.getDetailBKM(action.payload.data as string)).pipe(
        map(({ data }: any) => actions.getBKMDetail.success({ loading: false, data: data.response })),
        catchError(error => {
          return of(actions.getBKMDetail.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}
const getBKMMobile: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBKMMobile.request)),
    switchMap(action =>
      from(api.bkmService.getBKMMobile(action.payload.data as any)).pipe(
        map(({ data }: any) => {
          return actions.getBKMMobile.success({ loading: false, data: { ...data.response, ...action.payload.data } })
        }),
        catchError(error => {
          return of(actions.getBKMMobile.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const clearBkmDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearBkmDraft.request)),
    switchMap(() => {
      return of(actions.clearBkmDraft.success({ loading: false, data: [] }))
    }),
  )
}

export default [createBKM, editBKM, deleteBKM, getBKMLists, syncBKM, getBKMDetail, getBKMMobile, clearBkmDraft]
