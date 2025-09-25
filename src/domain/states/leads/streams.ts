import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/leads/actions'
import {StreamType} from '@app/domain/states/types'
import {ILeadFormData} from '@app/models/crm/Lead'
import uuid from 'react-native-uuid'

const syncLeads: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncLeads)),
    concatMap(() => {
      const loading = state$?.value?.lead.formLeadStatus?.loading
      const isConnected = state$?.value?.network.isConnected
      const listTemporary = state$?.value?.lead?.leadListTemp || []
      const allow = Boolean(isConnected && !loading && listTemporary.length > 0)
      if (!allow) {
        return EMPTY
      }
      const lastIndex = listTemporary.length - 1
      return [actions.createLead.request({loading: true, data: listTemporary[lastIndex]})]
    }),
  )
}

const createLead: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createLead.request)),
    switchMap(action => {
      const newData = !action.payload.data?.method
      if (newData) {
        Object.assign(action.payload.data, {tempId: uuid.v4(), method: 'ADD'})
        return of(actions.addLeadTemp(action.payload.data), actions.syncLeads())
      }
      return from(api.leadService.createLead(action.payload.data as ILeadFormData)).pipe(
        concatMap((data: any) => [
          actions.getLeadLists.request({loading: true, data: {page: 1, limit: 10}}),
          actions.deleteLeadTemp(action.payload.data),
          actions.createLead.success({loading: false, data}),
          actions.clearFormLeadStatus(),
          actions.syncLeads(),
        ]),
        catchError(error => {
          if (newData) {
            Object.assign(action.payload.data, {tempId: uuid.v4(), method: 'ADD'})
            return of(actions.addLeadTemp(action.payload.data))
          }
          return of(actions.createLead.failure({loading: false, error}), actions.clearFormLeadStatus())
        }),
      )
    }),
  )
}

const editLead: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editLead.request)),
    switchMap(action => {
      return from(api.leadService.editLead(action.payload.data as ILeadFormData)).pipe(
        concatMap((data: any) => [
          actions.getLeadLists.request({loading: true, data: {page: 1, limit: 10}}),
          actions.editLead.success({loading: false, data}),
          actions.clearFormLeadStatus(),
        ]),
        catchError(error => of(actions.editLead.failure({loading: false, error}), actions.clearFormLeadStatus())),
      )
    }),
  )
}

const deleteLeads: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteLeads.request)),
    switchMap(action => {
      return from(api.leadService.deleteLeads(action.payload.data as string[])).pipe(
        concatMap(data => [actions.deleteLeads.success({loading: false, data}), actions.clearDeleteLeadStatus()]),
        catchError(error => of(actions.deleteLeads.failure({loading: false, error}), actions.clearDeleteLeadStatus())),
      )
    }),
  )
}
const getLeadLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getLeadLists.request)),
    switchMap(action =>
      from(api.leadService.getLeadLists(action.payload.data)).pipe(
        map(({data}: any) => actions.getLeadLists.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getLeadLists.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [createLead, editLead, deleteLeads, getLeadLists, syncLeads]
