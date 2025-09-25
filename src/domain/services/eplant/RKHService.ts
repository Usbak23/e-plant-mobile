import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET, POST} from '@app/domain/services/utils/http'
import IStdEntity from '@app/models/commons/IStdEntity'
import {IRKHFormData, IRKHRow, IRKHDetail, IRKHSummary, IRKHAllRow} from '@app/models/eplant/RKH'
import qs from 'query-string'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class RKHService extends BaseService {
  private get d() {
    return this.config
  }

  createRKH(formData: IRKHFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    const data = {
      tempId: formData?.tempId,
      divisionId: formData?.divisionId,
      dateRkh: formData?.dateRkh,
    }
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/create`, data)
  }

  editRKH(formData: IRKHFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    const data = {
      id: formData?.id,
      tempId: formData?.tempId,
      divisionId: formData?.divisionId,
      dateRkh: formData?.dateRkh,
    }
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/update/${formData.id}`, data)
  }

  deleteRKH(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/delete/${id}`)
  }

  getRKHSummary(param: {
    month: number
    year: number
    division: string
  }): Promise<AxiosResponse<IRESTApiResponse<IRKHSummary>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh?${qs.stringify(param)}`)
  }

  getRKHLists(param: {
    page: number
    limit: number
    numberRkh?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IRKHRow> & IRKHSummary>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh?${qs.stringify(param)}`)
  }

  getRKHAll(): Promise<AxiosResponse<IRESTApiResponse<IRKHAllRow>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/list`)
  }

  getRKHDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IRKHDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/${id}`)
  }

  exportRKH(): Promise<AxiosResponse<string>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/export`, {
      responseType: 'arraybuffer',
    })
  }

  exportRKHURL(param: {year: number; month: string; division: string}): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/export?${qs.stringify(param)}`
  }
}
