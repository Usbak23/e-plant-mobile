import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from './constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import clearAction from '@domain/states/utils/clearAction'
import uuid from 'react-native-uuid'

export const getSpbLocalList = createAsyncAction(
  c.GET_SPB_LOCAL_LIST_REQUEST,
  c.GET_SPB_LOCAL_LIST_SUCCESS,
  c.GET_SPB_LOCAL_LIST_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const getSpbLocalDetail = createAsyncAction(
  c.GET_SPB_LOCAL_DETAIL_REQUEST,
  c.GET_SPB_LOCAL_DETAIL_SUCCESS,
  c.GET_SPB_LOCAL_DETAIL_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const createSpbLocal = createAsyncAction(
  c.CREATE_SPB_LOCAL_REQUEST,
  c.CREATE_SPB_LOCAL_SUCCESS,
  c.CREATE_SPB_LOCAL_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const updateSpbLocal = createAsyncAction(
  c.UPDATE_SPB_LOCAL_REQUEST,
  c.UPDATE_SPB_LOCAL_SUCCESS,
  c.UPDATE_SPB_LOCAL_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const deleteSpbLocal = createAsyncAction(
  c.DELETE_SPB_LOCAL_REQUEST,
  c.DELETE_SPB_LOCAL_SUCCESS,
  c.DELETE_SPB_LOCAL_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const clearSpbLocalForm = createAction(c.CLEAR_SPB_LOCAL_FORM, clearAction)()
export const clearSpbLocalDelete = createAction(c.CLEAR_SPB_LOCAL_DELETE, clearAction)()
export const clearSpbLocal = createAction(c.CLEAR_SPB_LOCAL, clearAction)()

export const addSpbLocalTemp = createAction(c.ADD_SPB_LOCAL_TEMP)<any>()
export const editSpbLocalTemp = createAction(c.EDIT_SPB_LOCAL_TEMP)<any>()
export const deleteSpbLocalTemp = createAction(c.DELETE_SPB_LOCAL_TEMP)<any>()
export const syncSpbLocal = createAction(c.SYNC_SPB_LOCAL_REQUEST)()
export const updateSpbLocalTempStatus = createAction(c.UPDATE_SPB_LOCAL_TEMP_STATUS)<{tempId: string; syncStatus: 'pending' | 'syncing' | 'success' | 'failed'; syncError?: string}>()
