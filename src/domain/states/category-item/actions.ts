import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/category-item/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {ICategoryItemFormData, ICategoryItemRow, ICategoryItemRowAll} from '@app/models/eplant/CategoryItem'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdEntity from '@app/models/commons/IStdEntity'

export const createCategoryItem = createAsyncAction(
  c.CREATE_CATEGORY_ITEM_REQUEST,
  c.CREATE_CATEGORY_ITEM_SUCCESS,
  c.CREATE_CATEGORY_ITEM_FAILURE,
)<IEffectPayload<ICategoryItemFormData, true>, IEffectPayload<IStdEntity, false>, IEffectPayload<null, false, IError>>()

export const editCategoryItem = createAsyncAction(
  c.EDIT_CATEGORY_ITEM_REQUEST,
  c.EDIT_CATEGORY_ITEM_SUCCESS,
  c.EDIT_CATEGORY_ITEM_FAILURE,
)<IEffectPayload<ICategoryItemFormData, true>, IEffectPayload<IStdEntity, false>, IEffectPayload<null, false, IError>>()

export const deleteCategoryItem = createAsyncAction(
  c.DELETE_CATEGORY_ITEM_REQUEST,
  c.DELETE_CATEGORY_ITEM_SUCCESS,
  c.DELETE_CATEGORY_ITEM_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const getCategoryItemLists = createAsyncAction(
  c.GET_CATEGORY_ITEM_LIST_REQUEST,
  c.GET_CATEGORY_ITEM_LIST_SUCCESS,
  c.GET_CATEGORY_ITEM_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<ICategoryItemRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getCategoryItemDetail = createAsyncAction(
  c.GET_CATEGORY_ITEM_DETAIL_REQUEST,
  c.GET_CATEGORY_ITEM_DETAIL_SUCCESS,
  c.GET_CATEGORY_ITEM_DETAIL_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<ICategoryItemRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getCategoryItemAll = createAsyncAction(
  c.GET_CATEGORY_ITEM_ALL_REQUEST,
  c.GET_CATEGORY_ITEM_ALL_SUCCESS,
  c.GET_CATEGORY_ITEM_ALL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<ICategoryItemRowAll[], false>, IEffectPayload<null, false, IError>>()

export const clearFormCategoryItemStatus = createAction(c.CREATE_OR_EDIT_CATEGORY_ITEM_CLEAR, clearAction)()
export const clearDeleteCategoryItemStatus = createAction(c.DELETE_CATEGORY_ITEM_CLEAR, clearAction)()
