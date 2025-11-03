import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/bpbks/actions'
import {StreamType} from '@app/domain/states/types'
import {IBPBKSFormDataCreate, IBPBKSFormDataUpdate} from '@app/models/eplant/BPBKS'
import uuid from 'react-native-uuid'

const syncBPBKS: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncBPBKS)),
    concatMap(() => {
      const loading = state$?.value?.bpbks.formBPBKSStatus?.loading
      const data = state$?.value?.bpbks.formBPBKSStatus?.data
      const isConnected = state$?.value?.network.isConnected
      const listTemporary = state$?.value?.bpbks?.bpbksListTemp || []
      const lastIndex = listTemporary.length - 1
      const allow = Boolean(
        isConnected && !loading && listTemporary.length > 0 && data?.tempId !== listTemporary[lastIndex].tempId,
      )
      if (!allow) {
        return EMPTY
      }
      return [actions.createBPBKS.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const createBPBKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createBPBKS.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      const tempId = uuid.v4()
      if (!isConnected && newData) {
        const tphs = action.payload.data?.tphs?.map(item => ({
          ...item,
          tempId,
          employeeTempId: uuid.v4(),
        }))
        Object.assign(action.payload.data, {tempId, tphs})

        return of(
          actions.addBPBKSTemp(action.payload.data),
          actions.createBPBKS.success({
            loading: false,
            //@ts-ignore
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormBPBKSStatus(),
          actions.syncBPBKS(),
        )
      }
      return from(api.bpbksService.createBPBKS(action.payload.data as IBPBKSFormDataCreate)).pipe(
        concatMap((data: any) => [
          actions.deleteBPBKSTemp(action.payload.data),
          actions.createBPBKS.success({loading: false, data}),
          actions.clearFormBPBKSStatus(),
          actions.getBPBKSAll.request({loading: true, data: action.payload.data}),
          actions.syncBPBKS(),
        ]),
        catchError(error => {
          if (newData && error.message === 'Network Error') {
            Object.assign(action.payload.data, {tempId: uuid.v4()})
            return of(
              actions.addBPBKSTemp(action.payload.data),
              actions.createBPBKS.success({
                loading: false,
                //@ts-ignore
                data: {data: {status: 'success', code: 200, response: action.payload.data}},
              }),
              actions.clearFormBPBKSStatus(),
            )
          }
          return of(actions.createBPBKS.failure({loading: false, error}), actions.clearFormBPBKSStatus())
        }),
      )
    }),
  )
}

const editBPBKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editBPBKS.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return [
          actions.editBPBKSTemp(action.payload.data),
          actions.editBPBKS.success({
            loading: false,
            //@ts-ignore
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormBPBKSStatus(),
        ]
      }
      return from(api.bpbksService.editBPBKS(action.payload.data as IBPBKSFormDataUpdate)).pipe(
        concatMap((data: any) => [
          actions.getBPBKSAll.request({loading: true, data: action.payload.data}),
          actions.editBPBKS.success({loading: false, data}),
          actions.clearFormBPBKSStatus(),
        ]),
        catchError(error => of(actions.editBPBKS.failure({loading: false, error}), actions.clearFormBPBKSStatus())),
      )
    }),
  )
}

const deleteBPBKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteBPBKS.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId != undefined || Boolean(action.payload.data?.isTemp)
      if (isTemp) {
        return of(
          actions.deleteBPBKSEmployeeTemp(action.payload.data),
          actions.deleteBPBKS.success({loading: false, data: action.payload.data}),
          actions.clearDeleteBPBKSStatus(),
        )
      }
      return from(api.bpbksService.deleteBPBKS(action.payload.data?.id as string)).pipe(
        //@ts-ignore
        concatMap(data => [actions.deleteBPBKS.success({loading: false, data}), actions.clearDeleteBPBKSStatus()]),
        catchError(error => of(actions.deleteBPBKS.failure({loading: false, error}), actions.clearDeleteBPBKSStatus())),
      )
    }),
  )
}

const getBPBKSAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBPBKSAll.request)),
    switchMap(action =>
      from(api.bpbksService.getBPBKSAll(action.payload.data as any)).pipe(
        map(({data}: any) =>
          actions.getBPBKSAll.success({loading: false, data: {...data.response, ...action.payload.data}}),
        ),
        catchError(error => {
          return of(actions.getBPBKSAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const clearBpbksDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearBpbksDraft.request)),
    switchMap(() => {
      return of(actions.clearBpbksDraft.success({loading: false, data: []}))
    }),
  )
}

export default [createBPBKS, editBPBKS, deleteBPBKS, syncBPBKS, getBPBKSAll, clearBpbksDraft]
