import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/item/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IItemDetail, IItemRow, IItemRowAll} from '@app/models/eplant/Item'

export interface IRSItem {
  formItemStatus?: IEffectPayload
  deleteItemStatus?: IEffectPayload
  itemAll?: IEffectPayload<IItemRowAll[]>
  itemList?: IEffectPayload<IPagingDocs<IItemRow>>
  itemDetail?: IEffectPayload<IItemDetail>
}

const DEFAULT_STATE = {}

const itemReducer = createReducer<IRSItem, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createItem.request,
      actions.createItem.failure,
      actions.createItem.success,
      actions.editItem.request,
      actions.editItem.failure,
      actions.editItem.success,
      actions.clearFormItemStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formItemStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.deleteItem.request, actions.deleteItem.failure, actions.deleteItem.success, actions.clearDeleteItemStatus],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteItemStatus: payload,
      }
    },
  )
  .handleAction([actions.getItemLists.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IItemRow[] = state?.itemList?.data?.docs || []
      return {
        ...state,
        itemList: {
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
      itemList: payload,
    }
  })
  .handleAction([actions.getItemLists.request, actions.getItemLists.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      itemList: {
        ...payload,
        data: state.itemList?.data,
      },
    }
  })
  .handleAction(
    [actions.getItemDetail.request, actions.getItemDetail.failure, actions.getItemDetail.success],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        itemDetail: payload,
      }
    },
  )
  .handleAction(
    [actions.getItemAll.request, actions.getItemAll.success, actions.getItemAll.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        itemAll: {
          data: state.itemAll?.data,
          ...payload,
        },
      }
    },
  )

export default itemReducer
