import IPagingDocs from '@app/models/commons/IPagingDocs'
import {ITaxationHaRealization, ITaxationRow} from '@app/models/eplant/Taxation'
import {IEffectAction, IEffectPayload} from '../types'
import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/taxation/actions'
import {ActionsType} from '@app/domain/states/store'

export interface IRSTaxation {
  taxationPaginated?: IEffectPayload<IPagingDocs<ITaxationRow>>
  formTaxationStatus?: IEffectPayload
  deleteTaxationStatus?: IEffectPayload
  taxationHaRealization?: IEffectPayload<ITaxationHaRealization>
  taxationHaRealizationDetail?: IEffectPayload<ITaxationHaRealization>
}

const DEFAULT_STATE = {}

const taxationReducer = createReducer<IRSTaxation, ActionsType>(DEFAULT_STATE)
  .handleAction([actions.getTaxationPaginated.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: ITaxationRow[] = state?.taxationPaginated?.data?.docs || []
      return {
        ...state,
        taxationPaginated: {
          ...payload,
          data: {
            ...payload.data,
            docs: [...prevDocs, ...payload.data.docs],
          },
        },
      }
    }
    return {
      ...state,
      taxationPaginated: payload,
    }
  })

  .handleAction([actions.getHaRealizationTaxation.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      taxationHaRealization: payload,
    }
  })
  .handleAction(
    [actions.getHaRealizationTaxation.request, actions.getHaRealizationTaxation.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        taxationHaRealization: {
          ...payload,
          data: state.taxationHaRealization?.data,
        },
      }
    },
  )

  .handleAction([actions.getHaRealizationTaxationDetail.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      taxationHaRealizationDetail: payload,
    }
  })
  .handleAction(
    [actions.getHaRealizationTaxationDetail.request, actions.getHaRealizationTaxationDetail.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        taxationHaRealizationDetail: {
          ...payload,
          data: state.taxationHaRealizationDetail?.data,
        },
      }
    },
  )

  .handleAction([actions.getTaxationPaginated.request, actions.getTaxationPaginated.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      taxationPaginated: {
        ...payload,
        data: state.taxationPaginated?.data,
      },
    }
  })

  .handleAction(
    [
      actions.createTaxation.request,
      actions.createTaxation.failure,
      actions.createTaxation.success,
      actions.editTaxation.request,
      actions.editTaxation.failure,
      actions.editTaxation.success,
      actions.clearFormTaxationStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formTaxationStatus: payload,
      }
    },
  )

  .handleAction(
    [
      actions.deleteTaxation.request,
      actions.deleteTaxation.failure,
      actions.deleteTaxation.success,
      actions.clearDeleteTaxationStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteTaxationStatus: payload,
      }
    },
  )

export default taxationReducer
