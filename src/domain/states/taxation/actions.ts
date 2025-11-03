import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/taxation/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '../utils/clearAction'
import {
  ITaxationFormData,
  ITaxationHaRealization,
  ITaxationHaRealizationParam,
  ITaxationRow,
} from '@app/models/eplant/Taxation'
import IStdEntity from '@app/models/commons/IStdEntity'

export const createTaxation = createAsyncAction(
  c.CREATE_TAXATION_REQUEST,
  c.CREATE_TAXATION_SUCCESS,
  c.CREATE_TAXATION_FAILURE,
)<IEffectPayload<ITaxationFormData, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getHaRealizationTaxation = createAsyncAction(
  c.GET_HA_REALIZATION_TAXATION_REQUEST,
  c.GET_HA_REALIZATION_TAXATION_SUCCESS,
  c.GET_HA_REALIZATION_TAXATION_FAILURE,
)<
  IEffectPayload<ITaxationHaRealizationParam, true>,
  IEffectPayload<ITaxationHaRealization, false>,
  IEffectPayload<null, false, IError>
>()

export const getHaRealizationTaxationDetail = createAsyncAction(
  c.GET_HA_REALIZATION_TAXATION_DETAIL_REQUEST,
  c.GET_HA_REALIZATION_TAXATION_DETAIL_SUCCESS,
  c.GET_HA_REALIZATION_TAXATION_DETAIL_FAILURE,
)<
  IEffectPayload<ITaxationHaRealizationParam, true>,
  IEffectPayload<ITaxationHaRealization, false>,
  IEffectPayload<null, false, IError>
>()

export const getTaxationPaginated = createAsyncAction(
  c.GET_TAXATION_PAGINATED_REQUEST,
  c.GET_TAXATION_PAGINATED_SUCCESS,
  c.GET_TAXATION_PAGINATED_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<ITaxationRow>, false>, IEffectPayload<null, false, IError>>()

export const editTaxation = createAsyncAction(
  c.EDIT_TAXATION_REQUEST,
  c.EDIT_TAXATION_SUCCESS,
  c.EDIT_TAXATION_FAILURE,
)<IEffectPayload<ITaxationFormData, true>, IEffectPayload<IStdEntity, false>, IEffectPayload<null, false, IError>>()

export const deleteTaxation = createAsyncAction(
  c.DELETE_TAXATION_REQUEST,
  c.DELETE_TAXATION_SUCCESS,
  c.DELETE_TAXATION_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const clearFormTaxationStatus = createAction(c.CREATE_OR_EDIT_TAXATION_CLEAR, clearAction)()
export const clearDeleteTaxationStatus = createAction(c.DELETE_TAXATION_CLEAR, clearAction)()
