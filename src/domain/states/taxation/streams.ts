import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/taxation/actions'
import {StreamType} from '@app/domain/states/types'
import {ITaxationFormData} from '@app/models/eplant/Taxation'

const getTaxationPaginated: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTaxationPaginated.request)),
    switchMap(action =>
      from(api.taxationService.getTaxationPaginated(action.payload.data)).pipe(
        map(({data}: any) => actions.getTaxationPaginated.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getTaxationPaginated.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getHaRealizationTaxation: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getHaRealizationTaxation.request)),
    switchMap(action =>
      from(api.taxationService.getHaRealizationTaxation(action.payload.data)).pipe(
        map(({data}: any) => actions.getHaRealizationTaxation.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getHaRealizationTaxation.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getHaRealizationTaxationDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getHaRealizationTaxationDetail.request)),
    switchMap(action =>
      from(api.taxationService.getHaRealizationTaxation(action.payload.data)).pipe(
        map(({data}: any) => actions.getHaRealizationTaxationDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getHaRealizationTaxationDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const createTaxation: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createTaxation.request)),
    switchMap(action => {
      return from(api.taxationService.createTaxation(action.payload.data as ITaxationFormData)).pipe(
        concatMap((data: any) => [
          actions.createTaxation.success({loading: false, data}),
          actions.clearFormTaxationStatus(),
        ]),
        catchError(error => {
          return of(actions.createTaxation.failure({loading: false, error}), actions.clearFormTaxationStatus())
        }),
      )
    }),
  )
}

const editTaxation: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editTaxation.request)),
    switchMap(action => {
      return from(api.taxationService.editTaxation(action.payload.data as ITaxationFormData)).pipe(
        concatMap((data: any) => {
          return [actions.editTaxation.success({loading: false, data}), actions.clearFormTaxationStatus()]
        }),
        catchError(error =>
          of(actions.editTaxation.failure({loading: false, error}), actions.clearFormTaxationStatus()),
        ),
      )
    }),
  )
}

const deleteTaxation: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteTaxation.request)),
    switchMap(action => {
      return from(api.taxationService.deleteTaxation(action.payload.data as string)).pipe(
        concatMap(data => [
          actions.deleteTaxation.success({loading: false, data}),
          actions.clearDeleteTaxationStatus(),
        ]),
        catchError(error =>
          of(actions.deleteTaxation.failure({loading: false, error}), actions.clearDeleteTaxationStatus()),
        ),
      )
    }),
  )
}

export default [
  getTaxationPaginated,
  createTaxation,
  editTaxation,
  deleteTaxation,
  getHaRealizationTaxation,
  getHaRealizationTaxationDetail,
]
