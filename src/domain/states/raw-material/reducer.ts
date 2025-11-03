import IPagingDocs from '@app/models/commons/IPagingDocs'
import {
  INormMaterial,
  IPurchasementHistoryRow,
  IRawMaterialDetail,
  IRawMaterialRow,
  IReceptionHistoryRow,
} from '@app/models/eplant/RawMaterial'
import {createReducer} from 'typesafe-actions'
import {ActionsType} from '../store'
import * as actions from './actions'
import {IEffectAction, IEffectPayload} from '../types'
import {INormSubActivity} from '@app/models/eplant/NormSubactivity'

export interface IRSRawMaterial {
  formRawMaterialStatus?: IEffectPayload
  formPurchasementHistoryStatus?: IEffectPayload
  formReceptionHistoryStatus?: IEffectPayload
  rawMaterialList?: IEffectPayload<IPagingDocs<IRawMaterialRow>>
  rawMaterialAll?: IEffectPayload<IRawMaterialRow[]>
  purchasementHistoryList?: IEffectPayload<IPagingDocs<IPurchasementHistoryRow>>
  receptionHistoryList?: IEffectPayload<IPagingDocs<IReceptionHistoryRow>>
  rawMaterialDetail?: IEffectPayload<IRawMaterialDetail>
  deleteRawMaterialStatus?: IEffectPayload
  normaSubactivities?: IEffectPayload<INormSubActivity[]>
  normMaterial?: IEffectPayload<INormMaterial>
}

const DEFAULT_STATE = {}

const rawMaterialReducer = createReducer<IRSRawMaterial, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createRawMaterial.request,
      actions.createRawMaterial.failure,
      actions.createRawMaterial.success,
      actions.editRawMaterial.request,
      actions.editRawMaterial.failure,
      actions.editRawMaterial.success,
      actions.clearFormRawMaterialtatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formRawMaterialStatus: payload,
      }
    },
  )
  .handleAction([actions.getRawMaterialLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IRawMaterialRow[] = state?.rawMaterialList?.data?.docs || []

      return {
        ...state,
        rawMaterialList: {
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
      rawMaterialList: payload,
    }
  })
  .handleAction([actions.getRawMaterialLists.request, actions.getRawMaterialLists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      rawMaterialList: {
        ...payload,
        data: state.rawMaterialList?.data,
      },
    }
  })
  .handleAction(
    [actions.getRawMaterialDetail.request, actions.getRawMaterialDetail.failure, actions.getRawMaterialDetail.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rawMaterialDetail: payload,
      }
    },
  )
  .handleAction(
    [actions.getNormMaterialList.request, actions.getNormMaterialList.failure, actions.getNormMaterialList.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        normMaterial: payload,
      }
    },
  )
  .handleAction(
    [
      actions.createPurchasementHistory.request,
      actions.createPurchasementHistory.failure,
      actions.createPurchasementHistory.success,
      actions.editPurchasementHistory.request,
      actions.editPurchasementHistory.success,
      actions.editPurchasementHistory.failure,
      actions.clearFormPurchasementHistoryStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formPurchasementHistoryStatus: payload,
      }
    },
  )
  .handleAction([actions.getPurchasementHistoryLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IPurchasementHistoryRow[] = state?.purchasementHistoryList?.data?.docs || []
      return {
        ...state,
        purchasementHistoryList: {
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
      purchasementHistoryList: payload,
    }
  })
  .handleAction(
    [actions.getPurchasementHistoryLists.request, actions.getPurchasementHistoryLists.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        purchasementHistoryList: {
          ...payload,
          data: state.purchasementHistoryList?.data,
        },
      }
    },
  )
  .handleAction([actions.getReceptionHistoryLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IReceptionHistoryRow[] = state?.receptionHistoryList?.data?.docs || []
      return {
        ...state,
        receptionHistoryList: {
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
      receptionHistoryList: payload,
    }
  })
  .handleAction(
    [actions.getReceptionHistoryLists.request, actions.getReceptionHistoryLists.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        receptionHistoryList: {
          ...payload,
          data: state.receptionHistoryList?.data,
        },
      }
    },
  )
  .handleAction(
    [
      actions.editReceptionHistory.request,
      actions.editReceptionHistory.failure,
      actions.editReceptionHistory.success,
      actions.clearFormReceptionHistoryStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formReceptionHistoryStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteRawMaterial.request,
      actions.deleteRawMaterial.success,
      actions.deleteRawMaterial.failure,
      actions.clearDeleteRawMaterialStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteRawMaterialStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getRawMaterialAll.request, actions.getRawMaterialAll.success, actions.getRawMaterialAll.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rawMaterialAll: {
          data: state.rawMaterialAll?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction([actions.getNormaSubactivity.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      normaSubactivities: payload,
    }
  })
  .handleAction(
    [actions.getNormaSubactivity.request, actions.getNormaSubactivity.failure, actions.clearNormSubActivity],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        normaSubactivities: {
          ...payload,
          data: state.normaSubactivities?.data,
        },
      }
    },
  )
export default rawMaterialReducer
