import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseServices'
import {GET, POST} from '@app/domain/services/utils/http'
import IStdEntity from '@app/models/commons/IStdEntity'
import {IMasterItemFormData, IMasterItemRow, IMasterItemRowAll, IMasterItemDetail} from '@app/models/eplant/MasterItem'
import qs from 'query-string'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class MasterItemService extends BaseService {
  private get d() {
    return this.config
  }

  createMasterItem(formData: IMasterItemFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/master-items/create`, formData)
  }

  editMasterItem(formData: IMasterItemFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/master-items/update/${formData.id}`, formData)
  }

  deleteMasterItem(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/master-items/delete/${id}`)
  }

  getMasterItemLists(param: {
    page: number
    limit: number
    name?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IMasterItemRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master-items?${qs.stringify(param)}`)
  }

  getMasterItemAll(param: {name?: string}): Promise<AxiosResponse<IRESTApiResponse<IMasterItemRowAll>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master-items/list?${qs.stringify(param)}`)
  }

  getMasterItemDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IMasterItemDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master-items/${id}`)
  }

  exportMasterItem(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master-items/export`, {
      responseType: 'blob',
    })
  }
}
