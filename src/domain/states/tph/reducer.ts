import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/tph/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {ITPHDetail, ITPHRow, ITPHRowAll} from '@app/models/eplant/TPH'

export interface IRSTPH {
  formTPHStatus?: IEffectPayload
  deleteTPHStatus?: IEffectPayload
  tphAll?: IEffectPayload<ITPHRowAll[]>
  tphList?: IEffectPayload<IPagingDocs<ITPHRow>>
  tphDetail?: IEffectPayload<ITPHDetail>
}

const DEFAULT_STATE = {}

const tphReducer = createReducer<IRSTPH, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createTPH.request,
      actions.createTPH.failure,
      actions.createTPH.success,
      actions.editTPH.request,
      actions.editTPH.failure,
      actions.editTPH.success,
      actions.clearFormTPHStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formTPHStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.deleteTPH.request, actions.deleteTPH.failure, actions.deleteTPH.success, actions.clearDeleteTPHStatus],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteTPHStatus: payload,
      }
    },
  )
  .handleAction([actions.getTPHLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: ITPHRow[] = state?.tphList?.data?.docs || []
      return {
        ...state,
        tphList: {
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
      tphList: payload,
    }
  })
  .handleAction([actions.getTPHLists.request, actions.getTPHLists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      tphList: {
        ...payload,
        data: state.tphList?.data,
      },
    }
  })
  .handleAction(
    [actions.getTPHDetail.request, actions.getTPHDetail.failure, actions.getTPHDetail.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        tphDetail: payload,
      }
    },
  )
  .handleAction([actions.getTPHAll.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      tphAll: payload,
    }
  })
  .handleAction([actions.getTPHAll.request, actions.getTPHAll.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      tphAll: {
        ...payload,
        data: state?.tphAll?.data,
      },
    }
  })

export default tphReducer
