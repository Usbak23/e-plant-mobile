import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/organization/actions'
import {StreamType} from '@app/domain/states/types'
import {IOrganizationFormData} from '@app/models/eplant/Organization'

const createOrganization: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createOrganization.request)),
    switchMap(action => {
      return from(api.organizationService.createOrganization(action.payload.data as IOrganizationFormData)).pipe(
        concatMap((data: any) => [
          actions.createOrganization.success({loading: false, data}),
          actions.clearFormOrganizationStatus(),
        ]),
        catchError(error => {
          return of(actions.createOrganization.failure({loading: false, error}), actions.clearFormOrganizationStatus())
        }),
      )
    }),
  )
}

const editOrganization: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editOrganization.request)),
    switchMap(action => {
      return from(api.organizationService.editOrganization(action.payload.data as IOrganizationFormData)).pipe(
        concatMap((data: any) => {
          return [actions.editOrganization.success({loading: false, data}), actions.clearFormOrganizationStatus()]
        }),
        catchError(error =>
          of(actions.editOrganization.failure({loading: false, error}), actions.clearFormOrganizationStatus()),
        ),
      )
    }),
  )
}

const deleteOrganization: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteOrganization.request)),
    switchMap(action => {
      return from(api.organizationService.deleteOrganization(action.payload.data as string)).pipe(
        concatMap(data => [
          actions.deleteOrganization.success({loading: false, data}),
          actions.clearDeleteOrganizationStatus(),
        ]),
        catchError(error =>
          of(actions.deleteOrganization.failure({loading: false, error}), actions.clearDeleteOrganizationStatus()),
        ),
      )
    }),
  )
}
const getOrganizationLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getOrganizationLists.request)),
    switchMap(action =>
      from(api.organizationService.getOrganizationLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getOrganizationLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getOrganizationLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getOrganizationDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getOrganizationDetail.request)),
    switchMap(action =>
      from(api.organizationService.getOrganizationDetail(action.payload.data)).pipe(
        map(({data}: any) => actions.getOrganizationDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getOrganizationDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getOrganizationAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getOrganizationAll.request)),
    switchMap(action =>
      from(api.organizationService.getOrganizationAll(action.payload.data)).pipe(
        concatMap(({data}: any) => {
          if (action?.payload?.next) {
            return [actions.getOrganizationAll.success({loading: false, data: data.response}), action?.payload?.next]
          }
          return [actions.getOrganizationAll.success({loading: false, data: data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getOrganizationAll.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getOrganizationAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const clearAllOrganization: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearOrganizationAll)),
    concatMap(() => {
      return [actions.clearOrganizationAll()]
    }),
  )
}

export default [
  createOrganization,
  editOrganization,
  deleteOrganization,
  getOrganizationLists,
  getOrganizationAll,
  getOrganizationDetail,
  clearAllOrganization,
]
