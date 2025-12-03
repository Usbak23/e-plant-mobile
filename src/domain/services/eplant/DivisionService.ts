import { AxiosResponse } from 'axios'
import { IRESTApiResponse } from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseServices'
import { GET, POST } from '@app/domain/services/utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import { Division, IDivisionFormData } from '@app/models/eplant/Division'
import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'

export default class DivisionService extends BaseService {
  private get d() {
    return this.config
  }

  getDivisionsLists(param: {
    page: number
    limit: number
    search?: string
    district?: string
    sort?: string
    organization?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<Division>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/divisions?${qs.stringify(param)}`)
  }

  getAllDivision(param: { organization?: string }): Promise<AxiosResponse<IRESTApiResponse<Division[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/divisions/list?${qs.stringify(param)}`)
  }

  createDivision(formData: IDivisionFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/divisions/create`, formData)
  }

  editDivision(formData: IDivisionFormData): Promise<AxiosResponse<IRESTApiResponse<Division>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/divisions/update/${formData.id}`, formData)
  }

  deleteDivision(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/divisions/delete/${id}`)
  }

  getDetailDivision(id: string): Promise<AxiosResponse<IRESTApiResponse<Division>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/divisions/${id}`)
  }

  exportDivision(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/divisions/export`, {
      responseType: 'blob',
    })
  }
}
