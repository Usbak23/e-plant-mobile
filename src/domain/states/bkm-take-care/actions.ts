import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/bkm-take-care/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {
  IBKMTakeCareDetail,
  IBKMTakeCareFormDataCreate,
  IBKMTakeCareFormDataUpdate,
  IBKMTakeCareRow,
} from '@app/models/eplant/BKMTakeCare'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import clearAction from '@domain/states/utils/clearAction'
import IStdResponse from '@app/models/commons/IStdResponse'

export const createBKMTakeCare = createAsyncAction(
  c.CREATE_BKM_TAKE_CARE_REQUEST,
  c.CREATE_BKM_TAKE_CARE_SUCCESS,
  c.CREATE_BKM_TAKE_CARE_FAILURE,
)<
  IEffectPayload<IBKMTakeCareFormDataCreate, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getBKMTakeCareLists = createAsyncAction(
  c.GET_BKM_TAKE_CARE_LIST_REQUEST,
  c.GET_BKM_TAKE_CARE_LIST_SUCCESS,
  c.GET_BKM_TAKE_CARE_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<IBKMTakeCareRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const editBKMTakeCare = createAsyncAction(
  c.EDIT_BKM_TAKE_CARE_REQUEST,
  c.EDIT_BKM_TAKE_CARE_SUCCESS,
  c.EDIT_BKM_TAKE_CARE_FAILURE,
)<
  IEffectPayload<IBKMTakeCareFormDataUpdate, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteBKMTakeCare = createAsyncAction(
  c.DELETE_BKM_TAKE_CARE_REQUEST,
  c.DELETE_BKM_TAKE_CARE_SUCCESS,
  c.DELETE_BKM_TAKE_CARE_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getBKMTakeCareDetail = createAsyncAction(
  c.DETAIL_BKM_TAKE_CARE_REQUEST,
  c.DETAIL_BKM_TAKE_CARE_SUCCESS,
  c.DETAIL_BKM_TAKE_CARE_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<IBKMTakeCareDetail, false>, IEffectPayload<null, false, IError>>()

export const getBKMTakeCareMobile = createAsyncAction(
  c.MOBILE_BKM_TAKE_CARE_REQUEST,
  c.MOBILE_BKM_TAKE_CARE_SUCCESS,
  c.MOBILE_BKM_TAKE_CARE_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IBKMTakeCareDetail, false>, IEffectPayload<null, false, IError>>()

export const clearBkmTakeCareDraft = createAsyncAction(
  c.CLEAR_DRAFT_BKM_TAKE_CARE_REQUEST,
  c.CLEAR_DRAFT_BKM_TAKE_CARE_SUCCESS,
  c.CLEAR_DRAFT_BKM_TAKE_CARE_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const addBKMTakeCareTemp = createAction(c.ADD_BKM_TAKE_CARE_TEMP, payload => payload)()
export const editBKMTakeCareTemp = createAction(c.EDIT_BKM_TAKE_CARE_TEMP, payload => payload)()
export const deleteBKMTakeCareTemp = createAction(c.DELETE_BKM_TAKE_CARE_TEMP, payload => payload)()
export const deleteBKMTakeCareEmployeeTemp = createAction(c.DELETE_BKM_TAKE_CARE_EMPLOYEE_TEMP, payload => payload)()
export const syncBKMTakeCare = createAction(c.SYNC_BKM_TAKE_CARE_REQUEST)()

export const clearFormBKMTakeCareStatus = createAction(c.CREATE_OR_EDIT_BKM_TAKE_CARE_CLEAR, clearAction)()
export const clearDeleteBKMTakeCareStatus = createAction(c.DELETE_BKM_TAKE_CARE_CLEAR, clearAction)()
