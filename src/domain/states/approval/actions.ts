import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/approval/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '@domain/states/utils/clearAction'

interface IRktItem {
  id: string
  year: number
  organization: {
    id: string
    name: string
  }
  division: {
    id: string
    name: string
  }
  subActivity: {
    id: string
    name: string
  }
  user?: {
    name: string
    nip: string
    role?: {
      name: string
    }
  }
  status: string
  currentApprovalLevel: number
  createdAt: string
}

interface IApproveRequest {
  id: string
  notes?: string
}

interface IRejectRequest {
  id: string
  notes: string
}

export const getPendingApprovals = createAsyncAction(
  c.GET_PENDING_APPROVALS_REQUEST,
  c.GET_PENDING_APPROVALS_SUCCESS,
  c.GET_PENDING_APPROVALS_FAILURE
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IRktItem[], false>,
  IEffectPayload<null, false, IError>
>()

export const approveRkt = createAsyncAction(
  c.APPROVE_RKT_REQUEST,
  c.APPROVE_RKT_SUCCESS,
  c.APPROVE_RKT_FAILURE
)<
  IEffectPayload<IApproveRequest, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const rejectRkt = createAsyncAction(
  c.REJECT_RKT_REQUEST,
  c.REJECT_RKT_SUCCESS,
  c.REJECT_RKT_FAILURE
)<
  IEffectPayload<IRejectRequest, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getRktDetail = createAsyncAction(
  c.GET_RKT_DETAIL_REQUEST,
  c.GET_RKT_DETAIL_SUCCESS,
  c.GET_RKT_DETAIL_FAILURE
)<
  IEffectPayload<string, true>,
  IEffectPayload<any, false>,
  IEffectPayload<null, false, IError>
>()

export const clearApprovalStatus = createAction(c.CLEAR_APPROVAL_STATUS, clearAction)()