import {Epic} from 'redux-observable'
import {from, of} from 'rxjs'
import {catchError, map, switchMap, filter} from 'rxjs/operators'
import {isActionOf} from 'typesafe-actions'
import {ActionsType, RootStateType} from '@domain/states/store'
import * as actions from '@domain/states/approval/actions'
import ApprovalService from '@domain/services/eplant/ApprovalService'

const getPendingApprovalsStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$, {config}) =>
  action$.pipe(
    filter(isActionOf(actions.getPendingApprovals.request)),
    switchMap(action => {
      const approvalService = new ApprovalService(config)
      return from(approvalService.getPendingApprovals()).pipe(
        map(response => {
          return actions.getPendingApprovals.success({loading: false, data: response.data.response})
        }),
        catchError(error => {
          return of(actions.getPendingApprovals.failure({loading: false, error}))
        }),
      )
    }),
  )

const approveRktStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$, {config}) =>
  action$.pipe(
    filter(isActionOf(actions.approveRkt.request)),
    switchMap(action => {
      if (!action.payload.data) {
        return of(actions.approveRkt.failure({loading: false, error: new Error('Missing data')}))
      }
      const approvalService = new ApprovalService(config)
      return from(approvalService.approveRkt(action.payload.data)).pipe(
        map(response => actions.approveRkt.success({loading: false, data: response.data.response})),
        catchError(error => of(actions.approveRkt.failure({loading: false, error}))),
      )
    }),
  )

const rejectRktStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$, {config}) =>
  action$.pipe(
    filter(isActionOf(actions.rejectRkt.request)),
    switchMap(action => {
      if (!action.payload.data) {
        return of(actions.rejectRkt.failure({loading: false, error: new Error('Missing data')}))
      }
      const approvalService = new ApprovalService(config)
      return from(approvalService.rejectRkt(action.payload.data)).pipe(
        map(response => actions.rejectRkt.success({loading: false, data: response.data.response})),
        catchError(error => of(actions.rejectRkt.failure({loading: false, error}))),
      )
    }),
  )

export default [getPendingApprovalsStream, approveRktStream, rejectRktStream]