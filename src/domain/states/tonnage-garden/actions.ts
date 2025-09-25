import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/tonnage-garden/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '@domain/states/utils/clearAction'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {
  ITonnageGardenDetail,
  ITonnageGardenFileFormData,
  ITonnageGardenFormData,
  ITonnageGardenRow,
} from '@app/models/eplant/TonnageGarden'

export const createTonnageGarden = createAsyncAction(
  c.CREATE_TONNAGE_GARDEN_REQUEST,
  c.CREATE_TONNAGE_GARDEN_SUCCESS,
  c.CREATE_TONNAGE_GARDEN_FAILURE,
)<
  IEffectPayload<ITonnageGardenFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const uploadTonnageGarden = createAsyncAction(
  c.UPLOAD_TONNAGE_GARDEN_REQUEST,
  c.UPLOAD_TONNAGE_GARDEN_SUCCESS,
  c.UPLOAD_TONNAGE_GARDEN_FAILURE,
)<
  IEffectPayload<ITonnageGardenFileFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const updateTonnageGarden = createAsyncAction(
  c.EDIT_TONNAGE_GARDEN_REQUEST,
  c.EDIT_TONNAGE_GARDEN_SUCCESS,
  c.EDIT_TONNAGE_GARDEN_FAILURE,
)<
  IEffectPayload<ITonnageGardenFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteTonnageGarden = createAsyncAction(
  c.DELETE_TONNAGE_GARDEN_REQUEST,
  c.DELETE_TONNAGE_GARDEN_SUCCESS,
  c.DELETE_TONNAGE_GARDEN_FAILURE,
)<IEffectPayload<string, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const getTonnageGardenPaginated = createAsyncAction(
  c.GET_TONNAGE_GARDEN_LIST_REQUEST,
  c.GET_TONNAGE_GARDEN_LIST_SUCCESS,
  c.GET_TONNAGE_GARDEN_LIST_FAILURE,
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IPagingDocs<ITonnageGardenRow>, false>,
  IEffectPayload<null, false, IError>
>()

export const getTonnageGardenAll = createAsyncAction(
  c.GET_TONNAGE_GARDEN_ALL_REQUEST,
  c.GET_TONNAGE_GARDEN_ALL_SUCCESS,
  c.GET_TONNAGE_GARDEN_ALL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<ITonnageGardenRow[], false>, IEffectPayload<null, false, IError>>()

export const getTonnageGardenWithoutPKS = createAsyncAction(
  c.GET_TONNAGE_GARDEN_WITHOUT_PKS_REQUEST,
  c.GET_TONNAGE_GARDEN_WITHOUT_PKS_SUCCESS,
  c.GET_TONNAGE_GARDEN_WITHOUT_PKS_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<ITonnageGardenRow[], false>, IEffectPayload<null, false, IError>>()

export const getTonnageGardenDetail = createAsyncAction(
  c.DETAIL_TONNAGE_GARDEN_REQUEST,
  c.DETAIL_TONNAGE_GARDEN_SUCCESS,
  c.DETAIL_TONNAGE_GARDEN_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<ITonnageGardenDetail, false>, IEffectPayload<null, false, IError>>()

export const clearFormTonnageGardenStatus = createAction(c.CREATE_OR_EDIT_TONNAGE_GARDEN_CLEAR, clearAction)()
export const clearDeleteTonnageGardenStatus = createAction(c.DELETE_TONNAGE_GARDEN_CLEAR, clearAction)()
