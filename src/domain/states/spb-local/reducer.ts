import {createReducer} from 'typesafe-actions'
import * as actions from './actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'

export interface IRSSpbLocal {
  list?: IEffectPayload
  detail?: IEffectPayload
  formStatus?: IEffectPayload
  deleteStatus?: IEffectPayload
}

const DEFAULT_STATE: IRSSpbLocal = {}

const spbLocalReducer = createReducer<IRSSpbLocal, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [actions.getSpbLocalList.request, actions.getSpbLocalList.success, actions.getSpbLocalList.failure],
    (state, action: any) => ({...state, list: (action as IEffectAction).payload}),
  )
  .handleAction(
    [actions.getSpbLocalDetail.request, actions.getSpbLocalDetail.success, actions.getSpbLocalDetail.failure],
    (state, action: any) => ({...state, detail: (action as IEffectAction).payload}),
  )
  .handleAction(
    [
      actions.createSpbLocal.request, actions.createSpbLocal.success, actions.createSpbLocal.failure,
      actions.updateSpbLocal.request, actions.updateSpbLocal.success, actions.updateSpbLocal.failure,
      actions.clearSpbLocalForm,
    ],
    (state, action: any) => ({...state, formStatus: (action as IEffectAction).payload}),
  )
  .handleAction(
    [actions.deleteSpbLocal.request, actions.deleteSpbLocal.success, actions.deleteSpbLocal.failure, actions.clearSpbLocalDelete],
    (state, action: any) => ({...state, deleteStatus: (action as IEffectAction).payload}),
  )
  .handleType(actions.clearSpbLocal, () => DEFAULT_STATE)

export default spbLocalReducer
