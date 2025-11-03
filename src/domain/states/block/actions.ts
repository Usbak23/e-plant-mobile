import {createAction, createAsyncAction} from 'typesafe-actions'
import * as c from '@app/domain/states/block/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IBlockFormData, IBlockRow} from '@app/models/eplant/Block'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '../utils/clearAction'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IUserStd} from '@app/models/eplant/User'

export const getAllForemanX = createAsyncAction(
  c.GET_ALL_FOREMAN_REQUEST,
  c.GET_ALL_FOREMAN_SUCCESS,
  c.GET_ALL_FOREMAN_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const createBlock = createAsyncAction(c.CREATE_BLOCK_REQUEST, c.CREATE_BLOCK_SUCCESS, c.CREATE_BLOCK_FAILURE)<
  IEffectPayload<IBlockFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getBlocksList = createAsyncAction(
  c.GET_BLOCK_LIST_REQUEST,
  c.GET_BLOCK_LIST_SUCCESS,
  c.GET_BLOCK_LIST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IPagingDocs<IBlockRow>, false>, IEffectPayload<null, false, IError>>()

// export const getBlockForeman = createAsyncAction(
//   c.GET_BLOCK_FOREMAN_REQUEST,
//   c.GET_BLOCK_FOREMAN_SUCCESS,
//   c.GET_BLOCK_FOREMAN_FAILURE,
// )<IEffectPayload<any, boolean>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const editBlock = createAsyncAction(c.EDIT_BLOCK_REQUEST, c.EDIT_BLOCK_SUCCESS, c.EDIT_BLOCK_FAILURE)<
  IEffectPayload<IBlockFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const deleteBlock = createAsyncAction(c.DELETE_BLOCK_REQUEST, c.DELETE_BLOCK_SUCCESS, c.DELETE_BLOCK_FAILURE)<
  IEffectPayload<string, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const detailBlock = createAsyncAction(c.DETAIL_BLOCK_REQUEST, c.DETAIL_BLOCK_SUCCESS, c.DETAIL_BLOCK_FAILURE)<
  IEffectPayload<string, true>,
  IEffectPayload<IBlockRow, false>,
  IEffectPayload<null, false, IError>
>()

export const getAllBlock = createAsyncAction(c.GET_ALL_BLOCK_REQUEST, c.GET_ALL_BLOCK_SUCCESS, c.GET_ALL_BLOCK_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IBlockRow[], false>,
  IEffectPayload<null, false, IError>
>()

export const clearFormBlockStatus = createAction(c.CREATE_OR_EDIT_BLOCK_CLEAR, clearAction)()
export const clearDeleteBlockStatus = createAction(c.DELETE_BLOCK_CLEAR, clearAction)()
