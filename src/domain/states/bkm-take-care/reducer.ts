import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/bkm-take-care/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {
  IBKMTakeCareDetail,
  IBKMTakeCareFormDataCreate,
  IBKMTakeCareFormDataUpdate,
  IBKMTakeCareRow,
} from '@app/models/eplant/BKMTakeCare'
import {data} from './data'

type bkmTemp = IBKMTakeCareFormDataCreate

export interface IRSBKMTakeCare {
  formBKMTakeCareStatus?: IEffectPayload
  deleteBKMTakeCareStatus?: IEffectPayload
  bkmTakeCareList?: IEffectPayload<IPagingDocs<IBKMTakeCareRow>>
  bkmTakeCareListTemp?: bkmTemp[]
  bkmTakeCareDetail?: IEffectPayload<IBKMTakeCareDetail>
  bkmTakeCareDetailMobile?: IEffectPayload<IBKMTakeCareDetail>
}

const DEFAULT_STATE = {
  // bkmTakeCareDetailMobile: data,
}

const bkmReducer = createReducer<IRSBKMTakeCare, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createBKMTakeCare.request,
      actions.createBKMTakeCare.failure,
      actions.createBKMTakeCare.success,
      actions.editBKMTakeCare.request,
      actions.editBKMTakeCare.failure,
      actions.editBKMTakeCare.success,
      actions.clearFormBKMTakeCareStatus,
    ],
    (state: IRSBKMTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formBKMTakeCareStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteBKMTakeCare.request,
      actions.deleteBKMTakeCare.failure,
      actions.deleteBKMTakeCare.success,
      actions.clearDeleteBKMTakeCareStatus,
    ],
    (state: IRSBKMTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteBKMTakeCareStatus: payload,
      }
    },
  )
  .handleAction([actions.getBKMTakeCareMobile.request], (state: IRSBKMTakeCare, action: any) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      bkmTakeCareDetailMobile: {
        ...payload,
        data: state?.bkmTakeCareDetailMobile?.data,
      },
    }
  })

  .handleAction(
    [actions.getBKMTakeCareMobile.failure, actions.getBKMTakeCareMobile.success],
    (state: IRSBKMTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        bkmTakeCareDetailMobile: payload,
      }
    },
  )
  .handleAction([actions.getBKMTakeCareLists.success], (state: IRSBKMTakeCare, action: any) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IBKMTakeCareRow[] = state?.bkmTakeCareList?.data?.docs || []

      return {
        ...state,
        bkmTakeCareList: {
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
      bkmTakeCareList: payload,
    }
  })
  .handleAction(
    [actions.getBKMTakeCareLists.request, actions.getBKMTakeCareLists.failure],
    (state: IRSBKMTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        bkmTakeCareList: {
          ...payload,
          data: state.bkmTakeCareList?.data,
        },
      }
    },
  )
  .handleType(actions.addBKMTakeCareTemp, (state: IRSBKMTakeCare, action: any) => {
    const payload = action.payload
    return {
      ...state,
      bkmTakeCareListTemp: [payload, ...(state?.bkmTakeCareListTemp || [])],
    }
  })
  .handleType(actions.editBKMTakeCareTemp, (state: IRSBKMTakeCare, action: any) => {
    const payload = action.payload
    const found = state.bkmTakeCareListTemp?.find((e: bkmTemp) => e.tempId === payload.tempId)
    if (found) {
      const bkmEmployee = found?.bkmEmployee?.map((e: any) =>
        e.employeeTempId === payload?.employeeTempId ? {...e, ...payload} : e,
      )
      state.bkmTakeCareListTemp = state.bkmTakeCareListTemp?.map((e: bkmTemp) =>
        e.tempId === payload.tempId ? {...e, bkmEmployee} : e,
      )
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteBKMTakeCareEmployeeTemp, (state: IRSBKMTakeCare, action: any) => {
    const payload = action.payload
    const found = state.bkmTakeCareListTemp?.find((e: bkmTemp) => e.tempId === payload.tempId)
    if (found) {
      const bkmEmployee = found?.bkmEmployee?.filter((e: any) => e.employeeTempId !== payload?.employeeTempId)
      if (found?.bkmEmployee?.length === 1) {
        state.bkmTakeCareListTemp = state.bkmTakeCareListTemp?.filter((e: bkmTemp) => e.tempId !== payload.tempId)
      } else if (found?.bkmEmployee?.length > 1) {
        state.bkmTakeCareListTemp = state.bkmTakeCareListTemp?.map((e: bkmTemp) =>
          e.tempId === payload.tempId ? {...e, bkmEmployee} : e,
        )
      }
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteBKMTakeCareTemp, (state: IRSBKMTakeCare, action: any) => {
    const payload = action.payload
    state.bkmTakeCareListTemp = state.bkmTakeCareListTemp?.filter((e: bkmTemp) => e.tempId !== payload.tempId)
    return {
      ...state,
    }
  })
  .handleType(
    [
      actions.clearBkmTakeCareDraft.request,
      actions.clearBkmTakeCareDraft.success,
      actions.clearBkmTakeCareDraft.failure,
    ],
    (state: IRSBKMTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        bkmTakeCareListTemp: [],
      }
    },
  )

export default bkmReducer
