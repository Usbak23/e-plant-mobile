import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/daily-activity/actions'
import {StreamType} from '@app/domain/states/types'
import {IDailyActivityForm} from '@app/models/eplant/IDailyActivity'

const createDailyActivity: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createDailyActivity.request)),
    switchMap(action => {
      return from(api.dailyActivityService.createDailyActivity(action.payload.data as IDailyActivityForm)).pipe(
        concatMap((data: any) => {
          return [actions.createDailyActivity.success({loading: false, data}), actions.clearFormDailyActivity()]
        }),
        catchError(error => {
          return of(actions.createDailyActivity.failure({loading: false, error}), actions.clearFormDailyActivity())
        }),
      )
    }),
  )
}

const getDailyActivityList: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getDailyActivityList.request)),
    switchMap(action =>
      from(api.dailyActivityService.getDailyActivityPaginated(action.payload.data)).pipe(
        map(({data}: any) => actions.getDailyActivityList.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getDailyActivityList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const editDailyActivity: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editDailyActivity.request)),
    switchMap(action => {
      return from(api.dailyActivityService.editDailyActivity(action.payload.data as IDailyActivityForm)).pipe(
        concatMap((data: any) => [
          actions.editDailyActivity.success({loading: false, data}),
          actions.clearFormDailyActivity(),
        ]),
        catchError(error =>
          of(actions.editDailyActivity.failure({loading: false, error}), actions.clearFormDailyActivity()),
        ),
      )
    }),
  )
}

const deleteDailyActivity: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteDailyActivity.request)),
    switchMap(action => {
      return from(api.dailyActivityService.deleteDailyActivity(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteDailyActivity.success({loading: false, data}),
          actions.clearDeleteDailyActivityStatus(),
        ]),
        catchError(error =>
          of(actions.deleteDailyActivity.failure({loading: false, error}), actions.clearDeleteDailyActivityStatus()),
        ),
      )
    }),
  )
}

export default [createDailyActivity, getDailyActivityList, editDailyActivity, deleteDailyActivity]
