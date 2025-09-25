import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/item/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IItemFormData, IItemRow, IItemRowAll} from '@app/models/eplant/Item'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdEntity from '@app/models/commons/IStdEntity'

export const createItem = createAsyncAction(c.CREATE_ITEM_REQUEST, c.CREATE_ITEM_SUCCESS, c.CREATE_ITEM_FAILURE)<
  IEffectPayload<IItemFormData, true>,
  IEffectPayload<IStdEntity, false>,
  IEffectPayload<null, false, IError>
>()

export const editItem = createAsyncAction(c.EDIT_ITEM_REQUEST, c.EDIT_ITEM_SUCCESS, c.EDIT_ITEM_FAILURE)<
  IEffectPayload<IItemFormData, true>,
  IEffectPayload<IStdEntity, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteItem = createAsyncAction(c.DELETE_ITEM_REQUEST, c.DELETE_ITEM_SUCCESS, c.DELETE_ITEM_FAILURE)<
  IEffectPayload<string, true>,
  IEffectPayload<any, false>,
  IEffectPayload<null, false, IError>
>()

export const getItemLists = createAsyncAction(
  c.GET_ITEM_LIST_REQUEST,
  c.GET_ITEM_LIST_SUCCESS,
  c.GET_ITEM_LIST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<IItemRow>, false>, IEffectPayload<null, false, IError>>()

export const getItemDetail = createAsyncAction(
  c.GET_ITEM_DETAIL_REQUEST,
  c.GET_ITEM_DETAIL_SUCCESS,
  c.GET_ITEM_DETAIL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<IItemRow>, false>, IEffectPayload<null, false, IError>>()

export const getItemAll = createAsyncAction(c.GET_ITEM_ALL_REQUEST, c.GET_ITEM_ALL_SUCCESS, c.GET_ITEM_ALL_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IItemRowAll[], false>,
  IEffectPayload<null, false, IError>
>()

export const clearFormItemStatus = createAction(c.CREATE_OR_EDIT_ITEM_CLEAR, clearAction)()
export const clearDeleteItemStatus = createAction(c.DELETE_ITEM_CLEAR, clearAction)()
