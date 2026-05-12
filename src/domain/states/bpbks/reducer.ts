import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/bpbks/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import {IBPBKSFormDataCreate, IBPBKSResponse, Doc} from '@app/models/eplant/BPBKS'
import {data} from './data'

type bkmTemp = IBPBKSFormDataCreate

export interface IRSBPBKS {
  formBPBKSStatus?: IEffectPayload
  deleteBPBKSStatus?: IEffectPayload
  bpbksAll?: IEffectPayload<IBPBKSResponse>
  bpbksListTemp?: bkmTemp[]
}

const DEFAULT_STATE = {
  // bpbksAll: data,
}

const bkmReducer = createReducer<IRSBPBKS, ActionsType>(DEFAULT_STATE as IRSBPBKS)
  .handleAction(
    [
      actions.createBPBKS.request,
      actions.createBPBKS.failure,
      actions.createBPBKS.success,
      actions.editBPBKS.request,
      actions.editBPBKS.failure,
      actions.editBPBKS.success,
      actions.clearFormBPBKSStatus,
    ],
    (state: IRSBPBKS, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formBPBKSStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteBPBKS.request,
      actions.deleteBPBKS.failure,
      actions.deleteBPBKS.success,
      actions.clearDeleteBPBKSStatus,
    ],
    (state: IRSBPBKS, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteBPBKSStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getBPBKSAll.request, actions.getBPBKSAll.failure, actions.getBPBKSAll.success],
    (state: IRSBPBKS, action: any) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data?.bpbks?.id) {
        return {
          ...state,
          bpbksAll: payload,
        }
      }
      return {
        ...state,
        bpbksAll: {
          ...payload,
          data: state?.bpbksAll?.data,
        },
      }
    },
  )
  .handleType(actions.addBPBKSTemp, (state: IRSBPBKS, action: any) => {
    const payload = action.payload
    return {
      ...state,
      bpbksListTemp: [{...payload, syncStatus: 'pending'}, ...(state?.bpbksListTemp || [])],
    }
  })
  .handleType(actions.editBPBKSTemp, (state: IRSBPBKS, action: any) => {
    const payload = action.payload
    const found = state.bpbksListTemp?.find((e: bkmTemp) => e.tempId === payload.tempId)
    if (found) {
      const tphs = found?.tphs?.map((e: any) => (e.employeeTempId === payload?.employeeTempId ? {...e, ...payload} : e))
      state.bpbksListTemp = state.bpbksListTemp?.map((e: bkmTemp) => (e.tempId === payload.tempId ? {...e, tphs} : e))
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteBPBKSEmployeeTemp, (state: IRSBPBKS, action: any) => {
    const payload = action.payload
    const found = state.bpbksListTemp?.find((e: bkmTemp) => e.tempId === payload.tempId)
    if (found) {
      const tphs = found?.tphs?.filter((e: any) => e.employeeTempId !== payload?.employeeTempId)
      if (found?.tphs?.length === 1) {
        state.bpbksListTemp = state.bpbksListTemp?.filter((e: bkmTemp) => e.tempId !== payload.tempId)
      } else if (found?.tphs?.length > 1) {
        state.bpbksListTemp = state.bpbksListTemp?.map((e: bkmTemp) => (e.tempId === payload.tempId ? {...e, tphs} : e))
      }
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteBPBKSTemp, (state: IRSBPBKS, action: any) => {
    const payload = action.payload
    state.bpbksListTemp = state.bpbksListTemp?.filter((e: bkmTemp) => e.tempId !== payload.tempId)
    return {
      ...state,
    }
  })
  .handleType(actions.updateBPBKSTempStatus, (state: IRSBPBKS, action: any) => {
    const {tempId, syncStatus, syncError} = action.payload
    return {
      ...state,
      bpbksListTemp: state.bpbksListTemp?.map((e: bkmTemp) =>
        e.tempId === tempId ? {...e, syncStatus, syncError: syncError || undefined} : e,
      ),
    }
  })
  .handleType(
    [actions.clearBpbksDraft.request, actions.clearBpbksDraft.success, actions.clearBpbksDraft.failure],
    (state: IRSBPBKS, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        bpbksListTemp: [],
      }
    },
  )
  .handleType(actions.clearBPBKSAll, (state: IRSBPBKS) => {
    return {
      ...state,
      bpbksAll: undefined,
    }
  })

export default bkmReducer
