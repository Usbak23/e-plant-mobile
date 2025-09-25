import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/leads/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {ILeadFormData, ILeadRow} from '@app/models/crm/Lead'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdEntity from '@app/models/commons/IStdEntity'

export const createLead = createAsyncAction(c.CREATE_LEAD_REQUEST, c.CREATE_LEAD_SUCCESS, c.CREATE_LEAD_FAILURE)<
  IEffectPayload<ILeadFormData, boolean>,
  IEffectPayload<IStdEntity, false>,
  IEffectPayload<null, false, IError>
>()

export const editLead = createAsyncAction(c.EDIT_LEAD_REQUEST, c.EDIT_LEAD_SUCCESS, c.EDIT_LEAD_FAILURE)<
  IEffectPayload<ILeadFormData, boolean>,
  IEffectPayload<IStdEntity, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteLeads = createAsyncAction(c.DELETE_LEAD_REQUEST, c.DELETE_LEAD_SUCCESS, c.DELETE_LEAD_FAILURE)<
  IEffectPayload<string[], boolean>,
  IEffectPayload<any, false>,
  IEffectPayload<null, false, IError>
>()

export const getLeadLists = createAsyncAction(
  c.GET_LEAD_LIST_REQUEST,
  c.GET_LEAD_LIST_SUCCESS,
  c.GET_LEAD_LIST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<ILeadRow>, false>, IEffectPayload<null, false, IError>>()

export const addLeadTemp = createAction(c.ADD_LEAD_TEMP, payload => payload)()
export const editLeadTemp = createAction(c.EDIT_LEAD_TEMP, payload => payload)()
export const deleteLeadTemp = createAction(c.DELETE_LEAD_TEMP, payload => payload)()
export const syncLeads = createAction(c.SYNC_LEADS_REQUEST)()

export const clearFormLeadStatus = createAction(c.CREATE_OR_EDIT_LEAD_CLEAR, clearAction)()
export const clearDeleteLeadStatus = createAction(c.DELETE_LEAD_CLEAR, clearAction)()
