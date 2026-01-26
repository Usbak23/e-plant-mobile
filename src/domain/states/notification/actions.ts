import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/notification/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {INotificationResponse, IUnreadCountResponse, IDeviceRegistration, IDeviceRegistrationResponse} from '@app/model/eplant/Notification'
import clearAction from '@domain/states/utils/clearAction'

export const getNotifications = createAsyncAction(
  c.GET_NOTIFICATIONS_REQUEST,
  c.GET_NOTIFICATIONS_SUCCESS,
  c.GET_NOTIFICATIONS_FAILURE
)<
  IEffectPayload<{limit?: number}, boolean>,
  IEffectPayload<INotificationResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const getUnreadCount = createAsyncAction(
  c.GET_UNREAD_COUNT_REQUEST,
  c.GET_UNREAD_COUNT_SUCCESS,
  c.GET_UNREAD_COUNT_FAILURE
)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IUnreadCountResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const markAsRead = createAsyncAction(
  c.MARK_AS_READ_REQUEST,
  c.MARK_AS_READ_SUCCESS,
  c.MARK_AS_READ_FAILURE
)<
  IEffectPayload<{notificationId: string}, true>,
  IEffectPayload<{message: string}, false>,
  IEffectPayload<null, false, IError>
>()

export const markAllAsRead = createAsyncAction(
  c.MARK_ALL_READ_REQUEST,
  c.MARK_ALL_READ_SUCCESS,
  c.MARK_ALL_READ_FAILURE
)<
  IEffectPayload<any, true>,
  IEffectPayload<{message: string}, false>,
  IEffectPayload<null, false, IError>
>()

export const registerDevice = createAsyncAction(
  c.REGISTER_DEVICE_REQUEST,
  c.REGISTER_DEVICE_SUCCESS,
  c.REGISTER_DEVICE_FAILURE
)<
  IEffectPayload<IDeviceRegistration, true>,
  IEffectPayload<IDeviceRegistrationResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const clearNotificationStatus = createAction(c.CLEAR_NOTIFICATION_STATUS, clearAction)()