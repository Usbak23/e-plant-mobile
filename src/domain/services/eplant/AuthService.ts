import axios, {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET, POST} from '@app/domain/services/utils/http'
import IStdEntity from '@app/models/commons/IStdEntity'
import {IArvisCredential, ICurrentUser} from '@models/eplant/User'
import qs from 'query-string'
import IPagingDocs from '@models/commons/IPagingDocs'
import IStdResponse from '@app/models/commons/IStdResponse'

export default class AuthService extends BaseService {
  private get d() {
    return this.config
  }

  login(formData: {nipOrEmail: string; password: string}): Promise<AxiosResponse<IRESTApiResponse<IArvisCredential>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/login`, formData)
  }

  loginURL(): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/auth/login`
  }

  logout(): Promise<AxiosResponse<IRESTApiResponse>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/logout`)
  }

  async refreshToken(
    refreshToken: string,
    idToken: string,
  ): Promise<AxiosResponse<IRESTApiResponse<IArvisCredential>>> {
    return await axios.post(
      this.refreshTokenURL(),
      {refreshToken},
      {
        headers: {
          Authorization: idToken,
        },
      },
    )
  }

  refreshTokenURL(): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/auth/refresh-token`
  }

  getCurrentUser(): Promise<AxiosResponse<IRESTApiResponse<ICurrentUser>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/current-user`)
  }

  addOrChangeEmail(form: {email: string}): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/update-email`, form)
  }

  updatePassword(form: {
    currentPassword: string
    password: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/update-password`, form)
  }

  uploadProfilePicture(file: any): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    const multipartBody = new FormData()
    multipartBody.append('file', file)
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/upload-image`, multipartBody, {
      'Content-Type': 'multipart/form-data',
    })
  }

  // forgotPassword(formData: {
  //   email: string
  //   type: string
  // }): Promise<AxiosResponse<IRESTApiResponse<{token: string; tokenExpired: string}>>> {
  //   return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/forgot-password`, formData)
  // }

  forgotPassword(formData: {email: string; type: string}): Promise<AxiosResponse<IRESTApiResponse>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/forgot-password`, formData)
  }

  changePassword(formData: {email: string; token: string; password: string}): Promise<AxiosResponse<IRESTApiResponse>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/auth/change-password`, formData)
  }
}
