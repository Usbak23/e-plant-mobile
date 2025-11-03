import { map, catchError, filter, switchMap, concatMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { isActionOf } from 'typesafe-actions'
import * as actions from '@app/domain/states/tonnage-pks/actions'
import { StreamType } from '@app/domain/states/types'
import { ITonnagePKSFormData } from '@app/models/eplant/TonnagePKS'

const createTonnagePKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createTonnagePKS.request)),
    switchMap(action => {
      return from(api.tonnagePKSService.createTonnagePKS(action.payload.data as ITonnagePKSFormData)).pipe(
        concatMap((data: any) => {
          return [actions.createTonnagePKS.success({ loading: false, data }), actions.clearFormTonnagePKSStatus()]
        }),
        catchError(error => {
          return of(actions.createTonnagePKS.failure({ loading: false, error }), actions.clearFormTonnagePKSStatus())
        }),
      )
    }),
  )
}

const editTonnagePKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.updateTonnagePKS.request)),
    switchMap(action => {
      return from(api.tonnagePKSService.updateTonnagePKS(action.payload.data as ITonnagePKSFormData)).pipe(
        concatMap((data: any) => {
          return [actions.updateTonnagePKS.success({ loading: false, data }), actions.clearFormTonnagePKSStatus()]
        }),
        catchError(error =>
          of(actions.updateTonnagePKS.failure({ loading: false, error }), actions.clearFormTonnagePKSStatus()),
        ),
      )
    }),
  )
}

const deleteTonnagePKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteTonnagePKS.request)),
    switchMap(action => {
      return from(api.tonnagePKSService.deleteTonnagePKS(action.payload.data as string)).pipe(
        concatMap(({ data }: any) => {
          return [actions.deleteTonnagePKS.success({ loading: false, data }), actions.clearDeleteTonnagePKSStatus()]
        }),
        catchError(error =>
          of(actions.deleteTonnagePKS.failure({ loading: false, error }), actions.clearDeleteTonnagePKSStatus()),
        ),
      )
    }),
  )
}

const getTonnagePKSPaginated: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTonnagePKSPaginated.request)),
    switchMap(action =>
      from(api.tonnagePKSService.getTonnagePKSPaginated(action.payload.data)).pipe(
        map(({ data }: any) => actions.getTonnagePKSPaginated.success({ loading: false, data: data.response })),
        catchError(error => {
          return of(actions.getTonnagePKSPaginated.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const getTonnagePKSDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTonnagePKSDetail.request)),
    switchMap(action =>
      from(api.tonnagePKSService.detailTonnagePKS(action.payload.data)).pipe(
        map(({ data }: any) => actions.getTonnagePKSDetail.success({ loading: false, data: data.response })),
        catchError(error => {
          return of(actions.getTonnagePKSDetail.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const getSPBAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getSPBAll.request)),
    switchMap(action =>
      from(api.tonnagePKSService.getSPBList(action.payload.data)).pipe(
        map(({ data }: any) => {
          return actions.getSPBAll.success({ loading: false, data: data.response })
        }),
        catchError(error => {
          return of(actions.getSPBAll.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

export default [createTonnagePKS, editTonnagePKS, deleteTonnagePKS, getTonnagePKSDetail, getTonnagePKSPaginated, getSPBAll]
