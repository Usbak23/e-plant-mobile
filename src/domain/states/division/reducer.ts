import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/division/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {Division} from '@app/models/eplant/Division'

export interface IRSDivision {
  divisionList?: IEffectPayload<IPagingDocs<Division>>
  formDivisionStatus?: IEffectPayload
  deleteDivisionStatus?: IEffectPayload
  divisionDetail?: IEffectPayload<Division>
  divisionAll?: IEffectPayload<Division[]>
}

const DEFAULT_STATE = {}

const divisionReducer = createReducer<IRSDivision, ActionsType>(DEFAULT_STATE)
  .handleAction([actions.getDivisionLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: Division[] = state?.divisionList?.data?.docs || []
      return {
        ...state,
        divisionList: {
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
      divisionList: payload,
    }
  })
  .handleAction([actions.getDivisionLists.request, actions.getDivisionLists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      divisionList: {
        ...payload,
        data: state.divisionList?.data,
      },
    }
  })
  .handleAction(
    [
      actions.createDivision.request,
      actions.createDivision.failure,
      actions.createDivision.success,
      actions.editDivision.request,
      actions.editDivision.failure,
      actions.editDivision.success,
      actions.clearFormDivisionStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formDivisionStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteDivision.request,
      actions.deleteDivision.success,
      actions.deleteDivision.failure,
      actions.clearDeleteDivisionStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteDivisionStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.detailDivision.request, actions.detailDivision.failure, actions.detailDivision.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        divisionDetail: payload,
      }
    },
  )
  .handleAction([actions.getAllDivision.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      divisionAll: payload,
    }
  })
  .handleAction([actions.getAllDivision.request, actions.getAllDivision.failure], (state, action) => {
    const payload = (action as IEffectAction).payload

    return {
      ...state,
      divisionAll: {
        ...payload,
        data: state.divisionAll?.data,
      },
    }
  })

export default divisionReducer
