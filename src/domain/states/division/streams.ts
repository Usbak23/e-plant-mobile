import { map, catchError, filter, switchMap, concatMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { isActionOf } from 'typesafe-actions'
import * as actions from '@app/domain/states/division/actions'
import { StreamType } from '@app/domain/states/types'
import { IDivisionFormData } from '@app/models/eplant/Division'

const getDivisionLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getDivisionLists.request)),
    switchMap(action =>
      from(api.divisionService.getDivisionsLists(action.payload.data)).pipe(
        map(({ data }: any) => {
          return actions.getDivisionLists.success({ loading: false, data: data.response })
        }),
        catchError(error => {
          return of(actions.getDivisionLists.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const createDivision: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createDivision.request)),
    switchMap(action => {
      return from(api.divisionService.createDivision(action.payload.data as IDivisionFormData)).pipe(
        concatMap((data: any) => {
          return [actions.createDivision.success({ loading: false, data }), actions.clearFormDivisionStatus()]
        }),
        catchError(error => {
          return of(actions.createDivision.failure({ loading: false, error }), actions.clearFormDivisionStatus())
        }),
      )
    }),
  )
}

const editDivision: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editDivision.request)),
    switchMap(action => {
      return from(api.divisionService.editDivision(action.payload.data as IDivisionFormData)).pipe(
        concatMap((data: any) => [
          actions.editDivision.success({ loading: false, data }),
          actions.clearFormDivisionStatus(),
        ]),
        catchError(error =>
          of(actions.editDivision.failure({ loading: false, error }), actions.clearFormDivisionStatus()),
        ),
      )
    }),
  )
}

const deleteDivision: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteDivision.request)),
    switchMap(action => {
      return from(api.divisionService.deleteDivision(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteDivision.success({ loading: false, data }),
          actions.clearDeleteDivisionStatus(),
        ]),
        catchError(error =>
          of(actions.deleteDivision.failure({ loading: false, error }), actions.clearDeleteDivisionStatus()),
        ),
      )
    }),
  )
}

const getDetailDivision: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.detailDivision.request)),
    switchMap(action => {
      return from(api.divisionService.getDetailDivision(action.payload.data as string)).pipe(
        map((data: any) => actions.detailDivision.success({ loading: false, data: data.data.response })),
        catchError(error => of(actions.detailDivision.failure({ loading: false, error }))),
      )
    }),
  )
}

const getAllDivision: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAllDivision.request)),
    switchMap(action =>
      from(api.divisionService.getAllDivision(action.payload.data)).pipe(
        concatMap(({ data }: any) => {
          if (action?.payload?.next) {
            return [actions.getAllDivision.success({ loading: false, data: data.response }), action?.payload?.next]
          }
          return [actions.getAllDivision.success({ loading: false, data: data.response })]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getAllDivision.failure({ loading: false, error }), action?.payload?.next)
          }
          return of(actions.getAllDivision.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

export default [getDivisionLists, createDivision, editDivision, getDetailDivision, deleteDivision, getAllDivision]
