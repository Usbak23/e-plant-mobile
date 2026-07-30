import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/tonnage-garden/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {ITonnageGardenDetail, ITonnageGardenDraftOption, ITonnageGardenRow} from '@app/models/eplant/TonnageGarden'

export interface IRSTonnageGarden {
  formTonnageGardenStatus?: IEffectPayload
  deleteTonnageGardenStatus?: IEffectPayload
  tonnageGardenList?: IEffectPayload<IPagingDocs<ITonnageGardenRow>>
  tonnageGardenAll?: IEffectPayload<ITonnageGardenRow[]>
  tonnageGardenWithoutPKS?: IEffectPayload<ITonnageGardenRow[]>
  tonnageGardenDetail?: IEffectPayload<ITonnageGardenDetail>
  draftOptions?: IEffectPayload<ITonnageGardenDraftOption[]>
}

const DEFAULT_STATE = {}

const tonnageGardenReducer = createReducer<IRSTonnageGarden, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.uploadTonnageGarden.request,
      actions.uploadTonnageGarden.failure,
      actions.uploadTonnageGarden.success,
      actions.createTonnageGarden.request,
      actions.createTonnageGarden.failure,
      actions.createTonnageGarden.success,
      actions.updateTonnageGarden.success,
      actions.updateTonnageGarden.failure,
      actions.updateTonnageGarden.request,
      actions.clearFormTonnageGardenStatus,
    ],
    (state: IRSTonnageGarden, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formTonnageGardenStatus: payload,
      }
    },
  )

  .handleAction([actions.getTonnageGardenPaginated.success], (state: IRSTonnageGarden, action: any) => {
    const payload = (action as IEffectAction).payload
    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: ITonnageGardenRow[] = state?.tonnageGardenList?.data?.docs || []
      return {
        ...state,
        tonnageGardenList: {
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
      tonnageGardenList: {
        ...payload,
      },
    }
  })
  .handleAction(
    [actions.getTonnageGardenPaginated.request, actions.getTonnageGardenPaginated.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        tonnageGardenList: {
          ...payload,
          data: state.tonnageGardenList?.data,
        },
      }
    },
  )
  .handleAction([actions.getTonnageGardenAll.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      tonnageGardenAll: payload,
    }
  })
  .handleAction([actions.getTonnageGardenAll.request, actions.getTonnageGardenAll.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      tonnageGardenAll: {
        ...payload,
        data: state.tonnageGardenAll?.data,
      },
    }
  })
  .handleAction([actions.getTonnageGardenWithoutPKS.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      tonnageGardenWithoutPKS: payload,
    }
  })
  .handleAction(
    [actions.getTonnageGardenWithoutPKS.request, actions.getTonnageGardenWithoutPKS.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        tonnageGardenWithoutPKS: {
          ...payload,
          data: state.tonnageGardenWithoutPKS?.data,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getTonnageGardenDetail.request,
      actions.getTonnageGardenDetail.failure,
      actions.getTonnageGardenDetail.success,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        tonnageGardenDetail: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteTonnageGarden.request,
      actions.deleteTonnageGarden.failure,
      actions.deleteTonnageGarden.success,
      actions.clearDeleteTonnageGardenStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteTonnageGardenStatus: payload,
      }
    },
  )
  .handleAction(actions.getDraftOptions.request, (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      draftOptions: {
        ...payload,
        data: state.draftOptions?.data || [],  // jaga cache, jangan reset ke []
      },
    }
  })
  .handleAction(actions.getDraftOptions.failure, (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      draftOptions: {
        ...payload,
        data: state.draftOptions?.data,
      },
    }
  })
  .handleAction(actions.getDraftOptions.success, (state, action) => {
    const payload = (action as IEffectAction).payload
    const existing = state.draftOptions?.data || []
    const incoming = payload.data || []

    // Ambil tanggal-tanggal yang di-fetch dari incoming response
    // Untuk tanggal yang sama, buang cache lama karena mungkin ada yang sudah submitted
    const incomingDates = [...new Set(incoming.map((i: any) => {
      const d = new Date(i.date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }))]

    // Jika incoming kosong tapi ada payload.requestDate, buang cache untuk tanggal tersebut
    // (artinya semua draft untuk tanggal itu sudah submitted/tidak ada)
    const requestDate = (payload as any).requestDate
    if (requestDate) {
      incomingDates.push(requestDate)
    }

    // Simpan entry dari tanggal lain (offline cache), buang entry tanggal yang baru di-fetch
    const filtered = existing.filter((e: any) => {
      const d = new Date(e.date)
      const eDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      return !incomingDates.includes(eDate)
    })

    const merged = [...filtered, ...incoming]

    return {
      ...state,
      draftOptions: { ...payload, data: merged },
    }
  })

export default tonnageGardenReducer
