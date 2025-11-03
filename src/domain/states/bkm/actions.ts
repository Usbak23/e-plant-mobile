import { createAsyncAction, createAction } from 'typesafe-actions'
import * as c from '@app/domain/states/bkm/constants'
import { IEffectPayload, IError } from '@app/domain/states/types'
import { IBKMDetail, IBKMFormDataCreate, IBKMFormDataUpdate, IBKMRow } from '@app/models/eplant/BKM'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdResponse from '@app/models/commons/IStdResponse'

export const createBKM = createAsyncAction(c.CREATE_BKM_REQUEST, c.CREATE_BKM_SUCCESS, c.CREATE_BKM_FAILURE)<
  IEffectPayload<IBKMFormDataCreate, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getBKMLists = createAsyncAction(c.GET_BKM_LIST_REQUEST, c.GET_BKM_LIST_SUCCESS, c.GET_BKM_LIST_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IBKMRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const editBKM = createAsyncAction(c.EDIT_BKM_REQUEST, c.EDIT_BKM_SUCCESS, c.EDIT_BKM_FAILURE)<
  IEffectPayload<IBKMFormDataUpdate, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteBKM = createAsyncAction(c.DELETE_BKM_REQUEST, c.DELETE_BKM_SUCCESS, c.DELETE_BKM_FAILURE)<
  IEffectPayload<any, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getBKMDetail = createAsyncAction(c.DETAIL_BKM_REQUEST, c.DETAIL_BKM_SUCCESS, c.DETAIL_BKM_FAILURE)<
  IEffectPayload<string, true>,
  IEffectPayload<IBKMDetail, false>,
  IEffectPayload<null, false, IError>
>()

export const getBKMMobile = createAsyncAction(c.MOBILE_BKM_REQUEST, c.MOBILE_BKM_SUCCESS, c.MOBILE_BKM_FAILURE)<
  IEffectPayload<{ organizationId?: string; divisionId?: string; date?: string; foremanId?: string, subActivityId?: string }, true>,
  IEffectPayload<IBKMDetail, false>,
  IEffectPayload<null, false, IError>
>()

export const clearBkmDraft = createAsyncAction(
  c.CLEAR_DRAFT_BKM_REQUEST,
  c.CLEAR_DRAFT_BKM_SUCCESS,
  c.CLEAR_DRAFT_BKM_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const addBKMTemp = createAction(c.ADD_BKM_TEMP, payload => payload)()
export const editBKMTemp = createAction(c.EDIT_BKM_TEMP, payload => payload)()
export const deleteBKMTemp = createAction(c.DELETE_BKM_TEMP, payload => payload)()
export const deleteBKMEmployeeTemp = createAction(c.DELETE_BKM_EMPLOYEE_TEMP, payload => payload)()
export const syncBKM = createAction(c.SYNC_BKM_REQUEST)()

export const clearFormBKMStatus = createAction(c.CREATE_OR_EDIT_BKM_CLEAR, clearAction)()
export const clearDeleteBKMStatus = createAction(c.DELETE_BKM_CLEAR, clearAction)()
