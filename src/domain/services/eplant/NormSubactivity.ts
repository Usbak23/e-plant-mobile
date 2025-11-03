import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET} from '@app/domain/services/utils/http'
import qs from 'query-string'
import {INormSubActivity} from '@app/models/eplant/NormSubactivity'

//TODO
export default class NormSubactivityService extends BaseService {
  private get d() {
    return this.config
  }

  getNormSubactivityLists(param: {
    organizationId?: string
    year?: number
    category?: string
  }): Promise<AxiosResponse<IRESTApiResponse<INormSubActivity[]>>> {
    if (!param?.organizationId || param?.organizationId == '') {
      delete param?.organizationId
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/norm/sub-activity?${qs.stringify(param)}`)
  }
}
