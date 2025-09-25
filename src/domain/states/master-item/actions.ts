import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/master-item/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IMasterItemFormData, IMasterItemRow, IMasterItemRowAll} from '@app/models/eplant/MasterItem'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdEntity from '@app/models/commons/IStdEntity'

export const createMasterItem = createAsyncAction(
  c.CREATE_MASTER_ITEM_REQUEST,
  c.CREATE_MASTER_ITEM_SUCCESS,
  c.CREATE_MASTER_ITEM_FAILURE,
)<IEffectPayload<IMasterItemFormData, true>, IEffectPayload<IStdEntity, false>, IEffectPayload<null, false, IError>>()

export const editMasterItem = createAsyncAction(
  c.EDIT_MASTER_ITEM_REQUEST,
  c.EDIT_MASTER_ITEM_SUCCESS,
  c.EDIT_MASTER_ITEM_FAILURE,
)<IEffectPayload<IMasterItemFormData, true>, IEffectPayload<IStdEntity, false>, IEffectPayload<null, false, IError>>()

export const deleteMasterItem = createAsyncAction(
  c.DELETE_MASTER_ITEM_REQUEST,
  c.DELETE_MASTER_ITEM_SUCCESS,
  c.DELETE_MASTER_ITEM_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const getMasterItemLists = createAsyncAction(
  c.GET_MASTER_ITEM_LIST_REQUEST,
  c.GET_MASTER_ITEM_LIST_SUCCESS,
  c.GET_MASTER_ITEM_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IMasterItemRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getMasterItemDetail = createAsyncAction(
  c.GET_MASTER_ITEM_DETAIL_REQUEST,
  c.GET_MASTER_ITEM_DETAIL_SUCCESS,
  c.GET_MASTER_ITEM_DETAIL_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IMasterItemRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getMasterItemAll = createAsyncAction(
  c.GET_MASTER_ITEM_ALL_REQUEST,
  c.GET_MASTER_ITEM_ALL_SUCCESS,
  c.GET_MASTER_ITEM_ALL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IMasterItemRowAll[], false>, IEffectPayload<null, false, IError>>()

export const clearFormMasterItemStatus = createAction(c.CREATE_OR_EDIT_MASTER_ITEM_CLEAR, clearAction)()
export const clearDeleteMasterItemStatus = createAction(c.DELETE_MASTER_ITEM_CLEAR, clearAction)()
