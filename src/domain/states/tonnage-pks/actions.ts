import { createAsyncAction, createAction } from 'typesafe-actions'
import * as c from '@app/domain/states/tonnage-pks/constants'
import { IEffectPayload, IError } from '@app/domain/states/types'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '../utils/clearAction'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import { ISPBListRow, ITonnagePKSDetail, ITonnagePKSFormData, ITonnagePKSRow } from '@app/models/eplant/TonnagePKS'

export const createTonnagePKS = createAsyncAction(
  c.CREATE_TONNAGE_PKS_REQUEST,
  c.CREATE_TONNAGE_PKS_SUCCESS,
  c.CREATE_TONNAGE_PKS_FAILURE,
)<IEffectPayload<ITonnagePKSFormData, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const updateTonnagePKS = createAsyncAction(
  c.EDIT_TONNAGE_PKS_REQUEST,
  c.EDIT_TONNAGE_PKS_SUCCESS,
  c.EDIT_TONNAGE_PKS_FAILURE,
)<IEffectPayload<ITonnagePKSFormData, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const deleteTonnagePKS = createAsyncAction(
  c.DELETE_TONNAGE_PKS_REQUEST,
  c.DELETE_TONNAGE_PKS_SUCCESS,
  c.DELETE_TONNAGE_PKS_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const getTonnagePKSPaginated = createAsyncAction(
  c.GET_TONNAGE_PKS_LIST_REQUEST,
  c.GET_TONNAGE_PKS_LIST_SUCCESS,
  c.GET_TONNAGE_PKS_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<ITonnagePKSRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getTonnagePKSDetail = createAsyncAction(
  c.DETAIL_TONNAGE_PKS_REQUEST,
  c.DETAIL_TONNAGE_PKS_SUCCESS,
  c.DETAIL_TONNAGE_PKS_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<ITonnagePKSDetail, false>, IEffectPayload<null, false, IError>>()


export const getSPBAll = createAsyncAction(c.GET_SPB_LIST_REQUEST, c.GET_SPB_LIST_SUCCESS, c.GET_SPB_LIST_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<ISPBListRow, false>,
  IEffectPayload<null, false, IError>
>()

export const clearFormTonnagePKSStatus = createAction(c.CREATE_OR_EDIT_TONNAGE_PKS_CLEAR, clearAction)()
export const clearDeleteTonnagePKSStatus = createAction(c.DELETE_TONNAGE_PKS_CLEAR, clearAction)()
