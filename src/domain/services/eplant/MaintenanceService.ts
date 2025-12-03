import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {DELETE, GET, POST, PUT} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IMaintenance, IMaintenanceForm} from '@app/models/eplant/Maintenance'

export default class MaintenanceService extends BaseService {
  private get d() {
    return this.config
  }

  createMaintenance(formData: IMaintenanceForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-maintenance/create`, formData)
  }

  editMaintenance(formData: IMaintenanceForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return PUT(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-maintenance/update/${formData.id}`, formData)
  }

  getMaintenanceDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IMaintenance>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-maintenance/${id}`)
  }

  deleteMaintenance(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return DELETE(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-maintenance/delete/${id}`)
  }
  getMaintenancePaginated(param: {
    page: number
    limit: number
    itemId: string
    search?: string
    sort?: string
    year?: string
    month?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IMaintenance>>>> {
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

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/item-maintenance?${qs.stringify(param)}`)
  }
}
