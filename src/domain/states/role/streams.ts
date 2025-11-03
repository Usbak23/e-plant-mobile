import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/role/actions'
import {StreamType} from '@app/domain/states/types'

const getAllRole: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAllRole.request)),
    switchMap(action =>
      from(api.roleService.getAllRole()).pipe(
        map(({data}: any) => {
          return actions.getAllRole.success({loading: false, data: data.response})
        }),
        catchError(error => {
          return of(actions.getAllRole.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [getAllRole]
