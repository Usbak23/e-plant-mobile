import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/maintenance/actions'
import {StreamType} from '@app/domain/states/types'
import {IMaintenanceForm} from '@app/models/eplant/Maintenance'

const createMaintenance: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createMaintenance.request)),
    switchMap(action => {
      return from(api.maintenanceService.createMaintenance(action.payload.data as IMaintenanceForm)).pipe(
        concatMap((data: any) => {
          return [actions.createMaintenance.success({loading: false, data}), actions.clearFormMaintenance()]
        }),
        catchError(error => {
          return of(actions.createMaintenance.failure({loading: false, error}), actions.clearFormMaintenance())
        }),
      )
    }),
  )
}

const getMaintenanceList: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMaintenanceList.request)),
    switchMap(action =>
      from(api.maintenanceService.getMaintenancePaginated(action.payload.data)).pipe(
        map(({data}: any) => actions.getMaintenanceList.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getMaintenanceList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const editMaintenance: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editMaintenance.request)),
    switchMap(action => {
      return from(api.maintenanceService.editMaintenance(action.payload.data as IMaintenanceForm)).pipe(
        concatMap((data: any) => [
          actions.editMaintenance.success({loading: false, data}),
          actions.clearFormMaintenance(),
        ]),
        catchError(error =>
          of(actions.editMaintenance.failure({loading: false, error}), actions.clearFormMaintenance()),
        ),
      )
    }),
  )
}

const deleteMaintenance: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteMaintenance.request)),
    switchMap(action => {
      return from(api.maintenanceService.deleteMaintenance(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteMaintenance.success({loading: false, data}),
          actions.clearDeleteMaintenaceStatus(),
        ]),
        catchError(error =>
          of(actions.deleteMaintenance.failure({loading: false, error}), actions.clearDeleteMaintenaceStatus()),
        ),
      )
    }),
  )
}

const getMaintenanceDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMaintenanceDetail.request)),
    switchMap(action => {
      return from(api.maintenanceService.getMaintenanceDetail(action.payload.data as string)).pipe(
        concatMap((data: any) => [actions.getMaintenanceDetail.success({loading: false, data: data?.data?.response})]),
        catchError(error => of(actions.getMaintenanceDetail.failure({loading: false, error}))),
      )
    }),
  )
}

export default [createMaintenance, getMaintenanceList, editMaintenance, deleteMaintenance, getMaintenanceDetail]
