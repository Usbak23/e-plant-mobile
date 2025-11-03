import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/item/actions'
import {StreamType} from '@app/domain/states/types'
import {IItemFormData} from '@app/models/eplant/Item'

const createItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createItem.request)),
    switchMap(action => {
      return from(api.itemService.createItem(action.payload.data as IItemFormData)).pipe(
        concatMap((data: any) => [actions.createItem.success({loading: false, data}), actions.clearFormItemStatus()]),
        catchError(error => {
          return of(actions.createItem.failure({loading: false, error}), actions.clearFormItemStatus())
        }),
      )
    }),
  )
}

const editItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editItem.request)),
    switchMap(action => {
      return from(api.itemService.editItem(action.payload.data as IItemFormData)).pipe(
        concatMap((data: any) => {
          return [actions.editItem.success({loading: false, data}), actions.clearFormItemStatus()]
        }),
        catchError(error => of(actions.editItem.failure({loading: false, error}), actions.clearFormItemStatus())),
      )
    }),
  )
}

const deleteItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteItem.request)),
    switchMap(action => {
      return from(api.itemService.deleteItem(action.payload.data as string)).pipe(
        concatMap(data => [actions.deleteItem.success({loading: false, data}), actions.clearDeleteItemStatus()]),
        catchError(error => of(actions.deleteItem.failure({loading: false, error}), actions.clearDeleteItemStatus())),
      )
    }),
  )
}
const getItemLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getItemLists.request)),
    switchMap(action =>
      from(api.itemService.getItemLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getItemLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getItemLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getItemDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getItemDetail.request)),
    switchMap(action =>
      from(api.itemService.getItemDetail(action.payload.data)).pipe(
        map(({data}: any) => actions.getItemDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getItemDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getItemAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getItemAll.request)),
    switchMap(action =>
      from(api.itemService.getItemAll(action.payload.data)).pipe(
        concatMap(({data}: any) => {
          if (action?.payload?.next) {
            return [actions.getItemAll.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getItemAll.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getItemAll.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getItemAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [createItem, editItem, deleteItem, getItemLists, getItemAll, getItemDetail]
