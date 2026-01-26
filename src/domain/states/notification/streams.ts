import {Epic} from 'redux-observable'
import {from, of} from 'rxjs'
import {catchError, map, switchMap, filter} from 'rxjs/operators'
import {isActionOf} from 'typesafe-actions'
import {ActionsType, RootStateType} from '@domain/states/store'
import * as actions from '@domain/states/notification/actions'
import NotificationService from '@domain/services/eplant/NotificationService'

const getNotificationsStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$, {config}) =>
  action$.pipe(
    filter(isActionOf(actions.getNotifications.request)),
    switchMap(action => {
      const notificationService = new NotificationService(config)
      const limit = action.payload.data?.limit || 50
      return from(notificationService.getNotifications(limit)).pipe(
        map(response => {
          return actions.getNotifications.success({loading: false, data: response.data.response})
        }),
        catchError(error => {
          return of(actions.getNotifications.failure({loading: false, error}))
        }),
      )
    }),
  )

const getUnreadCountStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$, {config}) =>
  action$.pipe(
    filter(isActionOf(actions.getUnreadCount.request)),
    switchMap(action => {
      const notificationService = new NotificationService(config)
      return from(notificationService.getUnreadCount()).pipe(
        map(response => {
          return actions.getUnreadCount.success({loading: false, data: response.data.response})
        }),
        catchError(error => {
          return of(actions.getUnreadCount.failure({loading: false, error}))
        }),
      )
    }),
  )

const markAsReadStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$, {config}) =>
  action$.pipe(
    filter(isActionOf(actions.markAsRead.request)),
    switchMap(action => {
      if (!action.payload.data) {
        return of(actions.markAsRead.failure({loading: false, error: new Error('Missing notification ID')}))
      }
      const notificationService = new NotificationService(config)
      return from(notificationService.markAsRead(action.payload.data.notificationId)).pipe(
        map(response => actions.markAsRead.success({loading: false, data: response.data.response})),
        catchError(error => of(actions.markAsRead.failure({loading: false, error}))),
      )
    }),
  )

const markAllAsReadStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$, {config}) =>
  action$.pipe(
    filter(isActionOf(actions.markAllAsRead.request)),
    switchMap(action => {
      const notificationService = new NotificationService(config)
      return from(notificationService.markAllAsRead()).pipe(
        map(response => actions.markAllAsRead.success({loading: false, data: response.data.response})),
        catchError(error => of(actions.markAllAsRead.failure({loading: false, error}))),
      )
    }),
  )

const registerDeviceStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$, {config}) =>
  action$.pipe(
    filter(isActionOf(actions.registerDevice.request)),
    switchMap(action => {
      if (!action.payload.data) {
        return of(actions.registerDevice.failure({loading: false, error: new Error('Missing device data')}))
      }
      const notificationService = new NotificationService(config)
      return from(notificationService.registerDevice(action.payload.data)).pipe(
        map(response => actions.registerDevice.success({loading: false, data: response.data.response})),
        catchError(error => of(actions.registerDevice.failure({loading: false, error}))),
      )
    }),
  )

export default [
  getNotificationsStream,
  getUnreadCountStream,
  markAsReadStream,
  markAllAsReadStream,
  registerDeviceStream
]