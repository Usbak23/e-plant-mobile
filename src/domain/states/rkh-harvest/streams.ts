import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/rkh-harvest/actions'
import {StreamType} from '@app/domain/states/types'

const getRKHHarvestAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKHHarvestAll.request)),
    switchMap(action =>
      from(api.rkhHarvestService.getRKHHarvestAll()).pipe(
        concatMap(({data}: any) => {
          if (action?.payload?.next) {
            return [actions.getRKHHarvestAll.success({loading: false, data: data.response}), action.payload?.next]
          }
          return [actions.getRKHHarvestAll.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getRKHHarvestAll.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getRKHHarvestAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [getRKHHarvestAll]
