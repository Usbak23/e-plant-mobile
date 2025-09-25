import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/pma/actions'
import {StreamType} from '@app/domain/states/types'
import {IPMAFormData, IPMAFormEmployeeUpdate, IPMAFormUdpate} from '@app/models/eplant/PMA'
import uuid from 'react-native-uuid'

const syncPMA: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncPMA)),
    concatMap(() => {
      const loading = state$?.value?.pma.formPMAStatus?.loading
      const data = state$?.value?.pma?.formPMAStatus?.data
      const isConnected = state$?.value?.network.isConnected
      const listTemporary = state$?.value?.pma?.pmaFormmTemp || []
      const lastIndex = listTemporary.length - 1
      const allow = Boolean(isConnected && !loading && listTemporary.length > 0)
      if (!allow) {
        return EMPTY
      }
      return [actions.createPMA.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const getPMAMobile: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getPMAMobile.request)),
    switchMap(action =>
      from(api.pmaService.getPMAMobile(action.payload.data as any)).pipe(
        map(({data}: any) => actions.getPMAMobile.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getPMAMobile.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const createPMA: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createPMA.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      if (!isConnected) {
        if (newData) {
          Object.assign(action.payload.data, {tempId: uuid.v4()})
          const employees = action.payload.data?.employee
          if (Array.isArray(employees)) {
            employees.forEach(e => {
              e.isDraft = true
              e.employeeTempId = uuid.v4().toString()
            })
          }
        }

        return of(
          actions.addPMATemp(action.payload.data),
          actions.createPMA.success({
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
          actions.clearFormPMAStatus(),
          actions.syncPMA(),
        )
      }

      return from(api.pmaService.createPMA(action.payload.data as IPMAFormData)).pipe(
        concatMap(({data}: any) => [
          actions.deletePMATemp(action.payload.data),
          actions.createPMA.success({loading: false, data}),
          actions.clearFormPMAStatus(),
          actions.getPMAMobile.request({loading: true, data: action.payload.data}),
          actions.syncPMA(),
        ]),
        catchError(error => {
          if (newData && error.message === 'Network Error') {
            Object.assign(action.payload.data, {tempId: uuid.v4()})
            return of(
              actions.addPMATemp(action.payload.data),
              actions.createPMA.success({
                loading: false,
                //@ts-ignore
                data: {data: {status: 'success', code: 200, response: action.payload.data}},
              }),
              actions.clearFormPMAStatus(),
            )
          }
          return of(actions.createPMA.failure({loading: false, error}), actions.clearFormPMAStatus())
        }),
      )
    }),
  )
}

const getPMALists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getPMALists.request)),
    switchMap(action =>
      from(api.pmaService.getPMAList(action.payload.data)).pipe(
        map(({data}: any) => actions.getPMALists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getPMALists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const editPMA: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editPMA.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return [
          actions.editPMATemp(action.payload.data),
          actions.editPMA.success({
            loading: false,
            //@ts-ignore
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormPMAStatus(),
        ]
      }
      return from(api.pmaService.updatePMA(action.payload.data as IPMAFormUdpate)).pipe(
        concatMap((data: any) => [
          // actions.getPMAMobile.request({loading: true, data: action.payload.data}),
          actions.editPMA.success({loading: false, data}),
          actions.clearFormPMAStatus(),
        ]),
        catchError(error => of(actions.editPMA.failure({loading: false, error}), actions.clearFormPMAStatus())),
      )
    }),
  )
}

const editPMASingleEmployee: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editSinglePMAEmployee.request)),
    switchMap(action => {
      return from(api.pmaService.updateSinglePMAEmployee(action.payload.data as IPMAFormEmployeeUpdate)).pipe(
        concatMap((data: any) => [
          // actions.getPMAMobile.request({loading: true, data: action.payload.data}),
          actions.editSinglePMAEmployee.success({loading: false, data}),
          actions.clearFormPMAEmployeeStatus(),
        ]),
        catchError(error =>
          of(actions.editSinglePMAEmployee.failure({loading: false, error}), actions.clearFormPMAEmployeeStatus()),
        ),
      )
    }),
  )
}

const deletePMA: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deletePMA.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.employeeTempId
      if (isTemp) {
        return of(
          actions.deletePMAEmployeeTemp(action.payload.data),
          actions.deletePMA.success({loading: false, data: action.payload.data}),
          actions.clearDeletePMAStatus(),
        )
      }
      return from(api.pmaService.deletePMA(action.payload.data?.id as string)).pipe(
        //@ts-ignore
        concatMap(data => [actions.deletePMA.success({loading: false, data}), actions.clearDeletePMAStatus()]),
        catchError(error => of(actions.deletePMA.failure({loading: false, error}), actions.clearDeletePMAStatus())),
      )
    }),
  )
}

const clearPmaDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearPmaDraft.request)),
    switchMap(() => {
      return of(actions.clearPmaDraft.success({loading: false, data: []}))
    }),
  )
}

export default [getPMAMobile, createPMA, getPMALists, editPMA, deletePMA, syncPMA, editPMASingleEmployee, clearPmaDraft]
