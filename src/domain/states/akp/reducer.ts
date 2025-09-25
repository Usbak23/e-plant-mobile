import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/akp/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IAKPDetail, IAKPRow, IAKPRowAll, IAKPFormData} from '@app/models/eplant/AKP'

export interface IRSAKP {
  formAKPStatus?: IEffectPayload
  deleteAKPStatus?: IEffectPayload
  akpAll?: IEffectPayload<IAKPRowAll[]>
  akpList?: IEffectPayload<IPagingDocs<IAKPRow>>
  akpListTemp?: IAKPFormData[]
  akpDetail?: IEffectPayload<IAKPDetail>
}

const DEFAULT_STATE = {}

const akpReducer = createReducer<IRSAKP, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createAKP.request,
      actions.createAKP.failure,
      actions.createAKP.success,
      actions.editAKP.request,
      actions.editAKP.failure,
      actions.editAKP.success,
      actions.clearFormAKPStatus,
    ],
    (state: IRSAKP, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formAKPStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.deleteAKP.request, actions.deleteAKP.failure, actions.deleteAKP.success, actions.clearDeleteAKPStatus],
    (state: IRSAKP, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteAKPStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getAKPDetail.request, actions.getAKPDetail.failure, actions.getAKPDetail.success],
    (state: IRSAKP, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        akpDetail: payload,
      }
    },
  )
  .handleAction([actions.getAKPLists.success], (state: IRSAKP, action: any) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IAKPRow[] = state?.akpList?.data?.docs || []
      return {
        ...state,
        akpList: {
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
      akpList: payload,
    }
  })
  .handleAction([actions.getAKPLists.request, actions.getAKPLists.failure], (state: IRSAKP, action: any) => {
    const payload = (action as IEffectAction).payload
    // return {
    //   ...state,
    //   akpList: {
    //     ...payload,
    //     data: state.akpList?.data,
    //   },
    // }
    return {
      ...state,
      akpList: payload,
    }
  })
  .handleType(actions.addAKPTemp, (state: IRSAKP, action: any) => {
    const payload = action.payload
    return {
      ...state,
      akpListTemp: [payload, ...(state?.akpListTemp || [])],
    }
  })
  .handleType(
    [actions.clearAkpDraft.request, actions.clearAkpDraft.success, actions.clearAkpDraft.failure],
    (state: IRSAKP, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        akpListTemp: [],
      }
    },
  )
  // .handleType(actions.clearAkpDraft, (state: IRSAKP, action: any) => {
  //   const payload = (action as IEffectAction).payload
  //   console.log('clearAkpDraft', payload)
  //   return {
  //     ...state,
  //     akpListTemp: [],
  //   }
  // })
  .handleType(actions.editAKPTemp, (state: IRSAKP, action: any) => {
    const payload = action.payload
    const found = state.akpListTemp?.find((e: IAKPFormData) => e.tempId === payload.tempId)
    if (found) {
      state.akpListTemp = state.akpListTemp?.map((e: IAKPFormData) =>
        e.tempId === payload.tempId ? {...e, ...payload} : e,
      )
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteAKPTemp, (state: IRSAKP, action: any) => {
    const payload = action.payload
    state.akpListTemp = state.akpListTemp?.filter((e: IAKPFormData) => e.tempId !== payload.tempId)
    return {
      ...state,
    }
  })

export default akpReducer
