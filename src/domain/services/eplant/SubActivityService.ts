import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET} from '@app/domain/services/utils/http'
import {ISubActivity} from '@app/models/eplant/SubActivity'
import qs from 'query-string'

export default class SubActivityService extends BaseService {
  private get d() {
    return this.config
  }
  getSubActivityAll(param: {name?: string}): Promise<AxiosResponse<IRESTApiResponse<ISubActivity>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/subactivity/list?${qs.stringify(param)}`)
  }
}
