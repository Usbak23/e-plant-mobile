import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/census/actions'
import {StreamType} from '@app/domain/states/types'
import {ICensusEditFormData, ICensusFormData} from '@app/models/eplant/Census'

const createCensus: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createCensus.request)),
    switchMap(action => {
      return from(api.censusService.createCensus(action.payload.data as ICensusFormData)).pipe(
        concatMap((data: any) => [
          actions.createCensus.success({loading: false, data}),
          actions.clearFormCensusStatus(),
        ]),
        catchError(error => {
          return of(actions.createCensus.failure({loading: false, error}), actions.clearFormCensusStatus())
        }),
      )
    }),
  )
}

const editCensus: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editCensus.request)),
    switchMap(action => {
      return from(api.censusService.editCensus(action.payload.data as ICensusEditFormData)).pipe(
        concatMap((data: any) => [actions.editCensus.success({loading: false, data}), actions.clearFormCensusStatus()]),
        catchError(error => {
          return of(actions.editCensus.failure({loading: false, error}), actions.clearFormCensusStatus())
        }),
      )
    }),
  )
}

const getCensusLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getCensusLists.request)),
    switchMap(action =>
      from(api.censusService.getCensusPaginated(action.payload.data)).pipe(
        map(({data}: any) => actions.getCensusLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getCensusLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getCensusDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getCensusDetail.request)),
    switchMap(action => {
      return from(api.censusService.getCensusDetail(action.payload.data as string)).pipe(
        map((data: any) => actions.getCensusDetail.success({loading: false, data: data.data.response})),
        catchError(error => of(actions.getCensusDetail.failure({loading: false, error}))),
      )
    }),
  )
}

const deleteCensus: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteCensus.request)),
    switchMap(action => {
      return from(api.censusService.deleteCensus(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteCensus.success({loading: false, data}),
          actions.clearFormDeleteStatus(),
        ]),
        catchError(error => {
          return of(actions.deleteCensus.failure({loading: false, error}), actions.clearFormDeleteStatus())
        }),
      )
    }),
  )
}

export default [createCensus, getCensusLists, getCensusDetail, editCensus, deleteCensus]
