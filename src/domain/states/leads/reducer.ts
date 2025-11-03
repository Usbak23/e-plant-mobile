import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/leads/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {ILeadDetail, ILeadRow, ILeadStatusHistories, ILeadRowAll, ILeadFormData} from '@app/models/crm/Lead'

export interface IRSLeads {
  formLeadStatus?: IEffectPayload
  deleteLeadStatus?: IEffectPayload
  leadAll?: IEffectPayload<ILeadRowAll[]>
  leadList?: IEffectPayload<IPagingDocs<ILeadRow>>
  leadListTemp?: ILeadFormData[]
  leadDetail?: IEffectPayload<ILeadDetail>
  leadStatusHistories?: IEffectPayload<ILeadStatusHistories[]>
}

const DEFAULT_STATE = {}

const leadsReducer = createReducer<IRSLeads, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createLead.request,
      actions.createLead.failure,
      actions.createLead.success,
      actions.editLead.request,
      actions.editLead.failure,
      actions.editLead.success,
      actions.clearFormLeadStatus,
    ],
    (state: IRSLeads, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formLeadStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteLeads.request,
      actions.deleteLeads.failure,
      actions.deleteLeads.success,
      actions.clearDeleteLeadStatus,
    ],
    (state: IRSLeads, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteLeadStatus: payload,
      }
    },
  )
  .handleAction([actions.getLeadLists.success], (state: IRSLeads, action: any) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: ILeadRow[] = state?.leadList?.data?.docs || []
      return {
        ...state,
        leadList: {
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
      leadList: payload,
    }
  })
  .handleAction([actions.getLeadLists.request, actions.getLeadLists.failure], (state: IRSLeads, action: any) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      leadList: {
        ...payload,
        data: state.leadList?.data,
      },
    }
  })
  .handleType(actions.addLeadTemp, (state: IRSLeads, action: any) => {
    const payload = action.payload
    return {
      ...state,
      leadListTemp: [payload, ...(state?.leadListTemp || [])],
    }
  })
  .handleType(actions.editLeadTemp, (state: IRSLeads, action: any) => {
    const payload = action.payload
    const found = state.leadListTemp?.find((e: ILeadFormData) => e.tempId === payload.tempId)
    if (found) {
      state.leadListTemp = state.leadListTemp?.map((e: ILeadFormData) =>
        e.tempId !== payload.tempId ? {...e, ...payload} : e,
      )
    }
    return {
      ...state,
    }
  })
  .handleType(actions.deleteLeadTemp, (state: IRSLeads, action: any) => {
    const payload = action.payload
    state.leadListTemp = state.leadListTemp?.filter((e: ILeadFormData) => e.tempId !== payload.tempId)
    return {
      ...state,
    }
  })

export default leadsReducer
