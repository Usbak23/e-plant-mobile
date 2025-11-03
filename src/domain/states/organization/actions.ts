import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/organization/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IOrganizationFormData, IOrganizationRow, IOrganizationRowAll} from '@app/models/eplant/Organization'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdEntity from '@app/models/commons/IStdEntity'

export const createOrganization = createAsyncAction(
  c.CREATE_ORGANIZATION_REQUEST,
  c.CREATE_ORGANIZATION_SUCCESS,
  c.CREATE_ORGANIZATION_FAILURE,
)<IEffectPayload<IOrganizationFormData, true>, IEffectPayload<IStdEntity, false>, IEffectPayload<null, false, IError>>()

export const editOrganization = createAsyncAction(
  c.EDIT_ORGANIZATION_REQUEST,
  c.EDIT_ORGANIZATION_SUCCESS,
  c.EDIT_ORGANIZATION_FAILURE,
)<IEffectPayload<IOrganizationFormData, true>, IEffectPayload<IStdEntity, false>, IEffectPayload<null, false, IError>>()

export const deleteOrganization = createAsyncAction(
  c.DELETE_ORGANIZATION_REQUEST,
  c.DELETE_ORGANIZATION_SUCCESS,
  c.DELETE_ORGANIZATION_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const getOrganizationLists = createAsyncAction(
  c.GET_ORGANIZATION_LIST_REQUEST,
  c.GET_ORGANIZATION_LIST_SUCCESS,
  c.GET_ORGANIZATION_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IOrganizationRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getOrganizationDetail = createAsyncAction(
  c.GET_ORGANIZATION_DETAIL_REQUEST,
  c.GET_ORGANIZATION_DETAIL_SUCCESS,
  c.GET_ORGANIZATION_DETAIL_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IOrganizationRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getOrganizationAll = createAsyncAction(
  c.GET_ORGANIZATION_ALL_REQUEST,
  c.GET_ORGANIZATION_ALL_SUCCESS,
  c.GET_ORGANIZATION_ALL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IOrganizationRowAll[], false>, IEffectPayload<null, false, IError>>()

export const clearFormOrganizationStatus = createAction(c.CREATE_OR_EDIT_ORGANIZATION_CLEAR, clearAction)()
export const clearDeleteOrganizationStatus = createAction(c.DELETE_ORGANIZATION_CLEAR, clearAction)()
export const clearOrganizationAll = createAction(c.CLEAR_ORGANIZATION_ALL, clearAction)()
