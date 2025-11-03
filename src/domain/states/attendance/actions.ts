import {createAction, createAsyncAction} from 'typesafe-actions'
import * as c from '@app/domain/states/attendance/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IAttendance, IAttendanceFileFormData, IAttendanceFormData} from '@app/models/eplant/Attendance'
import IStdResponse from '@app/models/commons/IStdResponse'
import clearAction from '../utils/clearAction'

export const createAttendanceManually = createAsyncAction(
  c.CREATE_ATTENDANCE_MANUAL_REQUEST,
  c.CREATE_ATTENDANCE_MANUAL_SUCCESS,
  c.CREATE_ATTENDANCE_MANUAL_FAILURE,
)<IEffectPayload<IAttendanceFormData, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const uploadAttendanceFile = createAsyncAction(
  c.CREATE_ATTENDANCE_UPLOAD_REQUEST,
  c.CREATE_ATTENDANCE_UPLOAD_SUCCESS,
  c.CREATE_ATTENDANCE_UPLOAD_FAILURE,
)<
  IEffectPayload<IAttendanceFileFormData, true>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getAttendanceList = createAsyncAction(
  c.GET_ATTENDANCE_LIST_REQUEST,
  c.GET_ATTENDANCE_LIST_SUCCESS,
  c.GET_ATTENDANCE_LIST_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IAttendance, false>, IEffectPayload<null, false, IError>>()

export const deleteAttendanceEmployee = createAsyncAction(
  c.DELETE_ATTENDANCE_REQUEST,
  c.DELETE_ATTENDANCE_SUCCESS,
  c.DELETE_ATTENDANCE_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const clearAttendanceDraft = createAsyncAction(
  c.CLEAR_DRAFT_ATTENDANCE_REQUEST,
  c.CLEAR_DRAFT_ATTENDANCE_SUCCESS,
  c.CLEAR_DRAFT_ATTENDANCE_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<any, false>, IEffectPayload<null, false, IError>>()

export const createAttendanceTemporary = createAction(c.CREATE_ATTENDANCE_TEMPORARY, payload => payload)()
export const clearFormAttendanceStatus = createAction(c.CREATE_OR_EDIT_ATTENDANCE_CLEAR, clearAction)()
export const clearDeleteAttendanceStatus = createAction(c.DELETE_ATTENDANCE_CLEAR, clearAction)()
export const syncAttendances = createAction(c.SYNC_ATTENDANCES)()
export const deleteTemporaryAttendance = createAction(c.DELETE_TEMPORARY_ATTENDANCE, payload => payload)()
