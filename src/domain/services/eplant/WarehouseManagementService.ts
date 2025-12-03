import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET, POST} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {
  IManagamentWarehouseBPUForm,
  IManagementWarehouse,
  IManagementWarehouseApproveForm,
  IManagementWarehouseDetail,
} from '@app/models/eplant/WarehouseManagement'

export default class WarehouseManagementService extends BaseService {
  private get d() {
    return this.config
  }

  approve(formData: IManagementWarehouseApproveForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/management-warehouse/approve`, formData)
  }

  postBPU(formData: IManagamentWarehouseBPUForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/management-warehouse/bpu`, formData)
  }

  getWarehouseDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IManagementWarehouseDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/management-warehouse/${id}`)
  }

  getWarehouseList(param: {
    page: number
    limit: number
    divisionId: string
    month: string
    year: string
    status?: string
    search?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IManagementWarehouse>>>> {
    if (param?.status == '' || !param?.status) {
      delete param?.status
    }

    if (param?.sort == '' || !param?.sort) {
      delete param?.sort
    }

    if (param?.search == '' || !param?.search) {
      delete param?.search
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/management-warehouse?${qs.stringify(param)}`)
  }
}
