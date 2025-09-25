import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import {IFieldReport, IFieldReportDetail} from '@app/models/eplant/FieldReport'
import {createAction, createAsyncAction} from 'typesafe-actions'
import {IEffectPayload, IError} from '../types'
import clearAction from '../utils/clearAction'
import * as c from './constants'

export const createFieldReport = createAsyncAction(
  c.CREATE_FIELD_REPORT_REQUEST,
  c.CREATE_FIELD_REPORT_SUCCESS,
  c.CREATE_FIELD_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getFieldReportList = createAsyncAction(
  c.GET_FIELD_REPORT_LIST_REQUEST,
  c.GET_FIELD_REPORT_LIST_SUCCESS,
  c.GET_FIELD_REPORT_LIST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<IFieldReport>, false>, IEffectPayload<null, false, IError>>()

export const editFieldReport = createAsyncAction(
  c.EDIT_FIELD_REPORT_REQUEST,
  c.EDIT_FIELD_REPORT_SUCCESS,
  c.EDIT_FIELD_REPORT_FAILURE,
)<IEffectPayload<IFieldReport, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const deleteFieldReport = createAsyncAction(
  c.DELETE_FIELD_REPORT_REQUEST,
  c.DELETE_FIELD_REPORT_SUCCESS,
  c.DELETE_FIELD_REPORT_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const detailFieldReport = createAsyncAction(
  c.DETAIL_FIELD_REPORT_REQUEST,
  c.DETAIL_FIELD_REPORT_SUCCESS,
  c.DETAIL_FIELD_REPORT_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IFieldReportDetail, false>, IEffectPayload<null, false, IError>>()

export const deleteFileFieldReport = createAsyncAction(
  c.DELETE_FILE_FIELD_REPORT_REQUEST,
  c.DELETE_FILE_FIELD_REPORT_SUCCESS,
  c.DELETE_FILE_FIELD_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const clearFormFieldReport = createAction(c.CREATE_OR_EDIT_FIELD_REPORT_CLEAR, clearAction)()
export const clearDeleteFieldReportStatus = createAction(c.DELETE_FIELD_REPORT_CLEAR, clearAction)()
export const clearDeleteFileFieldReportStatus = createAction(c.DELETE_FILE_FIELD_REPORT_CLEAR, clearAction)()
