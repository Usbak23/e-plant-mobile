import {IEffectAction, IEffectPayload} from '../types'
import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/census/actions'
import {ActionsType} from '@app/domain/states/store'
import {ICensusDetail, ICensusRow} from '@app/models/eplant/Census'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export interface IRSCensus {
  formCensusStatus?: IEffectPayload
  censusList?: IEffectPayload<IPagingDocs<ICensusRow>>
  censusDetail?: IEffectPayload<ICensusDetail>
  deleteCensusStatus?: IEffectPayload
}

const DEFAULT_STATE = {}

const censusReducer = createReducer<IRSCensus, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createCensus.request,
      actions.createCensus.failure,
      actions.createCensus.success,
      actions.editCensus.request,
      actions.editCensus.failure,
      actions.editCensus.success,
      actions.clearFormCensusStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formCensusStatus: payload,
      }
    },
  )
  .handleAction([actions.getCensusLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: ICensusRow[] = state?.censusList?.data?.docs || []
      return {
        ...state,
        censusList: {
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
      censusList: payload,
    }
  })
  .handleAction([actions.getCensusLists.request, actions.getCensusLists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      censusList: {
        ...payload,
        data: state.censusList?.data,
      },
    }
  })
  .handleAction(
    [actions.getCensusDetail.request, actions.getCensusDetail.failure, actions.getCensusDetail.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        censusDetail: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteCensus.request,
      actions.deleteCensus.failure,
      actions.deleteCensus.success,
      actions.clearFormDeleteStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteCensusStatus: payload,
      }
    },
  )

export default censusReducer
