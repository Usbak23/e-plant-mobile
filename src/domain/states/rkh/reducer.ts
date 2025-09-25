import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/rkh/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IRKHDetail, IRKHRow, IRKHFormData, IRKHSummary, IRKHAllRow} from '@app/models/eplant/RKH'

export interface IRSRKH {
  formRKHStatus?: IEffectPayload
  deleteRKHStatus?: IEffectPayload
  rkhList?: IEffectPayload<IPagingDocs<IRKHRow> & IRKHSummary>
  rkhListTemp?: IRKHFormData[]
  rkhDetail?: IEffectPayload<IRKHDetail>
  rkhAll?: IEffectPayload<IRKHAllRow>
  rkhSummary?: IEffectPayload<IRKHSummary>
}

const DEFAULT_STATE = {}

const rkhReducer = createReducer<IRSRKH, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createRKH.request,
      actions.createRKH.failure,
      actions.createRKH.success,
      actions.editRKH.request,
      actions.editRKH.failure,
      actions.editRKH.success,
      actions.clearFormRKHStatus,
    ],
    (state: IRSRKH, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formRKHStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.getRKHSummary.request,
      actions.getRKHSummary.failure,
      actions.getRKHSummary.success,
      actions.clearRKHSummary,
    ],
    (state: IRSRKH, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rkhSummary: payload,
      }
    },
  )
  .handleAction(
    [actions.deleteRKH.request, actions.deleteRKH.failure, actions.deleteRKH.success, actions.clearDeleteRKHStatus],
    (state: IRSRKH, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteRKHStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getRKHDetail.request, actions.getRKHDetail.failure, actions.getRKHDetail.success],
    (state: IRSRKH, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rkhDetail: payload,
      }
    },
  )
  .handleAction([actions.getRKHLists.success], (state: IRSRKH, action: any) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IRKHRow[] = state?.rkhList?.data?.docs || []
      return {
        ...state,
        rkhList: {
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
      rkhList: payload,
    }
  })
  .handleAction([actions.getRKHAll.success], (state: IRSRKH, action: any) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      rkhAll: payload,
    }
  })
  .handleAction([actions.getRKHAll.request, actions.getRKHAll.failure], (state: IRSRKH, action: any) => {
    const payload = (action as IEffectAction).payload

    return {
      ...state,
      rkhAll: {
        ...payload,
        data: state.rkhAll?.data,
      },
    }
  })
  .handleAction([actions.getRKHLists.request, actions.getRKHLists.failure], (state: IRSRKH, action: any) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      rkhList: {
        ...payload,
        data: state.rkhList?.data,
      },
    }
  })
  .handleType(actions.addRKHTemp, (state: IRSRKH, action: any) => {
    const payload = action.payload
    return {
      ...state,
      rkhListTemp: [payload, ...(state?.rkhListTemp || [])],
    }
  })
  .handleType(actions.editRKHTemp, (state: IRSRKH, action: any) => {
    const payload = action.payload
    const found = state.rkhListTemp?.find((e: IRKHFormData) => e.tempId === payload.tempId)
    if (found) {
      state.rkhListTemp = state.rkhListTemp?.map((e: IRKHFormData) =>
        e.tempId === payload.tempId ? {...e, ...payload} : e,
      )
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteRKHTemp, (state: IRSRKH, action: any) => {
    const payload = action.payload
    state.rkhListTemp = state.rkhListTemp?.filter((e: IRKHFormData) => e.tempId !== payload.tempId)
    return {
      ...state,
    }
  })
  .handleType(
    [actions.clearRkhDraft.request, actions.clearRkhDraft.success, actions.clearRkhDraft.failure],
    (state: IRSRKH, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rkhListTemp: [],
      }
    },
  )

export default rkhReducer
