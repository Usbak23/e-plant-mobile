import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/subactivity/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import {ISubActivity} from '@app/models/eplant/SubActivity'

export interface IRSSubActivity {
  subActivityAll?: IEffectPayload<ISubActivity[]>
}

const DEFAULT_STATE = {}

const subActivityReducer = createReducer<IRSSubActivity, ActionsType>(DEFAULT_STATE)
  .handleAction([actions.getSubActivityAll.request, actions.getSubActivityAll.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      subActivityAll: {
        data: state.subActivityAll?.data,
        ...payload,
      },
    }
  })
  .handleAction([actions.getSubActivityAll.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      subActivityAll: payload,
    }
  })

export default subActivityReducer
