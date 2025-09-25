import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@domain/states/master/actions'
import {StreamType} from '@domain/states/types'

const getProvinces: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getProvinces.request)),
    switchMap(action =>
      from(api.masterService.getProvinces(action.payload.data)).pipe(
        map(({data}) => {
          return actions.getProvinces.success({loading: false, data: data.response})
        }),
        catchError(error => {
          return of(actions.getProvinces.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getTypeEmployee: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTypeEmployee.request)),
    switchMap(action =>
      from(api.masterService.getTypeEmployee()).pipe(
        map(({data}) => {
          return actions.getTypeEmployee.success({loading: false, data: data.response})
        }),
        catchError(error => {
          return of(actions.getTypeEmployee.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getUoms: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getUoms.request)),
    switchMap(action =>
      from(api.masterService.getUoms(action.payload.data)).pipe(
        map(({data}) => {
          return actions.getUoms.success({loading: false, data: data.response})
        }),
        catchError(error => {
          return of(actions.getUoms.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getRangeYear: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRangeYear.request)),
    switchMap(action =>
      from(api.masterService.getRangeYear()).pipe(
        concatMap(({data}) => {
          if (action?.payload?.next) {
            return [actions.getRangeYear.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getRangeYear.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getRangeYear.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getRangeYear.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getMinimumAkp: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMinimumAkp.request)),
    switchMap(action =>
      from(api.masterService.getMinimumAkp()).pipe(
        concatMap(({data}) => {
          if (action?.payload?.next) {
            return [actions.getMinimumAkp.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getMinimumAkp.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getMinimumAkp.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getMinimumAkp.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getRangeBreakTime: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRangeBreakTime.request)),
    switchMap(action =>
      from(api.masterService.getRangeBreakTime()).pipe(
        concatMap(({data}) => {
          if (action?.payload?.next) {
            return [actions.getRangeBreakTime.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getRangeBreakTime.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getRangeBreakTime.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getRangeBreakTime.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getSupervisions: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getSupervisions.request)),
    switchMap(action =>
      from(api.masterService.getSupervisions()).pipe(
        concatMap(({data}) => {
          if (action?.payload?.next) {
            return [[actions.getSupervisions.success({loading: false, data: data.response})], action?.payload?.next]
          }
          return [actions.getSupervisions.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getSupervisions.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getSupervisions.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getWorkStatus: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getWorkStatus.request)),
    switchMap(action =>
      from(api.masterService.getWorkStatus()).pipe(
        concatMap(({data}) => {
          if (action?.payload?.next) {
            return [actions.getWorkStatus.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getWorkStatus.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getWorkStatus.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getWorkStatus.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
export default [
  getProvinces,
  getUoms,
  getRangeYear,
  getTypeEmployee,
  getSupervisions,
  getWorkStatus,
  getRangeBreakTime,
  getMinimumAkp,
]
