import {createAsyncAction} from 'typesafe-actions'
import * as c from '@app/domain/states/rkh-harvest/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IRKHHarvestAllRow} from '@app/models/eplant/RKHHarvest'

export const getRKHHarvestAll = createAsyncAction(
  c.GET_ALL_RKH_HARVEST_REQUEST,
  c.GET_ALL_RKH_HARVEST_SUCCESS,
  c.GET_ALL_RKH_HARVEST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IRKHHarvestAllRow, false>, IEffectPayload<null, false, IError>>()
