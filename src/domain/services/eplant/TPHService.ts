import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET, POST} from '@app/domain/services/utils/http'
import IStdEntity from '@app/models/commons/IStdEntity'
import {ITPHFormData, ITPHRow, ITPHRowAll, ITPHDetail} from '@app/models/eplant/TPH'
import qs from 'query-string'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class TPHService extends BaseService {
  private get d() {
    return this.config
  }

  createTPH(formData: ITPHFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/tphs/create`, formData)
  }

  editTPH(formData: ITPHFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/tphs/update/${formData.id}`, formData)
  }

  deleteTPH(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/tphs/delete/${id}`)
  }

  getTPHLists(param: {
    page: number
    limit: number
    search?: string
    block?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<ITPHRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/tphs?${qs.stringify(param)}`)
  }

  getTPHAll(param: {name?: string; block?: string}): Promise<AxiosResponse<IRESTApiResponse<ITPHRowAll>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/tphs/list?${qs.stringify(param)}`)
  }

  getTPHDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<ITPHDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/tphs/${id}`)
  }

  exportTPH(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/tphs/export`, {
      responseType: 'arraybuffer',
    })
  }
}
