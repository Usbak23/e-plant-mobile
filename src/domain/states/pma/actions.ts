import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/pma/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import IStdResponse from '@app/models/commons/IStdResponse'
import {IPMA, IPMADetail, IPMAFormData, IPMAFormEmployeeUpdate, IPMARow} from '@app/models/eplant/PMA'
import clearAction from '../utils/clearAction'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export const createPMA = createAsyncAction(c.CREATE_PMA_REQUEST, c.CREATE_PMA_SUCCESS, c.CREATE_PMA_FAILURE)<
  IEffectPayload<IPMAFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getPMAMobile = createAsyncAction(c.MOBILE_PMA_REQUEST, c.MOBILE_PMA_SUCCESS, c.MOBILE_PMA_FAILURE)<
  IEffectPayload<any, true>,
  IEffectPayload<IPMA, false>,
  IEffectPayload<null, false, IError>
>()

export const editPMA = createAsyncAction(c.EDIT_PMA_REQUEST, c.EDIT_PMA_SUCCESS, c.EDIT_PMA_FAILURE)<
  IEffectPayload<IPMAFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const editSinglePMAEmployee = createAsyncAction(
  c.EDIT_PMA_EMPLOYEE_REQUEST,
  c.EDIT_PMA_EMPLOYEE_SUCCESS,
  c.EDIT_PMA_EMPLOYEE_FAILURE,
)<
  IEffectPayload<IPMAFormEmployeeUpdate, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deletePMA = createAsyncAction(c.DELETE_PMA_REQUEST, c.DELETE_PMA_SUCCESS, c.DELETE_PMA_FAILURE)<
  IEffectPayload<any, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getPMADetail = createAsyncAction(c.DETAIL_PMA_REQUEST, c.DETAIL_PMA_SUCCESS, c.DETAIL_PMA_FAILURE)<
  IEffectPayload<string, true>,
  IEffectPayload<IPMADetail, false>,
  IEffectPayload<null, false, IError>
>()

export const getPMALists = createAsyncAction(c.GET_PMA_LIST_REQUEST, c.GET_PMA_LIST_SUCCESS, c.GET_PMA_LIST_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IPMARow>, false>,
  IEffectPayload<null, false, IError>
>()

export const clearPmaDraft = createAsyncAction(
  c.CLEAR_DRAFT_PMA_REQUEST,
  c.CLEAR_DRAFT_PMA_SUCCESS,
  c.CLEAR_DRAFT_PMA_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const addPMATemp = createAction(c.ADD_PMA_TEMP, payload => payload)()
export const editPMATemp = createAction(c.EDIT_PMA_TEMP, payload => payload)()
export const deletePMATemp = createAction(c.DELETE_PMA_TEMP, payload => payload)()
export const deletePMAEmployeeTemp = createAction(c.DELETE_PMA_EMPLOYEE_TEMP, payload => payload)()
export const syncPMA = createAction(c.SYNC_PMA_REQUEST)()

export const clearFormPMAStatus = createAction(c.CREATE_OR_EDIT_PMA_CLEAR, clearAction)()
export const clearFormPMAEmployeeStatus = createAction(c.CREATE_OR_EDIT_PMA_EMPLOYEE_CLEAR, clearAction)()
export const clearDeletePMAStatus = createAction(c.DELETE_PMA_CLEAR, clearAction)()
