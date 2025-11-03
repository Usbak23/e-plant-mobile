import {IEffectAction, IEffectPayload} from '../types'
import {createReducer} from 'typesafe-actions'
import {ActionsType} from '../store'
import * as actions from './actions'

import {
  IRealizationFertilizationPagingDocs,
  IRealizationFertilizationRow,
} from '@app/models/eplant/RealizationFertilization'

export interface IRSRealizationFertilization {
  formCreateUpdateRealizationFertilization?: IEffectPayload
  formDeleteRealizationFertilization?: IEffectPayload
  realizationFertilzationList?: IEffectPayload<IRealizationFertilizationPagingDocs>
}

const DEFAULT_STATE = {}

const realizationFertilizationReducer = createReducer<IRSRealizationFertilization, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createRealizationFertilization.request,
      actions.createRealizationFertilization.success,
      actions.createRealizationFertilization.failure,
      actions.updateRealizationFertilization.request,
      actions.updateRealizationFertilization.success,
      actions.updateRealizationFertilization.failure,
      actions.clearFormCreateRealizationFertilization,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formCreateUpdateRealizationFertilization: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteRealizationFertilization.request,
      actions.deleteRealizationFertilization.failure,
      actions.deleteRealizationFertilization.success,
      actions.clearFormDeleteRealizationFertilization,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formDeleteRealizationFertilization: payload,
      }
    },
  )
  .handleAction([actions.getRealizationFertilizationList.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IRealizationFertilizationRow[] = state?.realizationFertilzationList?.data?.docs || []
      return {
        ...state,
        realizationFertilzationList: {
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
      realizationFertilzationList: payload,
    }
  })
  .handleAction(
    [actions.getRealizationFertilizationList.request, actions.getRealizationFertilizationList.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        realizationFertilzationList: {
          ...payload,
          data: state.realizationFertilzationList?.data,
        },
      }
    },
  )
export default realizationFertilizationReducer
