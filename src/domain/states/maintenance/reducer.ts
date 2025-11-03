import {IEffectAction, IEffectPayload} from '../types'
import {createReducer} from 'typesafe-actions'
import {ActionsType} from '../store'
import * as actions from './actions'

import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IMaintenance} from '@app/models/eplant/Maintenance'

export interface IRSMaintenance {
  formMaintenanceStatus?: IEffectPayload
  maintenanceList?: IEffectPayload<IPagingDocs<IMaintenance>>
  deleteMaintenanceStatus?: IEffectPayload
  maintenanceDetail?: IEffectPayload<IMaintenance>
}

const DEFAULT_STATE = {}

const maintenanceReducer = createReducer<IRSMaintenance, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createMaintenance.request,
      actions.createMaintenance.failure,
      actions.createMaintenance.success,
      actions.editMaintenance.request,
      actions.editMaintenance.failure,
      actions.editMaintenance.success,
      actions.clearFormMaintenance,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formMaintenanceStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getMaintenanceDetail.request, actions.getMaintenanceDetail.failure, actions.getMaintenanceDetail.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        maintenanceDetail: payload,
      }
    },
  )
  .handleAction([actions.getMaintenanceList.success], (state, action) => {
    const payload = (action as IEffectAction).payload

    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IMaintenance[] = state?.maintenanceList?.data?.docs || []
      return {
        ...state,
        maintenanceList: {
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
      maintenanceList: payload,
    }
  })
  .handleAction([actions.getMaintenanceList.request, actions.getMaintenanceList.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      maintenanceList: {
        ...payload,
        data: state.maintenanceList?.data,
      },
    }
  })
  .handleAction(
    [
      actions.deleteMaintenance.request,
      actions.deleteMaintenance.success,
      actions.deleteMaintenance.failure,
      actions.clearDeleteMaintenaceStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteMaintenanceStatus: payload,
      }
    },
  )

export default maintenanceReducer
