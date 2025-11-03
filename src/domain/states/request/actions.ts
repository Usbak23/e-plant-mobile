import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import {IMyRequest, IMyRequestDetail, IMyRequestForm} from '@app/models/eplant/MyRequest'
import {IProcessRequest} from '@app/models/eplant/Request'
import {createAction, createAsyncAction} from 'typesafe-actions'
import {IEffectPayload, IError} from '../types'
import clearAction from '../utils/clearAction'
import * as c from './constants'

export const createMyRequest = createAsyncAction(
  c.CREATE_REQUEST_REQUEST,
  c.CREATE_REQUEST_SUCCESS,
  c.CREATE_REQUEST_FAILURE,
)<IEffectPayload<IMyRequestForm, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getMyRequestList = createAsyncAction(
  c.GET_REQUEST_LIST_REQUEST,
  c.GET_REQUEST_LIST_SUCCESS,
  c.GET_REQUEST_LIST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<IMyRequest>, false>, IEffectPayload<null, false, IError>>()

export const editMyRequest = createAsyncAction(c.EDIT_REQUEST_REQUEST, c.EDIT_REQUEST_SUCCESS, c.EDIT_REQUEST_FAILURE)<
  IEffectPayload<IMyRequestForm, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const processRequest = createAsyncAction(
  c.PROCESS_REQUEST_REQUEST,
  c.PROCESS_REQUEST_SUCCESS,
  c.PROCESS_REQUEST_FAILURE,
)<IEffectPayload<IProcessRequest, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const deleteMyRequest = createAsyncAction(
  c.DELETE_REQUEST_REQUEST,
  c.DELETE_REQUEST_SUCCESS,
  c.DELETE_REQUEST_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getMyRequestDetail = createAsyncAction(
  c.DETAIL_REQUEST_REQUEST,
  c.DETAIL_REQUEST_SUCCESS,
  c.DETAIL_REQUEST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IMyRequestDetail, false>, IEffectPayload<null, false, IError>>()

export const clearProcessRequest = createAction(c.PROCESS_REQUEST_CLEAR, clearAction)()
export const clearFormMyRequest = createAction(c.CREATE_OR_EDIT_REQUEST_CLEAR, clearAction)()
export const clearDeleteMyRequestStatus = createAction(c.DELETE_REQUEST_CLEAR, clearAction)()
