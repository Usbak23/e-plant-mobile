import {createAsyncAction} from 'typesafe-actions'
import * as constants from '@app/domain/states/master/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IMinimumAKP, IProvince, IRangeBreakTime, IRangeYear, IUom} from '@app/models/eplant/Master'
import IStdEntity from '@app/models/commons/IStdEntity'

export const getMinimumAkp = createAsyncAction(
  constants.GET_MINIMUM_AKP_REQUEST,
  constants.GET_MINIMUM_AKP_SUCCESS,
  constants.GET_MINIMUM_AKP_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IMinimumAKP, false>, IEffectPayload<null, false, IError>>()

export const getProvinces = createAsyncAction(
  constants.GET_PROVINCES_REQUEST,
  constants.GET_PROVINCES_SUCCESS,
  constants.GET_PROVINCES_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IProvince[], false>, IEffectPayload<null, false, IError>>()

export const getUoms = createAsyncAction(
  constants.GET_UOM_REQUEST,
  constants.GET_UOM_SUCCESS,
  constants.GET_UOM_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IUom[], false>, IEffectPayload<null, false, IError>>()

export const getRangeYear = createAsyncAction(
  constants.GET_RANGE_YEAR_REQUEST,
  constants.GET_RANGE_YEAR_SUCCESS,
  constants.GET_RANGE_YEAR_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IRangeYear, false>, IEffectPayload<null, false, IError>>()

export const getRangeBreakTime = createAsyncAction(
  constants.GET_RANGE_BREAK_TIME_REQUEST,
  constants.GET_RANGE_BREAK_TIME_SUCCESS,
  constants.GET_RANGE_BREAK_TIME_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IRangeBreakTime, false>, IEffectPayload<null, false, IError>>()

export const getTypeEmployee = createAsyncAction(
  constants.GET_TYPE_EMPLOYEE_REQUEST,
  constants.GET_TYPE_EMPLOYEE_SUCCESS,
  constants.GET_TYPE_EMPLOYEE_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdEntity[], false>, IEffectPayload<null, false, IError>>()

export const getSupervisions = createAsyncAction(
  constants.GET_SUPERVISIONS_REQUEST,
  constants.GET_SUPERVISIONS_SUCCESS,
  constants.GET_SUPERVISIONS_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdEntity[], false>, IEffectPayload<null, false, IError>>()

export const getWorkStatus = createAsyncAction(
  constants.GET_WORK_STATUS_REQUEST,
  constants.GET_WORK_STATUS_SUCCESS,
  constants.GET_WORK_STATUS_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdEntity[], false>, IEffectPayload<null, false, IError>>()
