import {StreamType} from '../types'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'

import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import * as actions from './actions'
import {
  IRawMaterialFormData,
  IRawMaterialUpdateFormData,
  IRawPurchasementHistoryFormData,
  IRawReceptionHistoryFormData,
} from '@app/models/eplant/RawMaterial'

const createRawMaterial: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createRawMaterial.request)),
    switchMap(action => {
      return from(api.rawMaterialService.createRawMaterial(action.payload.data as IRawMaterialFormData)).pipe(
        concatMap((data: any) => [
          actions.createRawMaterial.success({loading: false, data}),
          actions.clearFormRawMaterialtatus(),
        ]),
        catchError(error => {
          return of(actions.createRawMaterial.failure({loading: false, error}), actions.clearFormRawMaterialtatus())
        }),
      )
    }),
  )
}

const editRawMaterial: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editRawMaterial.request)),
    switchMap(action => {
      return from(api.rawMaterialService.editRawMaterial(action.payload.data as IRawMaterialUpdateFormData)).pipe(
        concatMap((data: any) => [
          actions.editRawMaterial.success({loading: false, data}),
          actions.clearFormRawMaterialtatus(),
        ]),
        catchError(error => {
          return of(actions.editRawMaterial.failure({loading: false, error}), actions.clearFormRawMaterialtatus())
        }),
      )
    }),
  )
}

const getRawMaterialLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRawMaterialLists.request)),
    switchMap(action =>
      from(api.rawMaterialService.getRawMaterialLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getRawMaterialLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getRawMaterialLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getRawMaterialAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRawMaterialAll.request)),
    switchMap(action =>
      from(api.rawMaterialService.getRawMaterialAll(action.payload.data)).pipe(
        concatMap(({data}: any) => {
          if (action?.payload?.next) {
            return [actions.getRawMaterialAll.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getRawMaterialAll.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getRawMaterialAll.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getRawMaterialAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getRawMaterialDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRawMaterialDetail.request)),
    switchMap(action =>
      from(api.rawMaterialService.getRawMaterialDetail(action.payload.data)).pipe(
        map(({data}: any) => actions.getRawMaterialDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getRawMaterialDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const createPurchasementHistory: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createPurchasementHistory.request)),
    switchMap(action => {
      return from(
        api.rawMaterialService.createPurchasementHistory(action.payload.data as IRawPurchasementHistoryFormData),
      ).pipe(
        concatMap((data: any) => [
          actions.createPurchasementHistory.success({loading: false, data}),
          actions.clearFormPurchasementHistoryStatus(),
        ]),
        catchError(error => {
          return of(
            actions.createPurchasementHistory.failure({loading: false, error}),
            actions.clearFormPurchasementHistoryStatus(),
          )
        }),
      )
    }),
  )
}

const editPurchasementHistory: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editPurchasementHistory.request)),
    switchMap(action => {
      return from(
        api.rawMaterialService.editPurchasementHistory(action.payload.data as IRawPurchasementHistoryFormData),
      ).pipe(
        concatMap((data: any) => [
          actions.editPurchasementHistory.success({loading: false, data}),
          actions.clearFormPurchasementHistoryStatus(),
        ]),
        catchError(error => {
          return of(
            actions.editPurchasementHistory.failure({loading: false, error}),
            actions.clearFormPurchasementHistoryStatus(),
          )
        }),
      )
    }),
  )
}

const getPurchasementHistoryLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getPurchasementHistoryLists.request)),
    switchMap(action =>
      from(api.rawMaterialService.getPurchasementHistoryLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getPurchasementHistoryLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getPurchasementHistoryLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getReceptionHistoryLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getReceptionHistoryLists.request)),
    switchMap(action =>
      from(api.rawMaterialService.getReceptionHistoryLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getReceptionHistoryLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getReceptionHistoryLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const editReceptionHistory: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editReceptionHistory.request)),
    switchMap(action => {
      return from(
        api.rawMaterialService.editReceptionHistory(action.payload.data as IRawReceptionHistoryFormData),
      ).pipe(
        concatMap((data: any) => [
          actions.editReceptionHistory.success({loading: false, data}),
          actions.clearFormReceptionHistoryStatus(),
        ]),
        catchError(error => {
          return of(
            actions.editReceptionHistory.failure({loading: false, error}),
            actions.clearFormReceptionHistoryStatus(),
          )
        }),
      )
    }),
  )
}

const deleteRawMaterial: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteRawMaterial.request)),
    switchMap(action => {
      return from(api.rawMaterialService.deleteRawMaterial(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteRawMaterial.success({loading: false, data}),
          actions.clearDeleteRawMaterialStatus(),
        ]),
        catchError(error =>
          of(actions.deleteRawMaterial.failure({loading: false, error}), actions.clearDeleteRawMaterialStatus()),
        ),
      )
    }),
  )
}

const getNormaSubActivityAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getNormaSubactivity.request)),
    switchMap(action =>
      from(api.normaService.getNormSubactivityLists(action.payload.data)).pipe(
        concatMap(({data}: any) => {
          if (action?.payload?.next) {
            return [actions.getNormaSubactivity.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getNormaSubactivity.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getNormaSubactivity.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getNormaSubactivity.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getNormMaterial: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getNormMaterialList.request)),
    switchMap(action =>
      from(api.rawMaterialService.getNormMaterialList(action.payload.data)).pipe(
        concatMap(({data}: any) => {
          return [actions.getNormMaterialList.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          return of(actions.getNormMaterialList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [
  createRawMaterial,
  getRawMaterialLists,
  getRawMaterialDetail,
  editRawMaterial,
  createPurchasementHistory,
  editPurchasementHistory,
  getPurchasementHistoryLists,
  getReceptionHistoryLists,
  editReceptionHistory,
  deleteRawMaterial,
  getRawMaterialAll,
  getNormaSubActivityAll,
  getNormMaterial,
]
