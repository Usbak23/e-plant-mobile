import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/field-report/actions'
import {StreamType} from '@app/domain/states/types'

const createFieldReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createFieldReport.request)),
    switchMap(action => {
      return from(api.fieldReportService.createFieldReport(action.payload.data)).pipe(
        concatMap((data: any) => {
          return [actions.createFieldReport.success({loading: false, data}), actions.clearFormFieldReport()]
        }),
        catchError(error => {
          return of(actions.createFieldReport.failure({loading: false, error}), actions.clearFormFieldReport())
        }),
      )
    }),
  )
}

const getFieldReportList: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getFieldReportList.request)),
    switchMap(action =>
      from(api.fieldReportService.getFieldReportPaginated(action.payload.data)).pipe(
        map(({data}: any) => actions.getFieldReportList.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getFieldReportList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const editFieldReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editFieldReport.request)),
    switchMap(action => {
      return from(api.fieldReportService.editFieldReport(action.payload.data)).pipe(
        concatMap((data: any) => [
          actions.editFieldReport.success({loading: false, data}),
          actions.clearFormFieldReport(),
        ]),
        catchError(error =>
          of(actions.editFieldReport.failure({loading: false, error}), actions.clearFormFieldReport()),
        ),
      )
    }),
  )
}

const deleteFieldReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteFieldReport.request)),
    switchMap(action => {
      return from(api.fieldReportService.deleteFieldReport(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteFieldReport.success({loading: false, data}),
          actions.clearDeleteFieldReportStatus(),
        ]),
        catchError(error =>
          of(actions.deleteFieldReport.failure({loading: false, error}), actions.clearDeleteFieldReportStatus()),
        ),
      )
    }),
  )
}

const detailFieldReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.detailFieldReport.request)),
    switchMap(action =>
      from(api.fieldReportService.detailFieldReport(action.payload.data as string)).pipe(
        map(({data}: any) => actions.detailFieldReport.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.detailFieldReport.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const deleteFileFieldReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteFileFieldReport.request)),
    switchMap(action => {
      return from(api.fieldReportService.deleteFileFieldReport(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteFileFieldReport.success({loading: false, data}),
          actions.clearDeleteFileFieldReportStatus(),
        ]),
        catchError(error =>
          of(
            actions.deleteFileFieldReport.failure({loading: false, error}),
            actions.clearDeleteFileFieldReportStatus(),
          ),
        ),
      )
    }),
  )
}

export default [
  createFieldReport,
  getFieldReportList,
  editFieldReport,
  deleteFieldReport,
  detailFieldReport,
  deleteFileFieldReport,
]
