import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET, POST} from '@app/domain/services/utils/http'
import IStdEntity from '@app/models/commons/IStdEntity'
import {IItemFormData, IItemRow, IItemRowAll, IItemDetail} from '@app/models/eplant/Item'
import qs from 'query-string'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class ItemService extends BaseService {
  private get d() {
    return this.config
  }

  createItem(formData: IItemFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/items/create`, formData)
  }

  editItem(formData: IItemFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/items/update/${formData.id}`, formData)
  }

  deleteItem(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/items/delete/${id}`)
  }

  getItemLists(param: {
    page: number
    limit: number
    search?: string
    sort?: string
    typeItem?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IItemRow>>>> {
    if (!param.search || param.search == '') {
      delete param.search
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/items?${qs.stringify(param)}`)
  }

  getItemAll(param: {name?: string}): Promise<AxiosResponse<IRESTApiResponse<IItemRowAll>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/items/list?${qs.stringify(param)}`)
  }

  getItemDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IItemDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/items/${id}`)
  }

  exportItem(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/items/export`, {
      responseType: 'blob',
    })
  }
}
