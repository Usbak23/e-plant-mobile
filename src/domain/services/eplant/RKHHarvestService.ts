import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET, POST} from '@app/domain/services/utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdEntity from '@app/models/commons/IStdEntity'
import qs from 'query-string'
import {
  IRKHHarvestAllRow,
  IRKHHarvestDetail,
  IRKHHarvestFormData,
  IRKHHarvestRow,
  IRKHHarvestWorker,
} from '@app/models/eplant/RKHHarvest'

export default class RKHHarvestService extends BaseService {
  private get d() {
    return this.config
  }

  createRKHHarvest(formData: IRKHHarvestFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/harvest/create`, formData)
  }

  editRKHHarvest(
    id: string,
    workerFormData: {worker: IRKHHarvestWorker[]},
  ): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/harvest/update/${id}`, workerFormData)
  }

  getRKHHarvestLists(param: {
    page: number
    limit: number
    date?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IRKHHarvestRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/harvest?${qs.stringify(param)}`)
  }

  getRKHHarvestDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IRKHHarvestDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/harvest/${id}`)
  }

  getRKHHarvestAll(): Promise<AxiosResponse<IRESTApiResponse<IRKHHarvestAllRow>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/harvest/list`)
  }

  exportRKHHarvestURL(rkhId: string): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/export/${rkhId}`
  }
}
