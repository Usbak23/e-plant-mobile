import {IRoleRow} from '@app/models/eplant/Role'
import {createReducer} from 'typesafe-actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import * as actions from '@app/domain/states/role/actions'

export interface IRSRole {
  roleAll?: IEffectPayload<IRoleRow[]>
}

const DEFAULT_STATE = {}

const roleReducer = createReducer<IRSRole, ActionsType>(DEFAULT_STATE).handleAction(
  [actions.getAllRole.request, actions.getAllRole.success, actions.getAllRole.failure],
  (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      roleAll: {
        data: state.roleAll?.data,
        ...payload,
      },
    }
  },
)

export default roleReducer
