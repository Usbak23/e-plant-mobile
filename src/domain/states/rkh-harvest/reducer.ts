import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/rkh-harvest/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import {IRKHHarvestDetail, IRKHHarvestAllRow} from '@app/models/eplant/RKHHarvest'

export interface IRSRKHHarvest {
  rkhHarvestDetail?: IEffectPayload<IRKHHarvestDetail>
  rkhHarvestAll?: IEffectPayload<IRKHHarvestAllRow>
}

const DEFAULT_STATE = {}

const RKHHarvestReducer = createReducer<IRSRKHHarvest, ActionsType>(DEFAULT_STATE)
  .handleAction([actions.getRKHHarvestAll.success], (state: IRSRKHHarvest, action: any) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      rkhHarvestAll: payload,
    }
  })
  .handleAction(
    [actions.getRKHHarvestAll.request, actions.getRKHHarvestAll.failure],
    (state: IRSRKHHarvest, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rkhHarvestAll: {
          ...payload,
          data: state.rkhHarvestAll?.data,
        },
      }
    },
  )

export default RKHHarvestReducer
