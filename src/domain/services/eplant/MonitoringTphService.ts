import qs from 'query-string'
import {AxiosResponse} from 'axios'
import BaseService from '@app/domain/services/BaseServices'
import {IRESTApiResponse} from '../types'
import {GET} from '../utils/http'

export default class MonitoringTphService extends BaseService {
  private get d() {
    return this.config
  }

  list(params: {divisionId: string; month: string; year: string; page?: number; limit?: number}): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/monitoring-tph/list?${qs.stringify(params)}`)
  }

  summary(params: {divisionId: string; month: string; year: string}): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/monitoring-tph/summary?${qs.stringify(params)}`)
  }
}
