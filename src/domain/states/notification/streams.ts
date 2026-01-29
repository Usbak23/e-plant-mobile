import {Epic} from 'redux-observable'
import {from, of} from 'rxjs'
import {catchError, map, switchMap, filter} from 'rxjs/operators'
import {isActionOf} from 'typesafe-actions'
import {ActionsType, RootStateType} from '@domain/states/store'
import * as actions from '@domain/states/notification/actions'
import NotificationService from '@domain/services/eplant/NotificationService'
import Config from '@root/Config'

const getNotificationsStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.getNotifications.request)),
    switchMap(action => {
      const notificationService = new NotificationService(Config)
      const limit = action.payload.data?.limit || 50
      return from(notificationService.getNotifications(limit)).pipe(
        map(response => {
          return actions.getNotifications.success({loading: false, data: response.data.response})
        }),
        catchError(error => {
          return of(actions.getNotifications.failure({loading: false, error: {
            code: error.response?.status?.toString() || '500',
            severity: 'error' as any,
            message: error.message || 'Failed to get notifications'
          }}))
        }),
      )
    }),
  )

const getUnreadCountStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.getUnreadCount.request)),
    switchMap(action => {
      const notificationService = new NotificationService(Config)
      return from(notificationService.getUnreadCount()).pipe(
        map(response => {
          return actions.getUnreadCount.success({loading: false, data: response.data.response})
        }),
        catchError(error => {
          return of(actions.getUnreadCount.failure({loading: false, error: {
            code: error.response?.status?.toString() || '500',
            severity: 'error' as any,
            message: error.message || 'Failed to get unread count'
          }}))
        }),
      )
    }),
  )

const markAsReadStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.markAsRead.request)),
    switchMap(action => {
      if (!action.payload.data) {
        return of(actions.markAsRead.failure({loading: false, error: {
          code: '400',
          severity: 'error' as any,
          message: 'Missing notification ID'
        }}))
      }
      const notificationService = new NotificationService(Config)
      return from(notificationService.markAsRead(action.payload.data.notificationId)).pipe(
        map(response => actions.markAsRead.success({loading: false, data: response.data.response})),
        catchError(error => of(actions.markAsRead.failure({loading: false, error: {
          code: error.response?.status?.toString() || '500',
          severity: 'error' as any,
          message: error.message || 'Failed to mark as read'
        }}))),
      )
    }),
  )

const markAllAsReadStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.markAllAsRead.request)),
    switchMap(action => {
      const notificationService = new NotificationService(Config)
      return from(notificationService.markAllAsRead()).pipe(
        map(response => actions.markAllAsRead.success({loading: false, data: response.data.response})),
        catchError(error => of(actions.markAllAsRead.failure({loading: false, error: {
          code: error.response?.status?.toString() || '500',
          severity: 'error' as any,
          message: error.message || 'Failed to mark all as read'
        }}))),
      )
    }),
  )

const registerDeviceStream: Epic<ActionsType, ActionsType, RootStateType> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.registerDevice.request)),
    switchMap(action => {
      if (!action.payload.data) {
        return of(actions.registerDevice.failure({loading: false, error: {
          code: '400',
          severity: 'error' as any,
          message: 'Missing device data'
        }}))
      }
      const notificationService = new NotificationService(Config)
      return from(notificationService.registerDevice(action.payload.data)).pipe(
        map(response => {
          const data: any = response.data.response || response.data
          
          return actions.registerDevice.success({
            loading: false, 
            data: {
              message: data.message || 'Device registered successfully',
              deviceId: data.deviceId || data.id || 'unknown'
            }
          })
        }),
        catchError(error => {
          return of(actions.registerDevice.failure({loading: false, error: {
            code: error.response?.status?.toString() || '500',
            severity: 'error' as any,
            message: error.response?.data?.message || error.message || 'Failed to register device'
          }}))
        }),
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