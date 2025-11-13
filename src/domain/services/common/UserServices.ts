import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseServices'
import {GET, POST} from '@app/domain/services/utils/http'
import User, {IArvisUserData, IUserAccess} from '@app/models/crm/User'
import {ICurrentUser, IEmployeeCost, IUserRow} from '@app/models/eplant/User'
import qs from 'query-string'

//please do not delete this, just update or move
export default class UserService extends BaseService {
  private get d() {
    return this.config
  }

  registerToArvis = (name: string): Promise<AxiosResponse<IRESTApiResponse>> => {
    return POST(`${this.d.eplantDomain}/api/web/v0/user/register`, {name})
  }

  verifyUserEmail = (): Promise<AxiosResponse<IRESTApiResponse>> => {
    return POST(`${this.d.eplantDomain}/api/web/v0/user/verifyEmail`, {})
  }

  resendVerificationEmail = (): Promise<AxiosResponse<IRESTApiResponse>> => {
    return POST(`${this.d.eplantDomain}/api/web/v0/user/resendEmailVerification`, {})
  }

  getUserData = async (): Promise<AxiosResponse<IRESTApiResponse<User>>> => {
    const response: AxiosResponse<IRESTApiResponse<IArvisUserData>> = await GET(
      `${this.d.eplantDomain}/api/web/v0/user/getCurrentUser`,
    )
    const data = response?.data?.response
    return {
      ...response,
      data: {
        ...response?.data,
        response: new User(data),
      },
    }
  }

  updateUserData = (name: string, nickname: string, phoneNumber: string): Promise<AxiosResponse<IRESTApiResponse>> => {
    return POST(`${this.d.eplantDomain}/api/web/v0/user/updateBasicProfile`, {name, nickname, phoneNumber})
  }

  getAllUser(param: {
    name?: string
    role?: string
    typeEmployee?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IUserRow[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/users/list?${qs.stringify(param)}`)
  }

  getAllUserCost(param: {
    organization?: string
    role?: string
    typeEmployee?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IEmployeeCost>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/users/cost/list?${qs.stringify(param)}`)
  }
}
