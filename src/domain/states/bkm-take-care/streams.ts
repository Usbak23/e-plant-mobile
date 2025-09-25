import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/bkm-take-care/actions'
import {StreamType} from '@app/domain/states/types'
import {IBKMTakeCareFormDataCreate, IBKMTakeCareFormDataUpdate} from '@app/models/eplant/BKMTakeCare'
import uuid from 'react-native-uuid'

const syncBKMTakeCare: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncBKMTakeCare)),
    concatMap(() => {
      const loading = state$?.value?.bkmTakeCare.formBKMTakeCareStatus?.loading
      const data = state$?.value?.bkmTakeCare.formBKMTakeCareStatus?.data
      const isConnected = state$?.value?.network.isConnected
      const listTemporary = state$?.value?.bkmTakeCare?.bkmTakeCareListTemp || []
      const lastIndex = listTemporary.length - 1
      const allow = Boolean(
        isConnected && !loading && listTemporary.length > 0 && data?.tempId !== listTemporary[lastIndex].tempId,
      )
      if (!allow) {
        return EMPTY
      }
      return [actions.createBKMTakeCare.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const createBKMTakeCare: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createBKMTakeCare.request)),
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
        Object.assign(action.payload.data, {tempId, bkmEmployee})
        return of(
          actions.addBKMTakeCareTemp(action.payload.data),
          actions.createBKMTakeCare.success({
            loading: false,
            //@ts-ignore
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearDeleteBKMTakeCareStatus(),
          actions.syncBKMTakeCare(),
        )
      }
      return from(api.bkmTakeCareService.createBKMTakeCare(action.payload.data as IBKMTakeCareFormDataCreate)).pipe(
        concatMap((data: any) => [
          actions.deleteBKMTakeCareTemp(action.payload.data),
          actions.createBKMTakeCare.success({loading: false, data}),
          actions.clearFormBKMTakeCareStatus(),
          actions.getBKMTakeCareMobile.request({loading: true, data: action.payload.data}),
          actions.syncBKMTakeCare(),
        ]),
        catchError(error => {
          if (newData && error.message === 'Network Error') {
            Object.assign(action.payload.data, {tempId: uuid.v4()})
            return of(
              actions.addBKMTakeCareTemp(action.payload.data),
              actions.createBKMTakeCare.success({
                loading: false,
                //@ts-ignore
                data: {data: {status: 'success', code: 200, response: action.payload.data}},
              }),
              actions.clearFormBKMTakeCareStatus(),
            )
          }
          return of(actions.createBKMTakeCare.failure({loading: false, error}), actions.clearFormBKMTakeCareStatus())
        }),
      )
    }),
  )
}

const editBKMTakeCare: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editBKMTakeCare.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return [
          actions.editBKMTakeCareTemp(action.payload.data),
          actions.editBKMTakeCare.success({
            loading: false,
            //@ts-ignore
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormBKMTakeCareStatus(),
        ]
      }
      return from(api.bkmTakeCareService.editBKMTakeCare(action.payload.data as IBKMTakeCareFormDataUpdate)).pipe(
        concatMap((data: any) => [
          actions.getBKMTakeCareMobile.request({loading: true, data: action.payload.data}),
          actions.editBKMTakeCare.success({loading: false, data}),
          actions.clearFormBKMTakeCareStatus(),
        ]),
        catchError(error =>
          of(actions.editBKMTakeCare.failure({loading: false, error}), actions.clearFormBKMTakeCareStatus()),
        ),
      )
    }),
  )
}

const deleteBKMTakeCare: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteBKMTakeCare.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return of(
          actions.deleteBKMTakeCareEmployeeTemp(action.payload.data),
          actions.deleteBKMTakeCare.success({loading: false, data: action.payload.data}),
          actions.clearDeleteBKMTakeCareStatus(),
        )
      }
      return from(api.bkmTakeCareService.deleteBKMTakeCare(action.payload.data?.id as string)).pipe(
        //@ts-ignore
        concatMap(data => [
          actions.deleteBKMTakeCare.success({loading: false, data}),
          actions.clearDeleteBKMTakeCareStatus(),
        ]),
        catchError(error =>
          of(actions.deleteBKMTakeCare.failure({loading: false, error}), actions.clearDeleteBKMTakeCareStatus()),
        ),
      )
    }),
  )
}
const getBKMTakeCareLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBKMTakeCareLists.request)),
    switchMap(action =>
      from(api.bkmTakeCareService.getBKMTakeCareLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getBKMTakeCareLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getBKMTakeCareLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getBKMTakeCareDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBKMTakeCareDetail.request)),
    switchMap(action =>
      from(api.bkmTakeCareService.getDetailBKMTakeCare(action.payload.data as string)).pipe(
        map(({data}: any) => actions.getBKMTakeCareDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getBKMTakeCareDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getBKMTakeCareMobile: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBKMTakeCareMobile.request)),
    switchMap(action =>
      from(api.bkmTakeCareService.getBKMTakeCareMobile(action.payload.data as any)).pipe(
        map(({data}: any) =>
          actions.getBKMTakeCareMobile.success({loading: false, data: {...data.response, ...action.payload.data}}),
        ),
        catchError(error => {
          return of(actions.getBKMTakeCareMobile.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const clearBkmTakeCareDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearBkmTakeCareDraft.request)),
    switchMap(() => {
      return of(actions.clearBkmTakeCareDraft.success({loading: false, data: []}))
    }),
  )
}

export default [
  createBKMTakeCare,
  editBKMTakeCare,
  deleteBKMTakeCare,
  getBKMTakeCareLists,
  syncBKMTakeCare,
  getBKMTakeCareDetail,
  getBKMTakeCareMobile,
  clearBkmTakeCareDraft,
]
