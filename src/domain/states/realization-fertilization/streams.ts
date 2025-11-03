import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/realization-fertilization/actions'
import {StreamType} from '@app/domain/states/types'
import {IDailyActivityForm} from '@app/models/eplant/IDailyActivity'
import {IRealizationFertilizationApproveForm} from '@app/models/eplant/RealizationFertilization'

const createRealizationFertilization: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createRealizationFertilization.request)),
    switchMap(action => {
      return from(
        api.realizationFertilizationService.createRealizationFertilization(
          action.payload.data as IRealizationFertilizationApproveForm,
        ),
      ).pipe(
        concatMap((data: any) => {
          return [
            actions.createRealizationFertilization.success({loading: false, data}),
            actions.clearFormCreateRealizationFertilization(),
          ]
        }),
        catchError(error => {
          return of(
            actions.createRealizationFertilization.failure({loading: false, error}),
            actions.clearFormCreateRealizationFertilization(),
          )
        }),
      )
    }),
  )
}

const updateRealizationFertilization: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.updateRealizationFertilization.request)),
    switchMap(action => {
      return from(
        api.realizationFertilizationService.updateRealizationFertilization(
          action.payload.data as IRealizationFertilizationApproveForm,
        ),
      ).pipe(
        concatMap((data: any) => {
          return [
            actions.updateRealizationFertilization.success({loading: false, data}),
            actions.clearFormCreateRealizationFertilization(),
          ]
        }),
        catchError(error => {
          return of(
            actions.updateRealizationFertilization.failure({loading: false, error}),
            actions.clearFormCreateRealizationFertilization(),
          )
        }),
      )
    }),
  )
}

const getRealizationFertilization: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRealizationFertilizationList.request)),
    switchMap(action =>
      from(api.realizationFertilizationService.getRealizationFertilizationList(action.payload.data)).pipe(
        map(({data}: any) => actions.getRealizationFertilizationList.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getRealizationFertilizationList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const deleteRealizationFertilization: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteRealizationFertilization.request)),
    switchMap(action => {
      return from(
        api.realizationFertilizationService.deleteRealizationFertilization(action.payload.data as string),
      ).pipe(
        concatMap((data: any) => [
          actions.deleteRealizationFertilization.success({loading: false, data}),
          actions.clearFormDeleteRealizationFertilization(),
        ]),
        catchError(error =>
          of(
            actions.deleteRealizationFertilization.failure({loading: false, error}),
            actions.clearFormDeleteRealizationFertilization(),
          ),
        ),
      )
    }),
  )
}

export default [
  createRealizationFertilization,
  updateRealizationFertilization,
  deleteRealizationFertilization,
  getRealizationFertilization,
]
