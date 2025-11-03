import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '../BaseService'
import {IBlockFormData, IBlockRow} from '@app/models/eplant/Block'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET, POST} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IUserStd} from '@app/models/eplant/User'

export default class BlockService extends BaseService {
  private get d() {
    return this.config
  }

  createBlock(formData: IBlockFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/create`, formData)
  }

  editBlock(formData: IBlockFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/update/${formData.id}`, formData)
  }

  getBlocksPaginated(param: {
    page: number
    limit: number
    code?: string
    division?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IBlockRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks?${qs.stringify(param)}`)
  }

  getAllBlock(param: {division?: string; code?: string}): Promise<AxiosResponse<IRESTApiResponse<IBlockRow[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/list?${qs.stringify(param)}`)
  }

  getBlockForeman(param: {division?: string}): Promise<AxiosResponse<IRESTApiResponse<IUserStd[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/foreman?${qs.stringify(param)}`)
  }

  getAllForeman(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/foreman?division=`)
  }

  deleteBlock(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/delete/${id}`)
  }

  getDetailBlock(id: string): Promise<AxiosResponse<IRESTApiResponse<IBlockRow>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/${id}`)
  }

  exportBlock(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/export`, {
      responseType: 'blob',
    })
  }
}
