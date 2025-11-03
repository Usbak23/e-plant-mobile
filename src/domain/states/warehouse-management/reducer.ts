import {IEffectAction, IEffectPayload} from '../types'
import {createReducer} from 'typesafe-actions'
import {ActionsType} from '../store'
import * as actions from './actions'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IManagementWarehouse, IManagementWarehouseDetail} from '@app/models/eplant/WarehouseManagement'

export interface IRSWarehouseManagement {
  formWarehouseManagementApproveStatus?: IEffectPayload
  formPostBPU?: IEffectPayload
  warehouseList?: IEffectPayload<IPagingDocs<IManagementWarehouse>>
  warehouseDetail?: IEffectPayload<IManagementWarehouseDetail>
}

const DEFAULT_STATE = {}

const warehouseReducer = createReducer<IRSWarehouseManagement, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.approveWarehouse.request,
      actions.approveWarehouse.success,
      actions.approveWarehouse.failure,
      actions.clearFormApproveWarehouse,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formWarehouseManagementApproveStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.postBPUWarehouse.request,
      actions.postBPUWarehouse.success,
      actions.postBPUWarehouse.failure,
      actions.clearFormPostBPU,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        formPostBPU: payload,
      }
    },
  )
  .handleAction([actions.getWarehouseList.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IManagementWarehouse[] = state?.warehouseList?.data?.docs || []

      return {
        ...state,
        warehouseList: {
          ...payload,
          data: {
            ...payload.data,
            docs: [...prevDocs, ...payload.data.docs],
          },
        },
      }
    }
    return {
      ...state,
      warehouseList: payload,
    }
  })
  .handleAction([actions.getWarehouseList.request, actions.getWarehouseList.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      warehouseList: {
        ...payload,
        data: state.warehouseList?.data,
      },
    }
  })
  .handleAction(
    [actions.getWarehouseDetail.request, actions.getWarehouseDetail.success, actions.getWarehouseDetail.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        warehouseDetail: payload,
      }
    },
  )

export default warehouseReducer
