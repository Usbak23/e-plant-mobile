import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/pma/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IPMA, IPMADetail, IPMAEmployeeFormData, IPMAFormData, IPMARow} from '@app/models/eplant/PMA'

export interface IRSPMA {
  formPMAStatus?: IEffectPayload
  formEmployeeStatus?: IEffectPayload
  deletePMAStatus?: IEffectPayload
  pmaList?: IEffectPayload<IPMA>
  pmaFormmTemp?: IPMAFormData[]
  pmaLists?: IEffectPayload<IPagingDocs<IPMARow>>
  pmaDetail?: IEffectPayload<IPMADetail>
}

const DEFAULT_STATE = {}

const pmaReducer = createReducer<IRSPMA, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createPMA.request,
      actions.createPMA.failure,
      actions.createPMA.success,
      actions.editPMA.request,
      actions.editPMA.failure,
      actions.editPMA.success,
      actions.clearFormPMAStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formPMAStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.editSinglePMAEmployee.request,
      actions.editSinglePMAEmployee.success,
      actions.editSinglePMAEmployee.failure,
      actions.clearFormPMAEmployeeStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formEmployeeStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.deletePMA.request, actions.deletePMA.failure, actions.deletePMA.success, actions.clearDeletePMAStatus],
    (state: IRSPMA, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deletePMAStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getPMADetail.request, actions.getPMADetail.failure, actions.getPMADetail.success],
    (state: IRSPMA, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        pmaDetail: payload,
      }
    },
  )
  .handleAction([actions.getPMAMobile.request, actions.getPMAMobile.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      pmaList: {
        ...payload,
        data: state.pmaList?.data,
      },
    }
  })
  .handleAction([actions.getPMAMobile.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      pmaList: payload,
    }
  })
  .handleAction([actions.getPMALists.request, actions.getPMALists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      pmaLists: {
        ...payload,
        data: state.pmaLists?.data,
      },
    }
  })
  .handleAction([actions.getPMALists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IPMARow[] = state?.pmaLists?.data?.docs || []
      return {
        ...state,
        pmaLists: {
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
      pmaLists: payload,
    }
  })
  .handleType(actions.addPMATemp, (state: IRSPMA, action: any) => {
    const payload = action.payload
    // const found = state.pmaFormmTemp?.find((e: IPMAFormData) => e.tempId === payload.tempId )
    const found = state.pmaFormmTemp?.find(
      (e: IPMAFormData) =>
        e.datePma == payload.datePma && e.divisionId == payload.divisionId && e.foremanId == payload.foremanId,
    )

    if (found) {
      found.employee = found.employee?.concat(action.payload.employee || [])

      state.pmaFormmTemp = state.pmaFormmTemp?.map((e: IPMAFormData) => {
        return e.datePma === payload.datePma && e.divisionId == payload.divisionId && e.foremanId == payload.foremanId
          ? {...found}
          : e
      })

      return {
        ...state,
      }
    }
    return {
      ...state,
      pmaFormmTemp: [payload, ...(state?.pmaFormmTemp || [])],
    }
  })
  .handleType(actions.deletePMAEmployeeTemp, (state: IRSPMA, action: any) => {
    const payload = action.payload
    // const found = state.pmaFormmTemp?.find((e: IPMAFormData) => e.tempId === payload.tempId)
    const found = state.pmaFormmTemp?.find((e: IPMAFormData) =>
      e.employee?.find((e1: IPMAEmployeeFormData) => e1.employeeTempId == payload.employeeTempId),
    )
    if (found) {
      const employee = found?.employee?.filter(
        (e: IPMAEmployeeFormData) => e.employeeTempId !== payload?.employeeTempId,
      )

      if (employee?.length == 0) {
        state.pmaFormmTemp = state.pmaFormmTemp?.filter((e: IPMAFormData) => e.tempId != found.tempId)
      } else {
        state.pmaFormmTemp = state.pmaFormmTemp?.map((e: IPMAFormData) =>
          e.tempId === found.tempId ? {...e, employee} : e,
        )
      }
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deletePMATemp, (state: IRSPMA, action: any) => {
    const payload = action.payload
    state.pmaFormmTemp = state.pmaFormmTemp?.filter((e: IPMAFormData) => e.tempId !== payload.tempId)
    return {
      ...state,
    }
  })

  .handleType(actions.editPMATemp, (state: IRSPMA, action: any) => {
    const payload = action.payload
    const found = state.pmaFormmTemp?.find((e: IPMAFormData) => e.tempId === payload.tempId)
    if (found) {
      const pmaEmployee = found?.employee?.map((e: any) => {
        if (Array.isArray(payload.employee) && e.employeeTempId === payload?.employee[0].employeeTempId) {
          return {...e, ...payload.employee[0]}
        }
        return e
      })

      state.pmaFormmTemp = state.pmaFormmTemp?.map((e: IPMAFormData) => {
        if (e.tempId === payload.tempId) {
          e.employee = [...pmaEmployee]
          return e
        }
        return e
      })
    }
    return {
      ...state,
    }
  })
  .handleType(
    [actions.clearPmaDraft.request, actions.clearPmaDraft.success, actions.clearPmaDraft.failure],
    (state: IRSPMA, action: any) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        pmaFormmTemp: [],
      }
    },
  )

export default pmaReducer
