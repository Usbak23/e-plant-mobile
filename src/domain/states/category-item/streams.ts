import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/category-item/actions'
import {StreamType} from '@app/domain/states/types'
import {ICategoryItemFormData} from '@app/models/eplant/CategoryItem'

const createCategoryItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createCategoryItem.request)),
    switchMap(action => {
      return from(api.categoryItemService.createCategoryItem(action.payload.data as ICategoryItemFormData)).pipe(
        concatMap((data: any) => [
          actions.createCategoryItem.success({loading: false, data}),
          actions.clearFormCategoryItemStatus(),
        ]),
        catchError(error => {
          return of(actions.createCategoryItem.failure({loading: false, error}), actions.clearFormCategoryItemStatus())
        }),
      )
    }),
  )
}

const editCategoryItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editCategoryItem.request)),
    switchMap(action => {
      return from(api.categoryItemService.editCategoryItem(action.payload.data as ICategoryItemFormData)).pipe(
        concatMap((data: any) => {
          return [actions.editCategoryItem.success({loading: false, data}), actions.clearFormCategoryItemStatus()]
        }),
        catchError(error =>
          of(actions.editCategoryItem.failure({loading: false, error}), actions.clearFormCategoryItemStatus()),
        ),
      )
    }),
  )
}

const deleteCategoryItem: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteCategoryItem.request)),
    switchMap(action => {
      return from(api.categoryItemService.deleteCategoryItem(action.payload.data as string)).pipe(
        concatMap(data => [
          actions.deleteCategoryItem.success({loading: false, data}),
          actions.clearDeleteCategoryItemStatus(),
        ]),
        catchError(error =>
          of(actions.deleteCategoryItem.failure({loading: false, error}), actions.clearDeleteCategoryItemStatus()),
        ),
      )
    }),
  )
}
const getCategoryItemLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getCategoryItemLists.request)),
    switchMap(action =>
      from(api.categoryItemService.getCategoryItemLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getCategoryItemLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getCategoryItemLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getCategoryItemDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getCategoryItemDetail.request)),
    switchMap(action =>
      from(api.categoryItemService.getCategoryItemDetail(action.payload.data)).pipe(
        map(({data}: any) => actions.getCategoryItemDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getCategoryItemDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}
const getCategoryItemAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getCategoryItemAll.request)),
    switchMap(action =>
      from(api.categoryItemService.getCategoryItemAll(action.payload.data)).pipe(
        map(({data}: any) => actions.getCategoryItemAll.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getCategoryItemAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [
  createCategoryItem,
  editCategoryItem,
  deleteCategoryItem,
  getCategoryItemLists,
  getCategoryItemAll,
  getCategoryItemDetail,
]
