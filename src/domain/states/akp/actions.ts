import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/akp/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IAKPFormData, IAKPRow, IAKPRowAll} from '@app/models/eplant/AKP'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdResponse from '@app/models/commons/IStdResponse'

export const createAKP = createAsyncAction(c.CREATE_AKP_REQUEST, c.CREATE_AKP_SUCCESS, c.CREATE_AKP_FAILURE)<
  IEffectPayload<IAKPFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getAKPLists = createAsyncAction(c.GET_AKP_LIST_REQUEST, c.GET_AKP_LIST_SUCCESS, c.GET_AKP_LIST_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IAKPRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const editAKP = createAsyncAction(c.EDIT_AKP_REQUEST, c.EDIT_AKP_SUCCESS, c.EDIT_AKP_FAILURE)<
  IEffectPayload<IAKPFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteAKP = createAsyncAction(c.DELETE_AKP_REQUEST, c.DELETE_AKP_SUCCESS, c.DELETE_AKP_FAILURE)<
  IEffectPayload<IAKPRow, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getAKPDetail = createAsyncAction(c.DETAIL_AKP_REQUEST, c.DETAIL_AKP_SUCCESS, c.DETAIL_AKP_FAILURE)<
  IEffectPayload<string, true>,
  IEffectPayload<IAKPRow, false>,
  IEffectPayload<null, false, IError>
>()

export const getAllAKP = createAsyncAction(c.GET_ALL_AKP_REQUEST, c.GET_ALL_AKP_SUCCESS, c.GET_ALL_AKP_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IAKPRowAll[], false>,
  IEffectPayload<null, false, IError>
>()

export const clearAkpDraft = createAsyncAction(
  c.CLEAR_AKP_TEMP_REQUEST,
  c.CLEAR_AKP_TEMP_SUCCESS,
  c.CLEAR_AKP_TEMP_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const addAKPTemp = createAction(c.ADD_AKP_TEMP, payload => payload)()
export const editAKPTemp = createAction(c.EDIT_AKP_TEMP, payload => payload)()
export const deleteAKPTemp = createAction(c.DELETE_AKP_TEMP, payload => payload)()
export const syncAKP = createAction(c.SYNC_AKP_REQUEST, (payload?: any) => payload)()

export const clearFormAKPStatus = createAction(c.CREATE_OR_EDIT_AKP_CLEAR, clearAction)()
export const clearDeleteAKPStatus = createAction(c.DELETE_AKP_CLEAR, clearAction)()
