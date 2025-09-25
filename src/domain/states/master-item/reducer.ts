import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/master-item/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IMasterItemDetail, IMasterItemRow, IMasterItemRowAll} from '@app/models/eplant/MasterItem'

export interface IRSMasterItem {
  formMasterItemStatus?: IEffectPayload
  deleteMasterItemStatus?: IEffectPayload
  masterItemAll?: IEffectPayload<IMasterItemRowAll[]>
  masterItemList?: IEffectPayload<IPagingDocs<IMasterItemRow>>
  masterItemDetail?: IEffectPayload<IMasterItemDetail>
}

const DEFAULT_STATE = {}

const masterItemReducer = createReducer<IRSMasterItem, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createMasterItem.request,
      actions.createMasterItem.failure,
      actions.createMasterItem.success,
      actions.editMasterItem.request,
      actions.editMasterItem.failure,
      actions.editMasterItem.success,
      actions.clearFormMasterItemStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formMasterItemStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteMasterItem.request,
      actions.deleteMasterItem.failure,
      actions.deleteMasterItem.success,
      actions.clearDeleteMasterItemStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteMasterItemStatus: payload,
      }
    },
  )
  .handleAction([actions.getMasterItemLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IMasterItemRow[] = state?.masterItemList?.data?.docs || []
      return {
        ...state,
        masterItemList: {
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
      masterItemList: payload,
    }
  })
  .handleAction([actions.getMasterItemLists.request, actions.getMasterItemLists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      masterItemList: {
        ...payload,
        data: state.masterItemList?.data,
      },
    }
  })
  .handleAction(
    [actions.getMasterItemDetail.request, actions.getMasterItemDetail.failure, actions.getMasterItemDetail.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        masterItemDetail: payload,
      }
    },
  )
  .handleAction(
    [actions.getMasterItemAll.request, actions.getMasterItemAll.success, actions.getMasterItemAll.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        masterItemAll: {
          data: state.masterItemAll?.data,
          ...payload,
        },
      }
    },
  )

export default masterItemReducer
