import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import {IMaintenance, IMaintenanceForm} from '@app/models/eplant/Maintenance'
import {createAction, createAsyncAction} from 'typesafe-actions'
import {IEffectPayload, IError} from '../types'
import clearAction from '../utils/clearAction'
import * as c from './constants'

export const createMaintenance = createAsyncAction(
  c.CREATE_MAINTENANCE_REQUEST,
  c.CREATE_MAINTENANCE_SUCCESS,
  c.CREATE_MAINTENANCE_FAILURE,
)<IEffectPayload<IMaintenanceForm, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getMaintenanceList = createAsyncAction(
  c.GET_MAINTENANCE_LIST_REQUEST,
  c.GET_MAINTENANCE_LIST_SUCCESS,
  c.GET_MAINTENANCE_LIST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<IMaintenance>, false>, IEffectPayload<null, false, IError>>()

export const getMaintenanceDetail = createAsyncAction(
  c.GET_MAINTENANCE_DETAIL_REQUEST,
  c.GET_MAINTENANCE_DETAIL_SUCCESS,
  c.GET_MAINTENANCE_DETAIL_FAILURE,
)<IEffectPayload<string, boolean>, IEffectPayload<IMaintenance, false>, IEffectPayload<null, false, IError>>()

export const editMaintenance = createAsyncAction(
  c.EDIT_MAINTENANCE_REQUEST,
  c.EDIT_MAINTENANCE_SUCCESS,
  c.EDIT_MAINTENANCE_FAILURE,
)<IEffectPayload<IMaintenanceForm, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const deleteMaintenance = createAsyncAction(
  c.DELETE_MAINTENANCE_REQUEST,
  c.DELETE_MAINTENANCE_SUCCESS,
  c.DELETE_MAINTENANCE_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const clearFormMaintenance = createAction(c.CREATE_OR_EDIT_MAINTENANCE_CLEAR, clearAction)()
export const clearDeleteMaintenaceStatus = createAction(c.DELETE_MAINTENANCE_CLEAR, clearAction)()
