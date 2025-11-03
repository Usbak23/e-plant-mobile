import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/attendance/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IAttendance, IAttendanceFormData, IAttendanceOffline} from '@app/models/eplant/Attendance'

export interface IRSAttendance {
  attendanceList?: IEffectPayload<IAttendance>
  attendanceTemp?: IAttendanceFormData[]
  formAttendanceStatus?: IEffectPayload
  deleteAttendanceStatus?: IEffectPayload
}

const DEFAULT_STATE = {}

const attendanceReducer = createReducer<IRSAttendance, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createAttendanceManually.request,
      actions.createAttendanceManually.failure,
      actions.createAttendanceManually.success,
      actions.uploadAttendanceFile.request,
      actions.uploadAttendanceFile.failure,
      actions.uploadAttendanceFile.success,
      actions.clearFormAttendanceStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formAttendanceStatus: payload,
      }
    },
  )
  .handleAction([actions.getAttendanceList.request, actions.getAttendanceList.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      attendanceList: {
        ...payload,
        data: state.attendanceList?.data,
      },
    }
  })
  .handleAction([actions.getAttendanceList.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      attendanceList: payload,
    }
  })
  .handleAction(
    [
      actions.deleteAttendanceEmployee.request,
      actions.deleteAttendanceEmployee.success,
      actions.deleteAttendanceEmployee.failure,
      actions.clearDeleteAttendanceStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteAttendanceStatus: payload,
      }
    },
  )
  .handleType(actions.createAttendanceTemporary, (state: IRSAttendance, action: any) => {
    const payload = action.payload
    const found = state.attendanceTemp?.find((e: IAttendanceFormData) => e.tempId === payload.tempId)
    if (found) {
      state.attendanceTemp = state.attendanceTemp?.map((e: IAttendanceFormData) =>
        e.tempId === payload.tempId ? {...e, ...payload} : e,
      )
      return {
        ...state,
      }
    }
    return {
      ...state,
      attendanceTemp: [payload, ...(state?.attendanceTemp || [])],
    }
  })
  .handleType(actions.deleteTemporaryAttendance, (state: IRSAttendance, action: any) => {
    const payload = action.payload
    state.attendanceTemp = state.attendanceTemp?.filter((e: IAttendanceFormData) => e.tempId !== payload.tempId)
    return {
      ...state,
    }
  })
  .handleType(
    [actions.clearAttendanceDraft.request, actions.clearAttendanceDraft.success, actions.clearAttendanceDraft.failure],
    (state: IRSAttendance, action: any) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        attendanceTemp: [],
      }
    },
  )

export default attendanceReducer
