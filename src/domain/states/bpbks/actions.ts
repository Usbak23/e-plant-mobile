import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/bpbks/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IBPBKSFormDataCreate, IBPBKSFormDataUpdate, IBPBKSResponse} from '@app/models/eplant/BPBKS'
import clearAction from '@domain/states/utils/clearAction'
import IStdResponse from '@app/models/commons/IStdResponse'

export const createBPBKS = createAsyncAction(c.CREATE_BPBKS_REQUEST, c.CREATE_BPBKS_SUCCESS, c.CREATE_BPBKS_FAILURE)<
  IEffectPayload<IBPBKSFormDataCreate, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const editBPBKS = createAsyncAction(c.EDIT_BPBKS_REQUEST, c.EDIT_BPBKS_SUCCESS, c.EDIT_BPBKS_FAILURE)<
  IEffectPayload<IBPBKSFormDataUpdate, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteBPBKS = createAsyncAction(c.DELETE_BPBKS_REQUEST, c.DELETE_BPBKS_SUCCESS, c.DELETE_BPBKS_FAILURE)<
  IEffectPayload<any, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getBPBKSAll = createAsyncAction(c.DETAIL_BPBKS_REQUEST, c.DETAIL_BPBKS_SUCCESS, c.DETAIL_BPBKS_FAILURE)<
  IEffectPayload<any, true>,
  IEffectPayload<IBPBKSResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const clearBpbksDraft = createAsyncAction(
  c.CLEAR_DRAFT_BPBKS_REQUEST,
  c.CLEAR_DRAFT_BPBKS_SUCCESS,
  c.CLEAR_DRAFT_BPBKS_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const addBPBKSTemp = createAction(c.ADD_BPBKS_TEMP, payload => payload)()
export const editBPBKSTemp = createAction(c.EDIT_BPBKS_TEMP, payload => payload)()
export const deleteBPBKSTemp = createAction(c.DELETE_BPBKS_TEMP, payload => payload)()
export const deleteBPBKSEmployeeTemp = createAction(c.DELETE_BPBKS_EMPLOYEE_TEMP, payload => payload)()
export const syncBPBKS = createAction(c.SYNC_BPBKS_REQUEST)()

export const clearFormBPBKSStatus = createAction(c.CREATE_OR_EDIT_BPBKS_CLEAR, clearAction)()
export const clearDeleteBPBKSStatus = createAction(c.DELETE_BPBKS_CLEAR, clearAction)()
