import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import {IDailyActivity, IDailyActivityForm} from '@app/models/eplant/IDailyActivity'
import {createAction, createAsyncAction} from 'typesafe-actions'
import {IEffectPayload, IError} from '../types'
import clearAction from '../utils/clearAction'
import * as c from './constants'

export const createDailyActivity = createAsyncAction(
  c.CREATE_DAILY_ACTIVITY_REQUEST,
  c.CREATE_DAILY_ACTIVITY_SUCCESS,
  c.CREATE_DAILY_ACTIVITY_FAILURE,
)<IEffectPayload<IDailyActivityForm, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getDailyActivityList = createAsyncAction(
  c.GET_DAILY_ACTIVITY_LIST_REQUEST,
  c.GET_DAILY_ACTIVITY_LIST_SUCCESS,
  c.GET_DAILY_ACTIVITY_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IDailyActivity>, false>,
  IEffectPayload<null, false, IError>
>()

export const editDailyActivity = createAsyncAction(
  c.EDIT_DAILY_ACTIVITY_REQUEST,
  c.EDIT_DAILY_ACTIVITY_SUCCESS,
  c.EDIT_DAILY_ACTIVITY_FAILURE,
)<IEffectPayload<IDailyActivityForm, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const deleteDailyActivity = createAsyncAction(
  c.DELETE_DAILY_ACTIVITY_REQUEST,
  c.DELETE_DAILY_ACTIVITY_SUCCESS,
  c.DELETE_DAILY_ACTIVITY_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const clearFormDailyActivity = createAction(c.CREATE_OR_EDIT_DAILY_ACTIVITY_CLEAR, clearAction)()
export const clearDeleteDailyActivityStatus = createAction(c.DELETE_DAILY_ACTIVITY_CLEAR, clearAction)()
