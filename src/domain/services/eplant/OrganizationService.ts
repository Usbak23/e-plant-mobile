import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET, POST} from '@app/domain/services/utils/http'
import IStdEntity from '@app/models/commons/IStdEntity'
import {
  IOrganizationFormData,
  IOrganizationRow,
  IOrganizationRowAll,
  IOrganizationDetail,
} from '@app/models/eplant/Organization'
import qs from 'query-string'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class OrganizationService extends BaseService {
  private get d() {
    return this.config
  }

  createOrganization(formData: IOrganizationFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/organizations/create`, formData)
  }

  editOrganization(formData: IOrganizationFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/organizations/update/${formData.id}`, formData)
  }

  deleteOrganization(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/organizations/delete/${id}`)
  }

  getOrganizationLists(param: {
    page: number
    limit: number
    // name?: string
    // district?: string
    search?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IOrganizationRow>>>> {
    if (!param?.search || param?.search == '') {
      delete param?.search
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/organizations?${qs.stringify(param)}`)
  }

  getOrganizationAll(param: {
    name?: string
    type?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IOrganizationRowAll>>> {
    if (!param?.type || param?.type == '') {
      delete param?.type
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/organizations/list?${qs.stringify(param)}`)
  }

  getOrganizationDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IOrganizationDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/organizations/${id}`)
  }

  exportOrganization(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/organizations/export`, {
      responseType: 'blob',
    })
  }
}
