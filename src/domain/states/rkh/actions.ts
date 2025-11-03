import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/rkh/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IRKHAllRow, IRKHFormData, IRKHRow, IRKHSummary} from '@app/models/eplant/RKH'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdResponse from '@app/models/commons/IStdResponse'

export const createRKH = createAsyncAction(c.CREATE_RKH_REQUEST, c.CREATE_RKH_SUCCESS, c.CREATE_RKH_FAILURE)<
  IEffectPayload<IRKHFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getRKHLists = createAsyncAction(c.GET_RKH_LIST_REQUEST, c.GET_RKH_LIST_SUCCESS, c.GET_RKH_LIST_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IRKHRow> & IRKHSummary, false>,
  IEffectPayload<null, false, IError>
>()

export const getRKHAll = createAsyncAction(c.GET_ALL_RKH_REQUEST, c.GET_ALL_RKH_SUCCESS, c.GET_ALL_RKH_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IRKHAllRow, false>,
  IEffectPayload<null, false, IError>
>()

export const editRKH = createAsyncAction(c.EDIT_RKH_REQUEST, c.EDIT_RKH_SUCCESS, c.EDIT_RKH_FAILURE)<
  IEffectPayload<IRKHFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteRKH = createAsyncAction(c.DELETE_RKH_REQUEST, c.DELETE_RKH_SUCCESS, c.DELETE_RKH_FAILURE)<
  IEffectPayload<IRKHRow, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getRKHDetail = createAsyncAction(c.DETAIL_RKH_REQUEST, c.DETAIL_RKH_SUCCESS, c.DETAIL_RKH_FAILURE)<
  IEffectPayload<string, true>,
  IEffectPayload<IRKHRow, false>,
  IEffectPayload<null, false, IError>
>()

export const getRKHSummary = createAsyncAction(
  c.GET_RKH_SUMMARY_REQUEST,
  c.GET_RKH_SUMMARY_SUCCESS,
  c.GET_RKH_SUMMARY_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IRKHSummary, false>, IEffectPayload<null, false, IError>>()

export const clearRkhDraft = createAsyncAction(
  c.CLEAR_DRAFT_RKH_REQUEST,
  c.CLEAR_DRAFT_RKH_SUCCESS,
  c.CLEAR_DRAFT_RKH_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const addRKHTemp = createAction(c.ADD_RKH_TEMP, payload => payload)()
export const editRKHTemp = createAction(c.EDIT_RKH_TEMP, payload => payload)()
export const deleteRKHTemp = createAction(c.DELETE_RKH_TEMP, payload => payload)()
export const syncRKH = createAction(c.SYNC_RKH_REQUEST)()

export const clearFormRKHStatus = createAction(c.CREATE_OR_EDIT_RKH_CLEAR, clearAction)()
export const clearDeleteRKHStatus = createAction(c.DELETE_RKH_CLEAR, clearAction)()
export const clearRKHSummary = createAction(c.CLEAR_RKH_SUMMARY, clearAction)()
