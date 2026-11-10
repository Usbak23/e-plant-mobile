import {createReducer} from 'typesafe-actions'
import * as actions from './actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'

export interface IRSMonitoringTph {
  list?: IEffectPayload
  summary?: IEffectPayload
  lastUpdated?: string
  cache?: {
    [key: string]: { // key format: "divisionId_month_year"
      list: any
      summary: any
      timestamp: string
    }
  }
}

const DEFAULT_STATE: IRSMonitoringTph = {}

const monitoringTphReducer = createReducer<IRSMonitoringTph, ActionsType>(DEFAULT_STATE)
  .handleAction(actions.getMonitoringTphList.request, (state, action: any) => {
    const params = action?.payload?.data
    const cacheKey = params ? `${params.divisionId}_${params.month}_${params.year}` : null
    
    return {
      ...state,
      list: {...(action as IEffectAction).payload, data: state.list?.data}, // Keep existing data
    }
  })
  .handleAction(actions.getMonitoringTphList.success, (state, action: any) => {
    const payload = (action as IEffectAction).payload
    const params = action?.payload?.params
    const cacheKey = params ? `${params.divisionId}_${params.month}_${params.year}` : null
    
    const newCache = {...(state.cache || {})}
    if (cacheKey) {
      const docs = payload.data?.docs || []
      
      console.log(`📦 Caching ${docs.length} monitoring TPH items for key: ${cacheKey}`)
      
      newCache[cacheKey] = {
        list: payload.data,
        summary: state.cache?.[cacheKey]?.summary || null,
        timestamp: new Date().toISOString(),
      }
    }
    
    return {
      ...state,
      list: payload,
      cache: newCache,
    }
  })
  .handleAction(actions.getMonitoringTphList.failure, (state, action: any) => ({
    ...state,
    list: {...(action as IEffectAction).payload, data: state.list?.data}, // Keep existing data saat error
  }))
  .handleAction(
    [actions.getMonitoringTphSummary.request],
    (state, action: any) => ({...state, summary: (action as IEffectAction).payload}),
  )
  .handleAction(actions.getMonitoringTphSummary.success, (state, action: any) => {
    const payload = (action as IEffectAction).payload
    const params = action?.payload?.params
    const cacheKey = params ? `${params.divisionId}_${params.month}_${params.year}` : null
    
    const newCache = {...(state.cache || {})}
    if (cacheKey) {
      newCache[cacheKey] = {
        list: state.cache?.[cacheKey]?.list || null,
        summary: payload.data,
        timestamp: new Date().toISOString(),
      }
    }
    
    return {
      ...state,
      summary: payload,
      cache: newCache,
    }
  })
  .handleAction(
    [actions.getMonitoringTphSummary.failure],
    (state, action: any) => ({...state, summary: (action as IEffectAction).payload}),
  )
  .handleType(actions.clearMonitoringTph, () => DEFAULT_STATE)
  .handleType(actions.setMonitoringTphLastUpdated, (state, action: any) => ({
    ...state,
    lastUpdated: action.payload,
  }))

export default monitoringTphReducer
