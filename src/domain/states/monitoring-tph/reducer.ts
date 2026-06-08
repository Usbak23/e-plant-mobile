import {createReducer} from 'typesafe-actions'
import * as actions from './actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'

export interface IRSMonitoringTph {
  list?: IEffectPayload
  summary?: IEffectPayload
}

const DEFAULT_STATE: IRSMonitoringTph = {}

const monitoringTphReducer = createReducer<IRSMonitoringTph, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [actions.getMonitoringTphList.request, actions.getMonitoringTphList.success, actions.getMonitoringTphList.failure],
    (state, action: any) => ({...state, list: (action as IEffectAction).payload}),
  )
  .handleAction(
    [actions.getMonitoringTphSummary.request, actions.getMonitoringTphSummary.success, actions.getMonitoringTphSummary.failure],
    (state, action: any) => ({...state, summary: (action as IEffectAction).payload}),
  )
  .handleType(actions.clearMonitoringTph, () => DEFAULT_STATE)

export default monitoringTphReducer
