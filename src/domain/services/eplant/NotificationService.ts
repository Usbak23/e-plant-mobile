import { AxiosResponse } from 'axios'
import Axios from '@domain/services/utils/Axios'
import { IConfig } from '@root/Config'
import {
  INotificationApiResponse,
  INotificationResponse,
  IUnreadCountResponse,
  IDeviceRegistration,
  IDeviceRegistrationResponse
} from '@app/model/eplant/Notification'

class NotificationService {
  private readonly config: IConfig

  constructor(config: IConfig) {
    this.config = config
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      // Authorization will be added by interceptor
    }
  }

  async registerDevice(data: IDeviceRegistration): Promise<AxiosResponse<INotificationApiResponse<IDeviceRegistrationResponse>>> {
    return Axios.post(
      `${this.config.eplantDomain}/api/eplant-server/web/v0/notifications/register-device`,
      data,
      { headers: this.getHeaders() }
    )
  }

  async getNotifications(limit: number = 50): Promise<AxiosResponse<INotificationApiResponse<INotificationResponse>>> {
    return Axios.get(
      `${this.config.eplantDomain}/api/eplant-server/web/v0/notifications?limit=${limit}`,
      { headers: this.getHeaders() }
    )
  }

  async getUnreadCount(): Promise<AxiosResponse<INotificationApiResponse<IUnreadCountResponse>>> {
    return Axios.get(
      `${this.config.eplantDomain}/api/eplant-server/web/v0/notifications/unread-count`,
      { headers: this.getHeaders() }
    )
  }

  async markAsRead(notificationId: string): Promise<AxiosResponse<INotificationApiResponse<{ message: string }>>> {
    return Axios.put(
      `${this.config.eplantDomain}/api/eplant-server/web/v0/notifications/${notificationId}/read`,
      {},
      { headers: this.getHeaders() }
    )
  }

  async markAllAsRead(): Promise<AxiosResponse<INotificationApiResponse<{ message: string }>>> {
    return Axios.put(
      `${this.config.eplantDomain}/api/eplant-server/web/v0/notifications/mark-all-read`,
      {},
      { headers: this.getHeaders() }
    )
  }

  async unregisterDevice(deviceId: string): Promise<AxiosResponse<INotificationApiResponse<{ message: string }>>> {
    return Axios.post(
      `${this.config.eplantDomain}/api/eplant-server/web/v0/notifications/unregister-device`,
      { deviceId },
      { headers: this.getHeaders() }
    )
  }
}

export default NotificationService