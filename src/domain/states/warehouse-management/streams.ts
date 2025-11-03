import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/warehouse-management/actions'
import {StreamType} from '@app/domain/states/types'
import {IManagamentWarehouseBPUForm, IManagementWarehouseApproveForm} from '@app/models/eplant/WarehouseManagement'

const getWarehouseList: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getWarehouseList.request)),
    switchMap(action =>
      from(api.warehouseManagementService.getWarehouseList(action.payload.data)).pipe(
        map(({data}: any) => actions.getWarehouseList.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getWarehouseList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getWarehouseDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getWarehouseDetail.request)),
    switchMap(action =>
      from(api.warehouseManagementService.getWarehouseDetail(action.payload.data as string)).pipe(
        map(({data}: any) => actions.getWarehouseDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getWarehouseDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const postBPUWarehouse: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.postBPUWarehouse.request)),
    switchMap(action =>
      from(api.warehouseManagementService.postBPU(action.payload.data as IManagamentWarehouseBPUForm)).pipe(
        concatMap((data: any) => [
          actions.postBPUWarehouse.success({loading: false, data}),
          actions.clearFormPostBPU(),
        ]),
        catchError(error => {
          return of(actions.postBPUWarehouse.failure({loading: false, error}), actions.clearFormPostBPU())
        }),
      ),
    ),
  )
}

const approveWarehouse: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.approveWarehouse.request)),
    switchMap(action =>
      from(api.warehouseManagementService.approve(action.payload.data as IManagementWarehouseApproveForm)).pipe(
        concatMap((data: any) => [
          actions.approveWarehouse.success({loading: false, data}),
          actions.clearFormApproveWarehouse(),
        ]),
        catchError(error => {
          return of(actions.approveWarehouse.failure({loading: false, error}), actions.clearFormApproveWarehouse())
        }),
      ),
    ),
  )
}

export default [getWarehouseList, getWarehouseDetail, postBPUWarehouse, approveWarehouse]
