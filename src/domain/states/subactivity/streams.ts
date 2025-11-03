import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/subactivity/actions'
import {StreamType} from '@app/domain/states/types'

const getSubActivityAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getSubActivityAll.request)),
    switchMap(action =>
      from(api.subActivityService.getSubActivityAll(action.payload.data)).pipe(
        concatMap(({data}: any) => {
          if (action?.payload?.next) {
            return [actions.getSubActivityAll.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getSubActivityAll.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getSubActivityAll.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getSubActivityAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [getSubActivityAll]
