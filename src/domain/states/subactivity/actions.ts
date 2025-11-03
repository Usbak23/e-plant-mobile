import {createAsyncAction} from 'typesafe-actions'
import * as c from '@app/domain/states/subactivity/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {ISubActivity} from '@app/models/eplant/SubActivity'

export const getSubActivityAll = createAsyncAction(
  c.GET_SUBACTIVITY_ALL_REQUEST,
  c.GET_SUBACTIVITY_ALL_SUCCESS,
  c.GET_SUBACTIVITY_ALL_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<ISubActivity[], false>, IEffectPayload<null, false, IError>>()
