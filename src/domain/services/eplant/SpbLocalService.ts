import qs from 'query-string'
import {AxiosResponse} from 'axios'
import BaseService from '@app/domain/services/BaseServices'
import {IRESTApiResponse} from '../types'
import {GET, POST} from '../utils/http'

export default class SpbLocalService extends BaseService {
  private get d() {
    return this.config
  }

  list(params: {divisionId?: string; date?: string; gardenTonnageId?: string; page?: number; limit?: number}): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/spb-local/?${qs.stringify(params)}`)
  }

  detail(id: string): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/spb-local/${id}`)
  }

  create(data: any): Promise<AxiosResponse<IRESTApiResponse>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/spb-local/create`, data)
  }

  update(id: string, data: any): Promise<AxiosResponse<IRESTApiResponse>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/spb-local/update/${id}`, data)
  }

  deleteSpbLocal(id: string): Promise<AxiosResponse<IRESTApiResponse>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/spb-local/delete/${id}`)
  }
}
