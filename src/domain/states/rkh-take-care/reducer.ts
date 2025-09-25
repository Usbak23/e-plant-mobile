import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/rkh-take-care/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IRKHTakeCareDetail, IRKHTakeCareRow, IRKHTakeCareFormData} from '@app/models/eplant/RKHTakeCare'
import moment from 'moment'
import itemReducer from '../item/reducer'

export interface IRSRKHTakeCare {
  formRKHTakeCareStatus?: IEffectPayload
  deleteRKHTakeCareStatus?: IEffectPayload
  rkhTakeCareList?: IEffectPayload<IPagingDocs<IRKHTakeCareRow>>
  rkhTakeCareListTemp?: IRKHTakeCareFormData[]
  rkhTakeCareDetail?: IEffectPayload<IRKHTakeCareDetail>
}

const DEFAULT_STATE = {}

const rkhTakeCareReducer = createReducer<IRSRKHTakeCare, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createRKHTakeCare.request,
      actions.createRKHTakeCare.failure,
      actions.createRKHTakeCare.success,
      actions.editRKHTakeCare.request,
      actions.editRKHTakeCare.failure,
      actions.editRKHTakeCare.success,
      actions.clearFormRKHTakeCareStatus,
    ],
    (state: IRSRKHTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formRKHTakeCareStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteRKHTakeCare.request,
      actions.deleteRKHTakeCare.failure,
      actions.deleteRKHTakeCare.success,
      actions.clearDeleteRKHTakeCareStatus,
    ],
    (state: IRSRKHTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteRKHTakeCareStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getRKHTakeCareDetail.request, actions.getRKHTakeCareDetail.failure, actions.getRKHTakeCareDetail.success],
    (state: IRSRKHTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rkhTakeCareDetail: payload,
      }
    },
  )

  .handleAction([actions.getRKHTakeCareAll.success], (state: IRSRKHTakeCare, action: any) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      rkhTakeCareList: {
        ...payload,
      },
    }
  })
  .handleAction(
    [actions.getRKHTakeCareAll.request, actions.getRKHTakeCareAll.failure],
    (state: IRSRKHTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rkhTakeCareList: {
          ...payload,
          data: state.rkhTakeCareList?.data,
        },
      }
    },
  )
  .handleType(actions.addRKHTakeCareTemp, (state: IRSRKHTakeCare, action: any) => {
    const payload = action.payload
    payload.status = 'open'

    const allDraft = state.rkhTakeCareListTemp?.filter((r: any) => r.tempId !== payload.tempId) || []
    const allOnline = state?.rkhTakeCareList?.data?.docs || []

    // block, subAktivitas yang sama
    const allSame = [...allDraft, ...allOnline].filter((rkh: any) => {
      const isSameBlock = rkh?.block?.id == payload?.blockId
      const isSameSubAct = rkh?.subActivity?.id == payload?.subActivityId
      return isSameBlock && isSameSubAct && rkh?.category == 'Rawat'
    })

    allSame.sort((a: any, b: any) => {
      return (new Date(a.rkh?.dateRkh) as any) - (new Date(b.rkh?.dateRkh) as any)
    })

    let currentToAdd = parseFloat(payload.totalPlanHectare)
    allSame.forEach((rkh: any) => {
      const isAfter = moment(rkh.rkh.dateRkh).isAfter(moment(payload.rkh?.dateRkh))
      if (isAfter) {
        rkh.realizationToThisDay = currentToAdd
        rkh.totalPlanHectare = currentToAdd + parseFloat(`${rkh.hectaresTomorrow}`)
        rkh.planHectareArea = currentToAdd + parseFloat(`${rkh.hectaresTomorrow}`)
        rkh.status = 'open'
        currentToAdd = currentToAdd + parseFloat(`${rkh.hectaresTomorrow}`)
      }
    })

    if (payload.realizationToThisDay == 0) {
      allSame.forEach((rkh: any) => {
        const isBefore = moment(rkh.rkh.dateRkh).isBefore(moment(payload.rkh?.dateRkh))
        if (isBefore) {
          rkh.status = 'close'
        }
      })
    }

    allDraft.forEach((rkh: any) => {
      const isFound = allSame.find((rkhSame: any) => {
        return rkhSame.tempId == rkh.tempId && rkhSame.id == undefined
      })
      if (isFound) {
        rkh = isFound
      }
    })

    allOnline.forEach((rkh: any) => {
      const isFound = allSame.find((rkhSame: any) => {
        return rkhSame.id == rkh.id
      })
      if (isFound) {
        rkh = isFound
      }
    })

    return {
      ...state,
      rkhTakeCareList: {
        ...state.rkhTakeCareList,
        data: {
          ...state.rkhTakeCareList?.data,
          docs: allOnline,
        },
      },
      rkhTakeCareListTemp: [payload, ...(allDraft || [])],
    }
  })
  .handleType(actions.deleteRKHTakeCareTemp, (state: IRSRKHTakeCare, action: any) => {
    const payload = action.payload
    payload.status = 'open'

    const allDraft =
      state.rkhTakeCareListTemp?.filter((r: any) => {
        return r?.tempId != payload?.tempId
      }) || []
    const allOnline = state?.rkhTakeCareList?.data?.docs || []

    // block, subAktivitas yang sama
    const allSame = [...allDraft, ...allOnline].filter((rkh: any) => {
      const isSameBlock = rkh?.block?.id == payload?.blockId
      const isSameSubAct = rkh?.subActivity?.id == payload?.subActivityId
      return isSameBlock && isSameSubAct && rkh?.category == 'Rawat'
    })

    allSame.sort((a: any, b: any) => {
      return (new Date(a.rkh?.dateRkh) as any) - (new Date(b.rkh?.dateRkh) as any)
    })

    let currentToAdd = parseFloat(payload.realizationToThisDay)
    allSame.forEach((rkh: any) => {
      const isAfter = moment(rkh.rkh.dateRkh).isAfter(moment(payload.rkh?.dateRkh))
      if (isAfter) {
        rkh.realizationToThisDay = currentToAdd
        rkh.totalPlanHectare = currentToAdd + parseFloat(`${rkh.hectaresTomorrow}`)
        rkh.planHectareArea = currentToAdd + parseFloat(`${rkh.hectaresTomorrow}`)
        rkh.status = 'open'
        currentToAdd = currentToAdd + parseFloat(`${rkh.hectaresTomorrow}`)
      }
    })

    if (payload.realizationToThisDay == 0) {
      const isHaveOtherData =
        allSame.filter((rkh: any) => {
          const isAfter = moment(rkh?.rkh?.dateRkh).isAfter(moment(payload.rkh?.dateRkh))
          return isAfter
        }).length != 0
      if (!isHaveOtherData) {
        allSame.forEach((rkh: any) => {
          const isBefore = moment(rkh.rkh.dateRkh).isBefore(moment(payload.rkh?.dateRkh))
          if (isBefore) {
            rkh.status = 'open'
          }
        })
      }
    }

    allDraft.forEach((rkh: any) => {
      const isFound = allSame.find((rkhSame: any) => {
        return rkhSame.tempId == rkh.tempId && rkhSame.id == undefined
      })
      if (isFound) {
        rkh = isFound
      }
    })

    allOnline.forEach((rkh: any) => {
      const isFound = allSame.find((rkhSame: any) => {
        return rkhSame.id == rkh.id
      })
      if (isFound) {
        rkh = isFound
      }
    })

    return {
      ...state,
      rkhTakeCareList: {
        ...state.rkhTakeCareList,
        data: {
          ...state.rkhTakeCareList?.data,
          docs: [...allOnline],
        },
      },
      rkhTakeCareListTemp: [...(allDraft || [])],
    }
  })
  .handleType(
    [
      actions.clearRkhTakeCareDraft.request,
      actions.clearRkhTakeCareDraft.success,
      actions.clearRkhTakeCareDraft.failure,
    ],
    (state: IRSRKHTakeCare, action: any) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        rkhTakeCareListTemp: [],
      }
    },
  )

export default rkhTakeCareReducer
