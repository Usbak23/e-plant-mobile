import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import {
  IManagamentWarehouseBPUForm,
  IManagementWarehouse,
  IManagementWarehouseApproveForm,
  IManagementWarehouseDetail,
} from '@app/models/eplant/WarehouseManagement'
import {createAction, createAsyncAction} from 'typesafe-actions'
import {IEffectPayload, IError} from '../types'
import clearAction from '../utils/clearAction'
import * as c from './constants'

export const getWarehouseList = createAsyncAction(
  c.GET_WAREHOUSE_LIST_REQUEST,
  c.GET_WAREHOUSE_LIST_SUCCESS,
  c.GET_WAREHOUSE_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IManagementWarehouse>, false>,
  IEffectPayload<null, false, IError>
>()

export const getWarehouseDetail = createAsyncAction(
  c.GET_WAREHOUSE_DETAIL_REQUEST,
  c.GET_WAREHOUSE_DETAIL_SUCCESS,
  c.GET_WAREHOUSE_DETAIL_FAILURE,
)<
  IEffectPayload<string, boolean>,
  IEffectPayload<IManagementWarehouseDetail, false>,
  IEffectPayload<null, false, IError>
>()

export const approveWarehouse = createAsyncAction(
  c.APPROVE_WAREHOUSE_REQUEST,
  c.APPROVE_WAREHOUSE_SUCCESS,
  c.APPROVE_WAREHOUSE_FAILURE,
)<
  IEffectPayload<IManagementWarehouseApproveForm, boolean>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const postBPUWarehouse = createAsyncAction(
  c.POST_BPU_WAREHOUSE_REQUEST,
  c.POST_BPU_WAREHOUSE_SUCCESS,
  c.POST_BPU_WAREHOUSE_FAILURE,
)<
  IEffectPayload<IManagamentWarehouseBPUForm, boolean>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const clearFormApproveWarehouse = createAction(c.CLEAR_FORM_APPROVE_WAREHOSUE, clearAction)()
export const clearFormPostBPU = createAction(c.CLEAR_FORM_POST_BPU_WAREHOSUE, clearAction)()
