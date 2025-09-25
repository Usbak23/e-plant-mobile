import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/role/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '../utils/clearAction'
import {IRoleRow} from '@app/models/eplant/Role'

export const getAllRole = createAsyncAction(c.GET_ALL_ROLE_REQUEST, c.GET_ALL_ROLE_SUCCESS, c.GET_ALL_ROLE_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IRoleRow[], false>,
  IEffectPayload<null, false, IError>
>()
