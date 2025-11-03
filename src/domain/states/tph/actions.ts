import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/tph/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {ITPHFormData, ITPHRow, ITPHRowAll} from '@app/models/eplant/TPH'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdEntity from '@app/models/commons/IStdEntity'

export const createTPH = createAsyncAction(c.CREATE_TPH_REQUEST, c.CREATE_TPH_SUCCESS, c.CREATE_TPH_FAILURE)<
  IEffectPayload<ITPHFormData, true>,
  IEffectPayload<IStdEntity, false>,
  IEffectPayload<null, false, IError>
>()

export const editTPH = createAsyncAction(c.EDIT_TPH_REQUEST, c.EDIT_TPH_SUCCESS, c.EDIT_TPH_FAILURE)<
  IEffectPayload<ITPHFormData, true>,
  IEffectPayload<IStdEntity, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteTPH = createAsyncAction(c.DELETE_TPH_REQUEST, c.DELETE_TPH_SUCCESS, c.DELETE_TPH_FAILURE)<
  IEffectPayload<string, true>,
  IEffectPayload<any, false>,
  IEffectPayload<null, false, IError>
>()

export const getTPHLists = createAsyncAction(c.GET_TPH_LIST_REQUEST, c.GET_TPH_LIST_SUCCESS, c.GET_TPH_LIST_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<ITPHRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getTPHDetail = createAsyncAction(
  c.GET_TPH_DETAIL_REQUEST,
  c.GET_TPH_DETAIL_SUCCESS,
  c.GET_TPH_DETAIL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<ITPHRow>, false>, IEffectPayload<null, false, IError>>()

export const getTPHAll = createAsyncAction(c.GET_TPH_ALL_REQUEST, c.GET_TPH_ALL_SUCCESS, c.GET_TPH_ALL_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<any, false>,
  IEffectPayload<null, false, IError>
>()

export const clearFormTPHStatus = createAction(c.CREATE_OR_EDIT_TPH_CLEAR, clearAction)()
export const clearDeleteTPHStatus = createAction(c.DELETE_TPH_CLEAR, clearAction)()
