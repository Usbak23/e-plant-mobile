import BaseService from '../BaseService'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET} from '../utils/http'
import {IRoleRow} from '@app/models/eplant/Role'

export default class RoleService extends BaseService {
  private get d() {
    return this.config
  }

  getAllRole(): Promise<AxiosResponse<IRESTApiResponse<IRoleRow[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/roles/list`)
  }
}
