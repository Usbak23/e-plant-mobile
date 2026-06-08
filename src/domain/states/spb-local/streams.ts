import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from './actions'
import {StreamType} from '@app/domain/states/types'

const getSpbLocalList: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getSpbLocalList.request)),
    switchMap(action =>
      from(api.spbLocalService.list(action.payload.data)).pipe(
        map(({data}: any) => actions.getSpbLocalList.success({loading: false, data: data.response})),
        catchError(error => of(actions.getSpbLocalList.failure({loading: false, error}))),
      ),
    ),
  )
}

const getSpbLocalDetail: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getSpbLocalDetail.request)),
    switchMap(action =>
      from(api.spbLocalService.detail(action.payload.data)).pipe(
        map(({data}: any) => actions.getSpbLocalDetail.success({loading: false, data: data.response})),
        catchError(error => of(actions.getSpbLocalDetail.failure({loading: false, error}))),
      ),
    ),
  )
}

const createSpbLocal: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createSpbLocal.request)),
    switchMap(action =>
      from(api.spbLocalService.create(action.payload.data)).pipe(
        concatMap(({data}: any) => [
          actions.createSpbLocal.success({loading: false, data: data.response}),
          actions.clearSpbLocalForm(),
        ]),
        catchError(error => of(actions.createSpbLocal.failure({loading: false, error}), actions.clearSpbLocalForm())),
      ),
    ),
  )
}

const updateSpbLocal: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.updateSpbLocal.request)),
    switchMap(action =>
      from(api.spbLocalService.update(action.payload.data.id, action.payload.data)).pipe(
        concatMap(({data}: any) => [
          actions.updateSpbLocal.success({loading: false, data: data.response}),
          actions.clearSpbLocalForm(),
        ]),
        catchError(error => of(actions.updateSpbLocal.failure({loading: false, error}), actions.clearSpbLocalForm())),
      ),
    ),
  )
}

const deleteSpbLocal: StreamType = (action$, _state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteSpbLocal.request)),
    switchMap(action =>
      from(api.spbLocalService.deleteSpbLocal(action.payload.data)).pipe(
        concatMap(({data}: any) => [
          actions.deleteSpbLocal.success({loading: false, data: data.response}),
          actions.clearSpbLocalDelete(),
        ]),
        catchError(error => of(actions.deleteSpbLocal.failure({loading: false, error}), actions.clearSpbLocalDelete())),
      ),
    ),
  )
}

export default [getSpbLocalList, getSpbLocalDetail, createSpbLocal, updateSpbLocal, deleteSpbLocal]
