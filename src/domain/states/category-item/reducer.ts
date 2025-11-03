import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/category-item/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {ICategoryItemDetail, ICategoryItemRow, ICategoryItemRowAll} from '@app/models/eplant/CategoryItem'

export interface IRSCategoryItem {
  formCategoryItemStatus?: IEffectPayload
  deleteCategoryItemStatus?: IEffectPayload
  categoryItemAll?: IEffectPayload<ICategoryItemRowAll[]>
  categoryItemList?: IEffectPayload<IPagingDocs<ICategoryItemRow>>
  categoryItemDetail?: IEffectPayload<ICategoryItemDetail>
}

const DEFAULT_STATE = {}

const categoryItemReducer = createReducer<IRSCategoryItem, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createCategoryItem.request,
      actions.createCategoryItem.failure,
      actions.createCategoryItem.success,
      actions.editCategoryItem.request,
      actions.editCategoryItem.failure,
      actions.editCategoryItem.success,
      actions.clearFormCategoryItemStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formCategoryItemStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteCategoryItem.request,
      actions.deleteCategoryItem.failure,
      actions.deleteCategoryItem.success,
      actions.clearDeleteCategoryItemStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteCategoryItemStatus: payload,
      }
    },
  )
  .handleAction([actions.getCategoryItemLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: ICategoryItemRow[] = state?.categoryItemList?.data?.docs || []
      return {
        ...state,
        categoryItemList: {
          ...payload,
          data: {
            ...payload.data,
            docs: [...prevDocs, ...payload.data.docs],
          },
        },
      }
    }
    return {
      ...state,
      categoryItemList: payload,
    }
  })
  .handleAction([actions.getCategoryItemLists.request, actions.getCategoryItemLists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      categoryItemList: {
        ...payload,
        data: state.categoryItemList?.data,
      },
    }
  })
  .handleAction(
    [
      actions.getCategoryItemDetail.request,
      actions.getCategoryItemDetail.failure,
      actions.getCategoryItemDetail.success,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        categoryItemDetail: payload,
      }
    },
  )
  .handleAction(
    [actions.getCategoryItemAll.request, actions.getCategoryItemAll.success, actions.getCategoryItemAll.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        categoryItemAll: {
          data: state.categoryItemAll?.data,
          ...payload,
        },
      }
    },
  )

export default categoryItemReducer
