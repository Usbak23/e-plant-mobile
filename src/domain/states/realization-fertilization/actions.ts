import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import {
  IRealizationFertilizationApproveForm,
  IRealizationFertilizationPagingDocs,
} from '@app/models/eplant/RealizationFertilization'
import {createAction, createAsyncAction} from 'typesafe-actions'
import {IEffectPayload, IError} from '../types'
import clearAction from '../utils/clearAction'
import * as c from './constants'

export const getRealizationFertilizationList = createAsyncAction(
  c.GET_REALIZATION_FERTILIZATION_LIST_REQUEST,
  c.GET_REALIZATION_FERTILIZATION_LIST_SUCCESS,
  c.GET_REALIZATION_FERTILIZATION_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IRealizationFertilizationPagingDocs, false>,
  IEffectPayload<null, false, IError>
>()

export const createRealizationFertilization = createAsyncAction(
  c.CREATE_REALIZATION_FERTILIZATION_REQUEST,
  c.CREATE_REALIZATION_FERTILIZATION_SUCCESS,
  c.CREATE_REALIZATION_FERTILIZATION_FAILURE,
)<
  IEffectPayload<IRealizationFertilizationApproveForm, boolean>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const updateRealizationFertilization = createAsyncAction(
  c.UPDATE_REALIZATION_FERTILIZATION_REQUEST,
  c.UPDATE_REALIZATION_FERTILIZATION_SUCCESS,
  c.UPDATE_REALIZATION_FERTILIZATION_FAILURE,
)<
  IEffectPayload<IRealizationFertilizationApproveForm, boolean>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteRealizationFertilization = createAsyncAction(
  c.DELETE_REALIZATION_FERTILIZATION_REQUEST,
  c.DELETE_REALIZATION_FERTILIZATION_SUCCESS,
  c.DELETE_REALIZATION_FERTILIZATION_FAILURE,
)<IEffectPayload<string, boolean>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

// export const clearFormUpdateRealizationFertilization = createAction(
//   c.CLEAR_REALIZATION_FERTILIZATION_UPDATE,
//   clearAction,
// )()

export const clearFormCreateRealizationFertilization = createAction(
  c.CLEAR_REALIZATION_FERTILIZATION_CREATE,
  clearAction,
)()
export const clearFormDeleteRealizationFertilization = createAction(
  c.CLEAR_REALIZATION_FERTILIZATION_DELETE,
  clearAction,
)()
