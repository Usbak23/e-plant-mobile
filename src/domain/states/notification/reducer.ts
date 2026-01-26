import {ActionType, getType} from 'typesafe-actions'
import * as actions from '@app/domain/states/notification/actions'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {INotificationResponse, IUnreadCountResponse, IDeviceRegistrationResponse} from '@app/model/eplant/Notification'

export interface INotificationState {
  notifications?: IEffectPayload<INotificationResponse, boolean, IError>
  unreadCount?: IEffectPayload<IUnreadCountResponse, boolean, IError>
  markAsRead?: IEffectPayload<{message: string}, boolean, IError>
  markAllAsRead?: IEffectPayload<{message: string}, boolean, IError>
  registerDevice?: IEffectPayload<IDeviceRegistrationResponse, boolean, IError>
}

const initialState: INotificationState = {}

type NotificationAction = ActionType<typeof actions>

const notificationReducer = (state = initialState, action: NotificationAction): INotificationState => {
  switch (action.type) {
    case getType(actions.getNotifications.request):
      return {
        ...state,
        notifications: {
          loading: action.payload.loading,
          data: undefined,
          error: undefined,
        },
      }
    case getType(actions.getNotifications.success):
      return {
        ...state,
        notifications: {
          loading: action.payload.loading,
          data: action.payload.data,
          error: undefined,
        },
      }
    case getType(actions.getNotifications.failure):
      return {
        ...state,
        notifications: {
          loading: action.payload.loading,
          data: undefined,
          error: action.payload.error,
        },
      }

    case getType(actions.getUnreadCount.request):
      return {
        ...state,
        unreadCount: {
          loading: action.payload.loading,
          data: undefined,
          error: undefined,
        },
      }
    case getType(actions.getUnreadCount.success):
      return {
        ...state,
        unreadCount: {
          loading: action.payload.loading,
          data: action.payload.data,
          error: undefined,
        },
      }
    case getType(actions.getUnreadCount.failure):
      return {
        ...state,
        unreadCount: {
          loading: action.payload.loading,
          data: undefined,
          error: action.payload.error,
        },
      }

    case getType(actions.markAsRead.request):
      return {
        ...state,
        markAsRead: {
          loading: action.payload.loading,
          data: undefined,
          error: undefined,
        },
      }
    case getType(actions.markAsRead.success):
      return {
        ...state,
        markAsRead: {
          loading: action.payload.loading,
          data: action.payload.data,
          error: undefined,
        },
      }
    case getType(actions.markAsRead.failure):
      return {
        ...state,
        markAsRead: {
          loading: action.payload.loading,
          data: undefined,
          error: action.payload.error,
        },
      }

    case getType(actions.registerDevice.request):
      return {
        ...state,
        registerDevice: {
          loading: action.payload.loading,
          data: undefined,
          error: undefined,
        },
      }
    case getType(actions.registerDevice.success):
      return {
        ...state,
        registerDevice: {
          loading: action.payload.loading,
          data: action.payload.data,
          error: undefined,
        },
      }
    case getType(actions.registerDevice.failure):
      return {
        ...state,
        registerDevice: {
          loading: action.payload.loading,
          data: undefined,
          error: action.payload.error,
        },
      }

    case getType(actions.clearNotificationStatus):
      return {
        ...state,
        markAsRead: undefined,
        markAllAsRead: undefined,
        registerDevice: undefined,
      }

    default:
      return state
  }
}

export default notificationReducer