export enum NotificationStatus {
  READ = 'read',
  NEW = 'new',
}

export enum NotificationTargetModule {
  LEAD = 'Lead',
  OPPORTUNITY = 'Opportunity',
  TASK = 'Task',
  PRODUCT = 'Product',
  CASE = 'Case',
  APPROVE = 'Request',
  CLOSE_OPPORTUNITY = 'Close Opportunity',
}

export type NotificationParameterType = {
  _id: string
  module: NotificationTargetModule
}

export interface INotificationRow {
  _id: string
  subject?: string
  body?: string
  status?: NotificationStatus
  createdDate?: Date
  parameter?: NotificationParameterType[]
  user?: string
  link?: string
}

export interface RemoteMessagePushNotification {
  sentTime?: number
  ttl?: number
  collapseKey?: string
  from?: string
  messageId?: string
  to?: string
  data: {
    status: string
    body: string
    user: string
    _id: string
    __v?: string
    updatedDate?: string
    subject?: string
    parameter: string | NotificationParameterType[]
    createdDate?: string
  }
  notification?: {
    title?: string
    android?: any
    body?: string
  }
}

export interface onNotificationMessage {
  foreground?: boolean
  userInteraction?: boolean
  data?: {
    subject?: string
    'google.delivered_priority'?: string
    'google.sent_time'?: number
    'google.ttl'?: number
    'google.original_priority'?: string
    status: 'read'
    updatedDate?: string
    createdDate?: string
    __v?: string
    _id: string
    body: string
    from?: string
    user: string
    'google.message_id'?: string
    collapse_key?: string
    parameter: string | NotificationParameterType[]
  }
}
