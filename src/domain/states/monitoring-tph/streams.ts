import {map, catchError, filter, switchMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from './actions'
import {StreamType} from '@app/domain/states/types'

const getMonitoringTphList: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMonitoringTphList.request)),
    switchMap(action =>
      from(api.monitoringTphService.list(action.payload.data)).pipe(
        map(({data}: any) => actions.getMonitoringTphList.success({loading: false, data: data.response})),
        catchError(error => of(actions.getMonitoringTphList.failure({loading: false, error}))),
      ),
    ),
  )
}

const getMonitoringTphSummary: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMonitoringTphSummary.request)),
    switchMap(action =>
      from(api.monitoringTphService.summary(action.payload.data)).pipe(
        map(({data}: any) => actions.getMonitoringTphSummary.success({loading: false, data: data.response})),
        catchError(error => of(actions.getMonitoringTphSummary.failure({loading: false, error}))),
      ),
    ),
  )
}

export default [getMonitoringTphList, getMonitoringTphSummary]
