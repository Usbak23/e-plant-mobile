import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/request/actions'
import {StreamType} from '@app/domain/states/types'
import {IMyRequestForm} from '@app/models/eplant/MyRequest'
import {IProcessRequest} from '@app/models/eplant/Request'

const createMyRequest: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createMyRequest.request)),
    switchMap(action => {
      return from(api.requestService.createMyRequest(action.payload.data as IMyRequestForm)).pipe(
        concatMap((data: any) => {
          return [actions.createMyRequest.success({loading: false, data}), actions.clearFormMyRequest()]
        }),
        catchError(error => {
          return of(actions.createMyRequest.failure({loading: false, error}), actions.clearFormMyRequest())
        }),
      )
    }),
  )
}

const getMyRequestList: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMyRequestList.request)),
    switchMap(action =>
      from(api.requestService.getMyRequestPaginated(action.payload.data)).pipe(
        map(({data}: any) => actions.getMyRequestList.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getMyRequestList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const editMyRequest: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editMyRequest.request)),
    switchMap(action => {
      return from(api.requestService.editMyRequest(action.payload.data as IMyRequestForm)).pipe(
        concatMap((data: any) => [actions.editMyRequest.success({loading: false, data}), actions.clearFormMyRequest()]),
        catchError(error => of(actions.editMyRequest.failure({loading: false, error}), actions.clearFormMyRequest())),
      )
    }),
  )
}

const processRequest: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.processRequest.request)),
    switchMap(action => {
      return from(api.requestService.processRequest(action.payload.data as IProcessRequest)).pipe(
        concatMap((data: any) => [
          actions.processRequest.success({loading: false, data}),
          actions.clearProcessRequest(),
        ]),
        catchError(error => of(actions.processRequest.failure({loading: false, error}), actions.clearProcessRequest())),
      )
    }),
  )
}

const deleteMyRequest: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteMyRequest.request)),
    switchMap(action => {
      return from(api.requestService.deleteMyRequest(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteMyRequest.success({loading: false, data}),
          actions.clearDeleteMyRequestStatus(),
        ]),
        catchError(error =>
          of(actions.deleteMyRequest.failure({loading: false, error}), actions.clearDeleteMyRequestStatus()),
        ),
      )
    }),
  )
}

const getMyRequestDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getMyRequestDetail.request)),
    switchMap(action =>
      from(api.requestService.detailMyRequest(action.payload.data as string)).pipe(
        map(({data}: any) => actions.getMyRequestDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getMyRequestDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [createMyRequest, getMyRequestList, editMyRequest, deleteMyRequest, getMyRequestDetail, processRequest]
