import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/akp/actions'
import {StreamType} from '@app/domain/states/types'
import {IAKPFormData} from '@app/models/eplant/AKP'
import uuid from 'react-native-uuid'

const syncAKP: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncAKP)),
    concatMap(action => {
      const loading = state$?.value?.akp.formAKPStatus?.loading
      const isConnected = state$?.value?.network.isConnected
      const listTemporary = state$?.value?.akp?.akpListTemp || []
      const allow = Boolean(isConnected && !loading && listTemporary.length > 0)
      if (!allow) {
        return EMPTY
      }
      const lastIndex = listTemporary.length - 1
      if (action?.payload?.data) {
        return [
          actions.createAKP.request({loading: true, data: listTemporary[lastIndex], toFetch: action?.payload?.data}),
        ]
      }
      return [actions.createAKP.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const createAKP: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createAKP.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      if (!isConnected && newData) {
        Object.assign(action.payload.data, {tempId: uuid.v4()})
        return of(
          actions.addAKPTemp(action.payload.data),
          actions.createAKP.success({
            loading: false,
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormAKPStatus(),
          actions.syncAKP(),
        )
      }
      return from(api.akpService.createAKP(action.payload.data as IAKPFormData)).pipe(
        concatMap((data: any) => {
          if (action?.payload?.toFetch) {
            return [
              actions.deleteAKPTemp(action.payload.data),
              actions.createAKP.success({loading: false, data}),
              actions.clearFormAKPStatus(),
              actions.getAKPLists.request({
                loading: true,
                data: {
                  page: 1,
                  limit: 10,
                  sort: 'createdAt:desc',
                  divisionId: action.payload.toFetch.divisionId,
                  date: action.payload.toFetch.date,
                },
              }),
              // actions.getAKPLists.request({loading: true, data: action.payload.data}),
              actions.syncAKP({data: {...action.payload.toFetch}}),
            ]
          }
          return [
            actions.deleteAKPTemp(action.payload.data),
            actions.createAKP.success({loading: false, data}),
            actions.clearFormAKPStatus(),
            // actions.getAKPLists.request({loading: true, data: {page: 1, limit: 10, sort: 'createdAt:desc'}}),
            // actions.getAKPLists.request({loading: true, data: action.payload.data}),
            actions.syncAKP(),
          ]
        }),
        catchError(error => {
          if (newData && error.message === 'Network Error') {
            Object.assign(action.payload.data, {tempId: uuid.v4()})
            return of(
              actions.addAKPTemp(action.payload.data),
              actions.createAKP.success({
                loading: false,
                data: {data: {status: 'success', code: 200, response: action.payload.data}},
              }),
              actions.clearFormAKPStatus(),
            )
          }
          return of(actions.createAKP.failure({loading: false, error}), actions.clearFormAKPStatus())
        }),
      )
    }),
  )
}

const editAKP: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editAKP.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return [
          actions.editAKPTemp(action.payload.data),
          actions.editAKP.success({
            loading: false,
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormAKPStatus(),
        ]
      }
      return from(api.akpService.editAKP(action.payload.data as IAKPFormData)).pipe(
        concatMap((data: any) => [
          // actions.getAKPLists.request({loading: true, data: {page: 1, limit: 10}}),
          // actions.getAKPLists.request({loading: true, data: {page: 1, limit: 10}}),
          actions.editAKP.success({loading: false, data}),
          actions.clearFormAKPStatus(),
        ]),
        catchError(error => of(actions.editAKP.failure({loading: false, error}), actions.clearFormAKPStatus())),
      )
    }),
  )
}

const deleteAKP: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteAKP.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return of(
          actions.deleteAKPTemp(action.payload.data),
          actions.deleteAKP.success({loading: false, data: action.payload.data}),
          actions.clearDeleteAKPStatus(),
        )
      }
      return from(api.akpService.deleteAKP(action.payload.data.id)).pipe(
        concatMap(data => [actions.deleteAKP.success({loading: false, data}), actions.clearDeleteAKPStatus()]),
        catchError(error => of(actions.deleteAKP.failure({loading: false, error}), actions.clearDeleteAKPStatus())),
      )
    }),
  )
}

const getAKPLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAKPLists.request)),
    switchMap(action =>
      from(api.akpService.getAKPLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getAKPLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getAKPLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getAKPDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAKPDetail.request)),
    switchMap(action =>
      from(api.akpService.getAKPDetail(action.payload.data as string)).pipe(
        map(({data}: any) => actions.getAKPDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getAKPDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const clearAkpDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearAkpDraft.request)),
    switchMap(() => {
      return of(actions.clearAkpDraft.success({loading: false, data: []}))
    }),
  )
}

export default [createAKP, editAKP, deleteAKP, getAKPLists, syncAKP, getAKPDetail, clearAkpDraft]
