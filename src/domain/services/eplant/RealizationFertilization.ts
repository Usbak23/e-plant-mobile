import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '../BaseService'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {DELETE, GET, POST, PUT} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {
  IManagamentWarehouseBPUForm,
  IManagementWarehouse,
  IManagementWarehouseApproveForm,
  IManagementWarehouseDetail,
} from '@app/models/eplant/WarehouseManagement'
import {
  IRealizationFertilizationApproveForm,
  IRealizationFertilizationPagingDocs,
} from '@app/models/eplant/RealizationFertilization'

export default class RealizationFertilizationService extends BaseService {
  private get d() {
    return this.config
  }

  createRealizationFertilization(
    formData: IRealizationFertilizationApproveForm,
  ): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/fertilization/create`, formData)
  }

  updateRealizationFertilization(
    formData: IRealizationFertilizationApproveForm,
  ): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return PUT(`${this.d.eplantDomain}/api/eplant-server/web/v0/fertilization/update/${formData?.id}`, formData)
  }

  deleteRealizationFertilization(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return DELETE(`${this.d.eplantDomain}/api/eplant-server/web/v0/fertilization/delete/${id}`)
  }

  getRealizationFertilizationDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IManagementWarehouseDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/management-warehouse/${id}`)
  }

  getRealizationFertilizationList(param: {
    page: number
    limit: number
    divisionId: string
    subActivityId: string
    materialId?: string
    month: string
    year: string
    search?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IRealizationFertilizationPagingDocs>>> {
    if (param?.materialId == '' || !param?.materialId) {
      delete param?.materialId
    }
    if (param?.sort == '' || !param?.sort) {
      delete param?.sort
    }

    if (param?.search == '' || !param?.search) {
      delete param?.search
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/fertilization?${qs.stringify(param)}`)
  }
}
