import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/bkm/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IBKMDetail, IBKMFormDataCreate, IBKMFormDataUpdate, IBKMRow} from '@app/models/eplant/BKM'
import {data} from './data'

type bkmTemp = IBKMFormDataCreate

export interface IRSBKM {
  formBKMStatus?: IEffectPayload
  deleteBKMStatus?: IEffectPayload
  bkmList?: IEffectPayload<IPagingDocs<IBKMRow>>
  bkmListTemp?: bkmTemp[]
  bkmDetail?: IEffectPayload<IBKMDetail>
  bkmDetailMobile?: IEffectPayload<IBKMDetail>
}

const DEFAULT_STATE = {}

const bkmReducer = createReducer<IRSBKM, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createBKM.request,
      actions.createBKM.failure,
      actions.createBKM.success,
      actions.editBKM.request,
      actions.editBKM.failure,
      actions.editBKM.success,
      actions.clearFormBKMStatus,
    ],
    (state: IRSBKM, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formBKMStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.deleteBKM.request, actions.deleteBKM.failure, actions.deleteBKM.success, actions.clearDeleteBKMStatus],
    (state: IRSBKM, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteBKMStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getBKMMobile.request, actions.getBKMMobile.failure, actions.getBKMMobile.success],
    (state: IRSBKM, action: any) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data?.id) {
        return {
          ...state,
          bkmDetailMobile: payload,
        }
      }
      return {
        ...state,
        bkmDetailMobile: {
          ...payload,
          data: state?.bkmDetailMobile?.data,
        },
      }
    },
  )
  .handleAction([actions.getBKMLists.success], (state: IRSBKM, action: any) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IBKMRow[] = state?.bkmList?.data?.docs || []
      return {
        ...state,
        bkmList: {
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
      bkmList: payload,
    }
  })
  .handleAction([actions.getBKMLists.request, actions.getBKMLists.failure], (state: IRSBKM, action: any) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      bkmList: {
        ...payload,
        data: state.bkmList?.data,
      },
    }
  })
  .handleType(actions.addBKMTemp, (state: IRSBKM, action: any) => {
    const payload = action.payload
    return {
      ...state,
      bkmListTemp: [payload, ...(state?.bkmListTemp || [])],
    }
  })
  .handleType(actions.editBKMTemp, (state: IRSBKM, action: any) => {
    const payload = action.payload
    const found = state.bkmListTemp?.find((e: bkmTemp) => e.tempId === payload.tempId)
    if (found) {
      const bkmEmployee = found?.bkmEmployee?.map((e: any) =>
        e.employeeTempId === payload?.employeeTempId ? {...e, ...payload} : e,
      )
      state.bkmListTemp = state.bkmListTemp?.map((e: bkmTemp) =>
        e.tempId === payload.tempId ? {...e, bkmEmployee} : e,
      )
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteBKMEmployeeTemp, (state: IRSBKM, action: any) => {
    const payload = action.payload
    const found = state.bkmListTemp?.find((e: bkmTemp) => e.tempId === payload.tempId)
    if (found) {
      const bkmEmployee = found?.bkmEmployee?.filter((e: any) => e.employeeTempId !== payload?.employeeTempId)
      if (found?.bkmEmployee?.length === 1) {
        state.bkmListTemp = state.bkmListTemp?.filter((e: bkmTemp) => e.tempId !== payload.tempId)
      } else if (found?.bkmEmployee?.length > 1) {
        state.bkmListTemp = state.bkmListTemp?.map((e: bkmTemp) =>
          e.tempId === payload.tempId ? {...e, bkmEmployee} : e,
        )
      }
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteBKMTemp, (state: IRSBKM, action: any) => {
    const payload = action.payload
    state.bkmListTemp = state.bkmListTemp?.filter((e: bkmTemp) => e.tempId !== payload.tempId)
    return {
      ...state,
    }
  })
  .handleType(
    [actions.clearBkmDraft.request, actions.clearBkmDraft.success, actions.clearBkmDraft.failure],
    (state: IRSBKM, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        bkmListTemp: [],
      }
    },
  )

export default bkmReducer
