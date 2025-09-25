import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import {INormSubActivity} from '@app/models/eplant/NormSubactivity'
import {
  INormMaterial,
  IPurchasementHistoryRow,
  IRawMaterialDetail,
  IRawMaterialFormData,
  IRawMaterialRow,
  IRawMaterialUpdateFormData,
  IRawPurchasementHistoryFormData,
  IRawReceptionHistoryFormData,
  IReceptionHistoryRow,
} from '@app/models/eplant/RawMaterial'
import {createAction, createAsyncAction} from 'typesafe-actions'
import {IEffectPayload, IError} from '../types'
import clearAction from '../utils/clearAction'
import * as c from './constants'

export const createRawMaterial = createAsyncAction(
  c.CREATE_RAW_MATERIAL_REQUEST,
  c.CREATE_RAW_MATERIAL_SUCCESS,
  c.CREATE_RAW_MATERIAL_FAILURE,
)<
  IEffectPayload<IRawMaterialFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const editRawMaterial = createAsyncAction(
  c.UPDATE_RAW_MATERIAL_REQUEST,
  c.UPDATE_RAW_MATERIAL_SUCCESS,
  c.UPDATE_RAW_MATERIAL_FAILURE,
)<
  IEffectPayload<IRawMaterialUpdateFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getRawMaterialLists = createAsyncAction(
  c.GET_RAW_MATERIAL_LIST_REQUEST,
  c.GET_RAW_MATERIAL_LIST_SUCCESS,
  c.GET_RAW_MATERIAL_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IRawMaterialRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getNormMaterialList = createAsyncAction(
  c.GET_NORM_MATERIAL_REQUEST,
  c.GET_NORM_MATERIAL_SUCCESS,
  c.GET_NORM_MATERIAL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<INormMaterial, false>, IEffectPayload<null, false, IError>>()

export const getRawMaterialAll = createAsyncAction(
  c.GET_RAW_MATERIAL_ALL_REQUEST,
  c.GET_RAW_MATERIAL_ALL_SUCCESS,
  c.GET_RAW_MATERIAL_ALL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IRawMaterialRow[], false>, IEffectPayload<null, false, IError>>()

export const getRawMaterialDetail = createAsyncAction(
  c.GET_RAW_MATERIAL_DETAIL_REQUEST,
  c.GET_RAW_MATERIAL_DETAIL_SUCCESS,
  c.GET_RAW_MATERIAL_DETAIL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IRawMaterialDetail, false>, IEffectPayload<null, false, IError>>()

export const createPurchasementHistory = createAsyncAction(
  c.CREATE_PURCHASEMENT_HISTORY_REQUEST,
  c.CREATE_PURCHASEMENT_HISTORY_SUCCESS,
  c.CREATE_PURCHASEMENT_HISTORY_FAILURE,
)<
  IEffectPayload<IRawPurchasementHistoryFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const editPurchasementHistory = createAsyncAction(
  c.EDIT_PURCHASEMENT_HISTORY_REQUEST,
  c.EDIT_PURCHASEMENT_HISTORY_SUCCESS,
  c.EDIT_PURCHASEMENT_HISTORY_FAILURE,
)<
  IEffectPayload<IRawPurchasementHistoryFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getPurchasementHistoryLists = createAsyncAction(
  c.GET_PURCHASEMENT_HISTORY_LIST_REQUEST,
  c.GET_PURCHASEMENT_HISTORY_LIST_SUCCESS,
  c.GET_PURCHASEMENT_HISTORY_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IPurchasementHistoryRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getReceptionHistoryLists = createAsyncAction(
  c.GET_RECEPTION_HISTORY_LIST_REQUEST,
  c.GET_RECEPTION_HISTORY_LIST_SUCCESS,
  c.GET_RECEPTION_HISTORY_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IReceptionHistoryRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const editReceptionHistory = createAsyncAction(
  c.UPDATE_RECEPTION_HISTORY_REQUEST,
  c.UPDATE_RECEPTION_HISTORY_SUCCESS,
  c.UPDATE_RECEPTION_HISTORY_FAILURE,
)<
  IEffectPayload<IRawReceptionHistoryFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteRawMaterial = createAsyncAction(
  c.DELETE_RAW_MATERIAL_REQUEST,
  c.DELETE_RAW_MATERIAL_SUCCESS,
  c.DELETE_RAW_MATERIAL_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getNormaSubactivity = createAsyncAction(
  c.GET_NORMA_SUBACTIVITY_REQUEST,
  c.GET_NORMA_SUBACTIVITY_SUCCESS,
  c.GET_NORMA_SUBACTIVITY_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<INormSubActivity[], false>, IEffectPayload<null, false, IError>>()

export const clearNormSubActivity = createAction(c.CLEAR_NORMA_SUBACTIVITY, clearAction)()
export const clearFormRawMaterialtatus = createAction(c.CREATE_EDIT_RAW_MATERIAL_CLEAR_STATUS, clearAction)()
export const clearFormPurchasementHistoryStatus = createAction(
  c.CREATE_EDIT_PURCHASEMENT_HISTORY_CLEAR_STATUS,
  clearAction,
)()
export const clearFormReceptionHistoryStatus = createAction(c.EDIT_RECEPTION_HISTORY_CLEAR_STATUS, clearAction)()
export const clearDeleteRawMaterialStatus = createAction(c.DELETE_RAW_MATERIAL_CLEAR, clearAction)()
