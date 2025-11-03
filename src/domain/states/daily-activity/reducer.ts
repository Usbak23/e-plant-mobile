import {IEffectAction, IEffectPayload} from '../types'
import {createReducer} from 'typesafe-actions'
import {ActionsType} from '../store'
import * as actions from './actions'
import {IDailyActivity} from '@app/models/eplant/IDailyActivity'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export interface IRDailyActivity {
  formDailyActivityStatus?: IEffectPayload
  dailyActivityList?: IEffectPayload<IPagingDocs<IDailyActivity>>
  deleteDailyActivityStatus?: IEffectPayload
}

const DEFAULT_STATE = {}

const dailyActivityReducer = createReducer<IRDailyActivity, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createDailyActivity.request,
      actions.createDailyActivity.failure,
      actions.createDailyActivity.success,
      actions.editDailyActivity.request,
      actions.editDailyActivity.failure,
      actions.editDailyActivity.success,
      actions.clearFormDailyActivity,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formDailyActivityStatus: payload,
      }
    },
  )
  .handleAction([actions.getDailyActivityList.success], (state, action) => {
    const payload = (action as IEffectAction).payload

    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IDailyActivity[] = state?.dailyActivityList?.data?.docs || []
      return {
        ...state,
        dailyActivityList: {
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
      dailyActivityList: payload,
    }
  })
  .handleAction([actions.getDailyActivityList.request, actions.getDailyActivityList.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      dailyActivityList: {
        ...payload,
        data: state.dailyActivityList?.data,
      },
    }
  })
  .handleAction(
    [
      actions.deleteDailyActivity.request,
      actions.deleteDailyActivity.success,
      actions.deleteDailyActivity.failure,
      actions.clearDeleteDailyActivityStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteDailyActivityStatus: payload,
      }
    },
  )

export default dailyActivityReducer
