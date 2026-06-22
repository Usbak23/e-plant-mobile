import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from './constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import clearAction from '@domain/states/utils/clearAction'

export const getMonitoringTphList = createAsyncAction(
  c.GET_MONITORING_TPH_LIST_REQUEST,
  c.GET_MONITORING_TPH_LIST_SUCCESS,
  c.GET_MONITORING_TPH_LIST_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const getMonitoringTphSummary = createAsyncAction(
  c.GET_MONITORING_TPH_SUMMARY_REQUEST,
  c.GET_MONITORING_TPH_SUMMARY_SUCCESS,
  c.GET_MONITORING_TPH_SUMMARY_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const clearMonitoringTph = createAction(c.CLEAR_MONITORING_TPH, clearAction)()

export const setMonitoringTphLastUpdated = createAction(
  c.SET_MONITORING_TPH_LAST_UPDATED,
)<string>()
