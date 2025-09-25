import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/rkh-take-care/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IRKHTakeCareFormData, IRKHTakeCareRow} from '@app/models/eplant/RKHTakeCare'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdResponse from '@app/models/commons/IStdResponse'

export const createRKHTakeCare = createAsyncAction(
  c.CREATE_RKH_TAKE_CARE_REQUEST,
  c.CREATE_RKH_TAKE_CARE_SUCCESS,
  c.CREATE_RKH_TAKE_CARE_FAILURE,
)<IEffectPayload<IRKHTakeCareFormData, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const getRKHTakeCareLists = createAsyncAction(
  c.GET_RKH_TAKE_CARE_LIST_REQUEST,
  c.GET_RKH_TAKE_CARE_LIST_SUCCESS,
  c.GET_RKH_TAKE_CARE_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IRKHTakeCareRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getRKHTakeCareAll = createAsyncAction(
  c.GET_RKH_TAKE_CARE_ALL_REQUEST,
  c.GET_RKH_TAKE_CARE_ALL_SUCCESS,
  c.GET_RKH_TAKE_CARE_ALL_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IRKHTakeCareRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const editRKHTakeCare = createAsyncAction(
  c.EDIT_RKH_TAKE_CARE_REQUEST,
  c.EDIT_RKH_TAKE_CARE_SUCCESS,
  c.EDIT_RKH_TAKE_CARE_FAILURE,
)<
  IEffectPayload<IRKHTakeCareFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteRKHTakeCare = createAsyncAction(
  c.DELETE_RKH_TAKE_CARE_REQUEST,
  c.DELETE_RKH_TAKE_CARE_SUCCESS,
  c.DELETE_RKH_TAKE_CARE_FAILURE,
)<IEffectPayload<IRKHTakeCareRow, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getRKHTakeCareDetail = createAsyncAction(
  c.DETAIL_RKH_TAKE_CARE_REQUEST,
  c.DETAIL_RKH_TAKE_CARE_SUCCESS,
  c.DETAIL_RKH_TAKE_CARE_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IRKHTakeCareRow, false>, IEffectPayload<null, false, IError>>()

export const clearRkhTakeCareDraft = createAsyncAction(
  c.CLEAR_DRAFT_RKH_TAKE_CARE_REQUEST,
  c.CLEAR_DRAFT_RKH_TAKE_CARE_SUCCESS,
  c.CLEAR_DRAFT_RKH_TAKE_CARE_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const addRKHTakeCareTemp = createAction(c.ADD_RKH_TAKE_CARE_TEMP, payload => payload)()
export const editRKHTakeCareTemp = createAction(c.EDIT_RKH_TAKE_CARE_TEMP, payload => payload)()
export const deleteRKHTakeCareTemp = createAction(c.DELETE_RKH_TAKE_CARE_TEMP, payload => payload)()
export const syncRKHTakeCare = createAction(c.SYNC_RKH_TAKE_CARE_REQUEST)()

export const clearFormRKHTakeCareStatus = createAction(c.CREATE_OR_EDIT_RKH_TAKE_CARE_CLEAR, clearAction)()
export const clearDeleteRKHTakeCareStatus = createAction(c.DELETE_RKH_TAKE_CARE_CLEAR, clearAction)()
