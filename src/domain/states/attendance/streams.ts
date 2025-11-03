import {map, catchError, filter, switchMap, concatMap, delay} from 'rxjs/operators'
import {EMPTY, from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/attendance/actions'
import {StreamType} from '@app/domain/states/types'
import {IAttendanceFileFormData, IAttendanceFormData} from '@app/models/eplant/Attendance'
import uuid from 'react-native-uuid'

const syncAttendances: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncAttendances)),
    concatMap(() => {
      const loading = state$?.value?.attendanceReducer.formAttendanceStatus?.loading
      const listTemporary = state$?.value?.attendanceReducer?.attendanceTemp || []
      const isConnected = state$?.value?.network.isConnected
      const allow = Boolean(isConnected && !loading && listTemporary.length > 0)
      if (!allow) {
        return EMPTY
      }
      const lastIndex = listTemporary.length - 1
      return [actions.createAttendanceManually.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const getAttendanceLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAttendanceList.request)),
    switchMap(action =>
      from(api.attendanceService.getAttendanceEmployeeList(action.payload.data)).pipe(
        map(({data}: any) => {
          return actions.getAttendanceList.success({loading: false, data: data.response})
        }),
        catchError(error => {
          return of(actions.getAttendanceList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const createAttendanceManually: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createAttendanceManually.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      if (!isConnected) {
        if (newData) {
          Object.assign(action.payload.data, {tempId: uuid.v4()})
        }
        return of(
          actions.createAttendanceTemporary(action.payload.data),
          actions.createAttendanceManually.success({
            loading: false,
            data: {
              //@ts-ignore
              data: {
                status: 'success',
                code: 200,
                response: action.payload.data,
              },
            },
          }),
          actions.clearFormAttendanceStatus(),
          // actions.clearFormRKHTakeCareStatus(), // <-- this is called before previous done. it is a "race condition"
          actions.syncAttendances(),
        )
      }

      return from(api.attendanceService.createAttendance(action.payload.data as IAttendanceFormData)).pipe(
        // delay(10000),
        concatMap((data: any) => {
          return [
            actions.deleteTemporaryAttendance(action.payload.data),
            actions.createAttendanceManually.success({loading: false, data}),
            actions.clearFormAttendanceStatus(),
            actions.syncAttendances(),
          ]
        }),
        catchError(error => {
          if (newData && error.message === 'Network Error') {
            return of(
              actions.createAttendanceManually.failure({loading: false, error}),
              actions.clearFormAttendanceStatus(),
            )
          }
          return of(
            actions.createAttendanceManually.failure({loading: false, error}),
            actions.clearFormAttendanceStatus(),
            actions.deleteTemporaryAttendance(action.payload.data),
          )
        }),
      )
    }),
  )
}

const uploadAttendanceFile: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.uploadAttendanceFile.request)),
    switchMap(action => {
      return from(api.attendanceService.uploadFileAttendance(action.payload.data as IAttendanceFileFormData)).pipe(
        concatMap((data: any) => [
          actions.uploadAttendanceFile.success({loading: false, data}),
          actions.clearFormAttendanceStatus(),
        ]),
        catchError(error => {
          return of(actions.uploadAttendanceFile.failure({loading: false, error}), actions.clearFormAttendanceStatus())
        }),
      )
    }),
  )
}

const deleteAttendanceEmployee: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteAttendanceEmployee.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return of(
          actions.deleteTemporaryAttendance(action.payload.data),
          actions.deleteAttendanceEmployee.success({
            loading: false,
            data: {
              //@ts-ignore
              data: {
                status: 'success',
                code: 200,
                response: action.payload.data,
              },
            },
          }),
          actions.clearDeleteAttendanceStatus(),
        )
      } else {
        return from(api.attendanceService.deleteAttendance(action.payload.data?.id as string)).pipe(
          concatMap((data: any) => [
            actions.deleteAttendanceEmployee.success({loading: false, data}),
            actions.clearDeleteAttendanceStatus(),
          ]),
          catchError(error =>
            of(
              actions.deleteAttendanceEmployee.failure({loading: false, error}),
              actions.clearDeleteAttendanceStatus(),
            ),
          ),
        )
      }
    }),
  )
}

const clearAttendanceDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearAttendanceDraft.request)),
    switchMap(() => {
      return of(actions.clearAttendanceDraft.success({loading: false, data: []}))
    }),
  )
}

export default [
  createAttendanceManually,
  uploadAttendanceFile,
  getAttendanceLists,
  deleteAttendanceEmployee,
  syncAttendances,
  clearAttendanceDraft,
]
