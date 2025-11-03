import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/organization/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IOrganizationDetail, IOrganizationRow, IOrganizationRowAll} from '@app/models/eplant/Organization'

export interface IRSOrganization {
  formOrganizationStatus?: IEffectPayload
  deleteOrganizationStatus?: IEffectPayload
  organizationAll?: IEffectPayload<IOrganizationRowAll[]>
  organizationList?: IEffectPayload<IPagingDocs<IOrganizationRow>>
  organizationDetail?: IEffectPayload<IOrganizationDetail>
}

const DEFAULT_STATE = {}

const organizationReducer = createReducer<IRSOrganization, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createOrganization.request,
      actions.createOrganization.failure,
      actions.createOrganization.success,
      actions.editOrganization.request,
      actions.editOrganization.failure,
      actions.editOrganization.success,
      actions.clearFormOrganizationStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formOrganizationStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteOrganization.request,
      actions.deleteOrganization.failure,
      actions.deleteOrganization.success,
      actions.clearDeleteOrganizationStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteOrganizationStatus: payload,
      }
    },
  )
  .handleAction([actions.getOrganizationLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IOrganizationRow[] = state?.organizationList?.data?.docs || []
      return {
        ...state,
        organizationList: {
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
      organizationList: payload,
    }
  })
  .handleAction([actions.getOrganizationLists.request, actions.getOrganizationLists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      organizationList: {
        ...payload,
        data: state.organizationList?.data,
      },
    }
  })
  .handleAction(
    [
      actions.getOrganizationDetail.request,
      actions.getOrganizationDetail.failure,
      actions.getOrganizationDetail.success,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        organizationDetail: payload,
      }
    },
  )
  .handleAction([actions.getOrganizationAll.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      organizationAll: payload,
    }
  })

  .handleAction([actions.getOrganizationAll.request, actions.getOrganizationAll.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      organizationAll: {
        data: state.organizationAll?.data,
        ...payload,
      },
    }
  })
  .handleAction([actions.clearOrganizationAll], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      organizationAll: payload,
    }
  })

export default organizationReducer
