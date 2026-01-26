export enum NotificationType {
  RKT_SUBMISSION = 'RKT_SUBMISSION',
  RKT_APPROVED = 'RKT_APPROVED', 
  RKT_REJECTED = 'RKT_REJECTED',
  RKT_FINAL_APPROVED = 'RKT_FINAL_APPROVED'
}

export interface INotification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  type: NotificationType
  data?: {
    rktId?: string
    [key: string]: any
  }
}

export interface INotificationResponse {
  data: INotification[]
  total: number
}

export interface IUnreadCountResponse {
  unreadCount: number
}

export interface IDeviceRegistration {
  fcmToken: string
  platform: 'android' | 'ios'
  deviceId: string
}

export interface IDeviceRegistrationResponse {
  message: string
  deviceId: string
}

export interface INotificationApiResponse<T> {
  status: string
  code: string
  response: T
}