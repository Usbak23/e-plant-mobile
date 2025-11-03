import BaseService from '@app/domain/services/BaseService'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import qs from 'query-string'
import {GET, POST} from '@app/domain/services/utils/http'
import {IPMA, IPMADetail, IPMAFormData, IPMAFormEmployeeUpdate, IPMAFormUdpate, IPMARow} from '@app/models/eplant/PMA'
import IStdResponse from '@app/models/commons/IStdResponse'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class PMAService extends BaseService {
  private get d() {
    return this.config
  }

  getPMAMobile(param: {
    divisionId?: string
    date?: string
    foremanId?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPMA>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/pma/mobile?${qs.stringify(param)}`)
  }

  createPMA(formData: IPMAFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/pma/create`, formData)
  }

  updatePMA(formUpdate: IPMAFormUdpate): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/pma/update/${formUpdate.id}`, formUpdate)
  }

  updateSinglePMAEmployee(
    formPMAEMployeeUpdate: IPMAFormEmployeeUpdate,
  ): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    const id = formPMAEMployeeUpdate.id
    formPMAEMployeeUpdate.id = undefined
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/pma/employee/update/${id}`, formPMAEMployeeUpdate)
  }

  deletePMA(pmaEmployeeId: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/pma/employee/delete/${pmaEmployeeId}`)
  }

  getPMADetail(pmaId: string): Promise<AxiosResponse<IRESTApiResponse<IPMADetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/pma/${pmaId}`)
  }

  getPMAList(param: {
    page: number
    limit: number
    foremanId?: string
    division?: string
    date?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IPMARow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/pma?${qs.stringify(param)}`)
  }

  exportPMA(param: {divisionId: string; foremanId: string; date: string}): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/pma/export?${qs.stringify(param)}`
  }
}
