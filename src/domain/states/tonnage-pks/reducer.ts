import IPagingDocs from '@app/models/commons/IPagingDocs'
import { ISPBListRow, ITonnagePKSDetail, ITonnagePKSRow } from '@app/models/eplant/TonnagePKS'
import { createReducer } from 'typesafe-actions'
import { IEffectAction, IEffectPayload } from '../types'
import * as actions from '@app/domain/states/tonnage-pks/actions'
import { ActionsType } from '@app/domain/states/store'

export interface IRSTonnagePKS {
  formTonnagePKSStatus?: IEffectPayload
  deleteTonnagePKSStatus?: IEffectPayload
  tonnagePKSList?: IEffectPayload<IPagingDocs<ITonnagePKSRow>>
  tonnagePKSDetail?: IEffectPayload<ITonnagePKSDetail>
  spbs?: IEffectPayload<ISPBListRow[]>
}

const DEFAULT_STATE = {}

const tonnagePKSReducer = createReducer<IRSTonnagePKS, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createTonnagePKS.request,
      actions.createTonnagePKS.failure,
      actions.createTonnagePKS.success,
      actions.updateTonnagePKS.success,
      actions.updateTonnagePKS.failure,
      actions.updateTonnagePKS.request,
      actions.clearFormTonnagePKSStatus,
    ],
    (state: IRSTonnagePKS, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formTonnagePKSStatus: payload,
      }
    },
  )

  .handleAction([actions.getTonnagePKSPaginated.success], (state: IRSTonnagePKS, action: any) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: ITonnagePKSRow[] = state?.tonnagePKSList?.data?.docs || []
      return {
        ...state,
        tonnagePKSList: {
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
      tonnagePKSList: payload,
    }
  })
  .handleAction([actions.getTonnagePKSPaginated.request, actions.getTonnagePKSPaginated.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      tonnagePKSList: {
        ...payload,
        data: state.tonnagePKSList?.data,
      },
    }
  })
  .handleAction(
    [actions.getTonnagePKSDetail.request, actions.getTonnagePKSDetail.failure, actions.getTonnagePKSDetail.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        tonnagePKSDetail: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteTonnagePKS.request,
      actions.deleteTonnagePKS.failure,
      actions.deleteTonnagePKS.success,
      actions.clearDeleteTonnagePKSStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteTonnagePKSStatuss: payload,
      }
    },
  )
  .handleAction(
    [
      actions.getSPBAll.request,
      actions.getSPBAll.failure
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        spbs: {
          ...payload,
          data: state?.spbs?.data
        },
      }
    }
  )
  .handleAction(
    [

      actions.getSPBAll.success,

    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        spbs: payload,
      }
    }
  )

export default tonnagePKSReducer
