import {createReducer} from 'typesafe-actions'
import * as actions from './actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'

export interface IRSMonitoringTph {
  list?: IEffectPayload
  summary?: IEffectPayload
  lastUpdated?: string  // ISO string timestamp
}

const DEFAULT_STATE: IRSMonitoringTph = {}

const monitoringTphReducer = createReducer<IRSMonitoringTph, ActionsType>(DEFAULT_STATE)
  .handleAction(actions.getMonitoringTphList.request, (state, action: any) => ({
    ...state,
    list: {...(action as IEffectAction).payload, data: state.list?.data},
  }))
  .handleAction(actions.getMonitoringTphList.success, (state, action: any) => {
    const payload = (action as IEffectAction).payload
    const incoming = payload.data?.docs || []
    const existing = state.list?.data?.docs || []
    // Merge: keep existing docs not in incoming (different division/date), add all incoming
    const incomingIds = new Set(incoming.map((d: any) => d.id))
    const merged = [...existing.filter((d: any) => !incomingIds.has(d.id)), ...incoming]
    return {
      ...state,
      list: {...payload, data: {...payload.data, docs: merged}},
    }
  })
  .handleAction(actions.getMonitoringTphList.failure, (state, action: any) => ({
    ...state,
    list: {...(action as IEffectAction).payload, data: state.list?.data},
  }))
  .handleAction(
    [actions.getMonitoringTphSummary.request, actions.getMonitoringTphSummary.success, actions.getMonitoringTphSummary.failure],
    (state, action: any) => ({...state, summary: (action as IEffectAction).payload}),
  )
  .handleType(actions.clearMonitoringTph, () => DEFAULT_STATE)
  .handleType(actions.setMonitoringTphLastUpdated, (state, action: any) => ({
    ...state,
    lastUpdated: action.payload,
  }))

export default monitoringTphReducer
