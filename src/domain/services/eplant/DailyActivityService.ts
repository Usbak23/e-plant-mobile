import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {DELETE, GET, POST, PUT} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IDailyActivity, IDailyActivityForm} from '@app/models/eplant/IDailyActivity'

export default class DailyActivityService extends BaseService {
  private get d() {
    return this.config
  }

  createDailyActivity(formData: IDailyActivityForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-checkup/create`, formData)
  }

  editDailyActivity(formData: IDailyActivityForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return PUT(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-checkup/update/${formData.id}`, formData)
  }

  deleteDailyActivity(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return DELETE(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-checkup/delete/${id}`)
  }
  getDailyActivityPaginated(param: {
    page: number
    limit: number
    itemId: string
    search?: string
    sort?: string
    year?: string
    month?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IDailyActivity>>>> {
    if (param?.sort == '' || !param?.sort) {
      delete param?.sort
    }

    if (param?.search == '' || !param?.search) {
      delete param?.search
    }

    if (param?.year == '' || !param?.year) {
      delete param?.year
    }

    if (param?.month == '' || !param?.month) {
      delete param?.month
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-checkup?${qs.stringify(param)}`)
  }
}
