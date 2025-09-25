import {IEffectAction, IEffectPayload} from '../types'
import {createReducer} from 'typesafe-actions'
import {ActionsType} from '../store'
import * as actions from './actions'

import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IMyRequest, IMyRequestDetail} from '@app/models/eplant/MyRequest'

export interface IRSRequests {
  formMyRequestStatus?: IEffectPayload
  myRequesstDetail?: IEffectPayload<IMyRequestDetail>
  myRequestList?: IEffectPayload<IPagingDocs<IMyRequest>>
  listOfRequest?: IEffectPayload<IPagingDocs<IMyRequest>>
  deleteMyRequestStatus?: IEffectPayload
  processRequestStatus?: IEffectPayload
}

const DEFAULT_STATE = {}

const requestReducer = createReducer<IRSRequests, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createMyRequest.request,
      actions.createMyRequest.failure,
      actions.createMyRequest.success,
      actions.editMyRequest.request,
      actions.editMyRequest.failure,
      actions.editMyRequest.success,
      actions.clearFormMyRequest,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formMyRequestStatus: payload,
      }
    },
  )
  .handleAction([actions.getMyRequestList.success], (state, action) => {
    const payload = (action as IEffectAction).payload

    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IMyRequest[] = state?.myRequestList?.data?.docs || []
      return {
        ...state,
        myRequestList: {
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
      myRequestList: payload,
    }
  })
  .handleAction([actions.getMyRequestList.request, actions.getMyRequestList.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      myRequestList: {
        ...payload,
        data: state.myRequestList?.data,
      },
    }
  })
  .handleAction(
    [
      actions.deleteMyRequest.request,
      actions.deleteMyRequest.success,
      actions.deleteMyRequest.failure,
      actions.clearDeleteMyRequestStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteMyRequestStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.processRequest.request,
      actions.processRequest.success,
      actions.processRequest.failure,
      actions.clearProcessRequest,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        processRequestStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getMyRequestDetail.request, actions.getMyRequestDetail.success, actions.getMyRequestDetail.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        myRequesstDetail: payload,
      }
    },
  )

export default requestReducer
