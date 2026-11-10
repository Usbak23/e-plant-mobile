import {createReducer} from 'typesafe-actions'
import * as actions from './actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'

export type ISpbLocalTemp = any & {tempId: string; syncStatus: string}

export interface IRSSpbLocal {
  list?: IEffectPayload
  detail?: IEffectPayload
  formStatus?: IEffectPayload
  deleteStatus?: IEffectPayload
  spbLocalListTemp?: ISpbLocalTemp[]
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
  .handleType(actions.addSpbLocalTemp, (state, action: any) => ({
    ...state,
    spbLocalListTemp: [{...action.payload, syncStatus: 'pending'}, ...(state.spbLocalListTemp || [])],
  }))
  .handleType(actions.editSpbLocalTemp, (state, action: any) => ({
    ...state,
    spbLocalListTemp: state.spbLocalListTemp?.map(e => e.tempId === action.payload.tempId ? {...e, ...action.payload} : e),
  }))
  .handleType(actions.deleteSpbLocalTemp, (state, action: any) => ({
    ...state,
    spbLocalListTemp: state.spbLocalListTemp?.filter(e => e.tempId !== action.payload.tempId),
  }))
  .handleType(actions.updateSpbLocalTempStatus, (state, action: any) => {
    const {tempId, syncStatus, syncError} = action.payload
    return {
      ...state,
      spbLocalListTemp: state.spbLocalListTemp?.map(e =>
        e.tempId === tempId ? {...e, syncStatus, syncError: syncError || undefined} : e,
      ),
    }
  })

export default spbLocalReducer
