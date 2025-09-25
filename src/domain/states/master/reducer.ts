import {createReducer} from 'typesafe-actions'
import * as actions from '@domain/states/master/actions'
import {ActionsType} from '@domain/states/store'
import {IEffectAction, IEffectPayload} from '@domain/states/types'
import {IMinimumAKP, IProvince, IRangeBreakTime, IRangeYear, IUom} from '@models/eplant/Master'
import IStdEntity from '@app/models/commons/IStdEntity'

export interface IRSMaster {
  minimumAkp?: IEffectPayload<IMinimumAKP>
  provinces?: IEffectPayload<IProvince[]>
  uoms?: IEffectPayload<IUom[]>
  rangeYear?: IEffectPayload<IRangeYear>
  rangeBreakTime?: IEffectPayload<IRangeBreakTime>
  typeEmployees?: IEffectPayload<IStdEntity[]>
  supervisions?: IEffectPayload<IStdEntity[]>
  workStatuses?: IEffectPayload<IStdEntity[]>
}

const DEFAULT_STATE: IRSMaster = {}

const masterReducer = createReducer<IRSMaster, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [actions.getProvinces.request, actions.getProvinces.failure, actions.getProvinces.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data) {
        return {
          ...state,
          provinces: payload,
        }
      }
      return {
        ...state,
        provinces: {
          ...payload,
          data: state?.provinces?.data,
        },
      }
    },
  )
  .handleAction(
    [actions.getTypeEmployee.request, actions.getTypeEmployee.failure, actions.getTypeEmployee.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data) {
        return {
          ...state,
          typeEmployees: payload,
        }
      }
      return {
        ...state,
        typeEmployees: {
          ...payload,
          data: state?.typeEmployees?.data,
        },
      }
    },
  )
  .handleAction([actions.getUoms.request, actions.getUoms.failure, actions.getUoms.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data) {
      return {
        ...state,
        uoms: payload,
      }
    }
    return {
      ...state,
      uoms: {
        ...payload,
        data: state?.uoms?.data,
      },
    }
  })
  .handleAction(
    [actions.getSupervisions.request, actions.getSupervisions.failure, actions.getSupervisions.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data) {
        return {
          ...state,
          supervisions: payload,
        }
      }
      return {
        ...state,
        supervisions: {
          ...payload,
          data: state?.supervisions?.data,
        },
      }
    },
  )
  .handleAction(
    [actions.getWorkStatus.request, actions.getWorkStatus.failure, actions.getWorkStatus.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data) {
        return {
          ...state,
          workStatuses: payload,
        }
      }
      return {
        ...state,
        workStatuses: {
          ...payload,
          data: state?.workStatuses?.data,
        },
      }
    },
  )

  .handleAction(
    [actions.getRangeYear.request, actions.getRangeYear.failure, actions.getRangeYear.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data) {
        return {
          ...state,
          rangeYear: payload,
        }
      }
      return {
        ...state,
        rangeYear: {
          ...payload,
          data: state?.rangeYear?.data,
        },
      }
    },
  )

  .handleAction(
    [actions.getMinimumAkp.request, actions.getMinimumAkp.failure, actions.getMinimumAkp.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data) {
        return {
          ...state,
          minimumAkp: payload,
        }
      }
      return {
        ...state,
        minimumAkp: {
          ...payload,
          data: state?.minimumAkp?.data,
        },
      }
    },
  )

  .handleAction(
    [actions.getRangeBreakTime.request, actions.getRangeBreakTime.failure, actions.getRangeBreakTime.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      if (payload?.data) {
        return {
          ...state,
          rangeBreakTime: payload,
        }
      }
      return {
        ...state,
        rangeBreakTime: {
          ...payload,
          data: state?.rangeBreakTime?.data,
        },
      }
    },
  )
export default masterReducer
