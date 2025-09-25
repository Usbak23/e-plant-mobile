import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/division/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {Division, IDivisionFormData} from '@app/models/eplant/Division'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '../utils/clearAction'

export const getDivisionLists = createAsyncAction(
  c.GET_DIVISION_LIST_REQUEST,
  c.GET_DIVISION_LIST_SUCCESS,
  c.GET_DIVISION_LIST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<Division>, false>, IEffectPayload<null, false, IError>>()

export const createDivision = createAsyncAction(
  c.CREATE_DIVISION_REQUEST,
  c.CREATE_DIVISION_SUCCESS,
  c.CREATE_DIVISION_FAILURE,
)<IEffectPayload<IDivisionFormData, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const editDivision = createAsyncAction(
  c.EDIT_DIVISION_REQUEST,
  c.EDIT_DIVISION_SUCCESS,
  c.EDIT_DIVISION_FAILURE,
)<IEffectPayload<IDivisionFormData, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const deleteDivision = createAsyncAction(
  c.DELETE_DIVISION_REQUEST,
  c.DELETE_DIVISION_SUCCESS,
  c.DELETE_DIVISION_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const detailDivision = createAsyncAction(
  c.DETAIL_DIVISION_REQUEST,
  c.DETAIL_DIVISION_SUCCESS,
  c.DETAIL_DIVISION_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<Division, false>, IEffectPayload<null, false, IError>>()

export const getAllDivision = createAsyncAction(
  c.GET_ALL_DIVISION_REQUEST,
  c.GET_ALL_DIVISION_SUCCESS,
  c.GET_ALL_DIVISION_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<Division[], false>, IEffectPayload<null, false, IError>>()

export const clearFormDivisionStatus = createAction(c.CREATE_OR_EDIT_DIVISION_CLEAR, clearAction)()
export const clearDeleteDivisionStatus = createAction(c.DELETE_DIVISION_CLEAR, clearAction)()
