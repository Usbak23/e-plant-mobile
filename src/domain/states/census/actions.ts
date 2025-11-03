import * as c from './constants'
import {createAsyncAction, createAction} from 'typesafe-actions'
import {IEffectPayload, IError} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '../utils/clearAction'
import {ICensusDetail, ICensusEditFormData, ICensusFormData, ICensusRow} from '@app/models/eplant/Census'

export const getCensusLists = createAsyncAction(
  c.GET_CENSUS_LIST_REQUEST,
  c.GET_CENSUS_LIST_SUCCESS,
  c.GET_CENSUS_LIST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<ICensusRow>, false>, IEffectPayload<null, false, IError>>()

export const createCensus = createAsyncAction(
  c.CREATE_CENSUS_REQUEST,
  c.CREATE_CENSUS_SUCCESS,
  c.CREATE_CENSUS_FAILURE,
)<IEffectPayload<ICensusFormData, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const editCensus = createAsyncAction(c.EDIT_CENSUS_REQUEST, c.EDIT_CENSUS_SUCCESS, c.EDIT_CENSUS_FAILURE)<
  IEffectPayload<ICensusEditFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteCensus = createAsyncAction(
  c.DELETE_CENSUS_REQUEST,
  c.DELETE_CENSUS_SUCCESS,
  c.DELETE_CENSUS_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getCensusDetail = createAsyncAction(
  c.GET_CENSUS_DETAIL_REQUEST,
  c.GET_CENSUS_DETAIL_SUCCESS,
  c.GET_CENSUS_DETAIL_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<ICensusDetail, false>, IEffectPayload<null, false, IError>>()

export const clearFormCensusStatus = createAction(c.CREATE_OR_EDIT_CENSUS_CLEAR, clearAction)()
export const clearFormDeleteStatus = createAction(c.DELETE_CENSUS_CLEAR, clearAction)()
