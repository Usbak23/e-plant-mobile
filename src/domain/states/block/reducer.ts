import {createReducer} from 'typesafe-actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import * as actions from '@app/domain/states/block/actions'
import {IBlockRow} from '@app/models/eplant/Block'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IUserStd} from '@app/models/eplant/User'

export interface IRSBlock {
  formCreateBlockStatus?: IEffectPayload
  blockList?: IEffectPayload<IPagingDocs<IBlockRow>>
  deleteBlockStatus?: IEffectPayload
  blockDetail?: IEffectPayload<IBlockRow>
  blockAll?: IEffectPayload<IBlockRow[]>
  foremanList?: IEffectPayload<IUserStd[]>
}

const DEFAULT_STATE = {}

const blockReducer = createReducer<IRSBlock, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createBlock.request,
      actions.createBlock.success,
      actions.createBlock.failure,
      actions.editBlock.request,
      actions.editBlock.success,
      actions.editBlock.failure,
      actions.clearFormBlockStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formCreateBlockStatus: payload,
      }
    },
  )
  .handleAction([actions.getBlocksList.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IBlockRow[] = state?.blockList?.data?.docs || []
      return {
        ...state,
        blockList: {
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
      blockList: payload,
    }
  })
  .handleAction([actions.getBlocksList.request, actions.getBlocksList.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      blockList: {
        ...payload,
        data: state.blockList?.data,
      },
    }
  })

  .handleAction(
    [
      actions.deleteBlock.request,
      actions.deleteBlock.success,
      actions.deleteBlock.failure,
      actions.clearDeleteBlockStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteBlockStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.detailBlock.request, actions.detailBlock.failure, actions.detailBlock.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        blockDetail: payload,
      }
    },
  )
  .handleAction([actions.getAllBlock.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      blockAll: payload,
    }
  })
  .handleAction([actions.getAllBlock.request, actions.getAllBlock.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      blockAll: {
        ...payload,
        data: state.blockAll?.data,
      },
    }
  })
  .handleAction([actions.getAllForemanX.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      foremanList: payload,
    }
  })
  .handleAction([actions.getAllForemanX.request, actions.getAllForemanX.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      foremanList: {
        ...payload,
        data: state?.foremanList?.data,
      },
    }
  })

export default blockReducer
