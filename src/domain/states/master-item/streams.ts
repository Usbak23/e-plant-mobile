import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/master-item/actions'
import {StreamType} from '@app/domain/states/types'
import {IMasterItemFormData} from '@app/models/eplant/MasterItem'

const createMasterItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createMasterItem.request)),
    switchMap(action => {
      return from(api.masterItemService.createMasterItem(action.payload.data as IMasterItemFormData)).pipe(
        concatMap((data: any) => [
          actions.createMasterItem.success({loading: false, data}),
          actions.clearFormMasterItemStatus(),
        ]),
        catchError(error => {
          return of(actions.createMasterItem.failure({loading: false, error}), actions.clearFormMasterItemStatus())
        }),
      )
    }),
  )
}

const editMasterItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editMasterItem.request)),
    switchMap(action => {
      return from(api.masterItemService.editMasterItem(action.payload.data as IMasterItemFormData)).pipe(
        concatMap((data: any) => {
          return [actions.editMasterItem.success({loading: false, data}), actions.clearFormMasterItemStatus()]
        }),
        catchError(error =>
          of(actions.editMasterItem.failure({loading: false, error}), actions.clearFormMasterItemStatus()),
        ),
      )
    }),
  )
}

const deleteMasterItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteMasterItem.request)),
    switchMap(action => {
      return from(api.masterItemService.deleteMasterItem(action.payload.data as string)).pipe(
        concatMap(data => [
          actions.deleteMasterItem.success({loading: false, data}),
          actions.clearDeleteMasterItemStatus(),
        ]),
        catchError(error =>
          of(actions.deleteMasterItem.failure({loading: false, error}), actions.clearDeleteMasterItemStatus()),
        ),
      )
    }),
  )
}
const getMasterItemLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMasterItemLists.request)),
    switchMap(action =>
      from(api.masterItemService.getMasterItemLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getMasterItemLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getMasterItemLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getMasterItemDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMasterItemDetail.request)),
    switchMap(action =>
      from(api.masterItemService.getMasterItemDetail(action.payload.data)).pipe(
        map(({data}: any) => actions.getMasterItemDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getMasterItemDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getMasterItemAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMasterItemAll.request)),
    switchMap(action =>
      from(api.masterItemService.getMasterItemAll(action.payload.data)).pipe(
        map(({data}: any) => actions.getMasterItemAll.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getMasterItemAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [
  createMasterItem,
  editMasterItem,
  deleteMasterItem,
  getMasterItemLists,
  getMasterItemAll,
  getMasterItemDetail,
]
