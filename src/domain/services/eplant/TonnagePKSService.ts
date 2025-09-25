import BaseService from '@app/domain/services/BaseService'
import { AxiosResponse } from 'axios'
import { IRESTApiResponse } from '@app/domain/services/types'
import qs from 'query-string'
import { GET, POST } from '@app/domain/services/utils/http'
import IStdResponse from '@app/models/commons/IStdResponse'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import { ISPBListRow, ITonnagePKSDetail, ITonnagePKSFormData, ITonnagePKSRow } from '@app/models/eplant/TonnagePKS'

export default class TonnagePKSService extends BaseService {
  private get d() {
    return this.config
  }

  getTonnagePKSPaginated(param: {
    page: number
    limit: number
    organizationId?: string
    date?: string
    sort?: string
    search?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<ITonnagePKSRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/tonnage-pks?${qs.stringify(param)}`)
  }

  createTonnagePKS(formData: ITonnagePKSFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/tonnage-pks/create`, formData)
  }
  updateTonnagePKS(formData: ITonnagePKSFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/tonnage-pks/update/${formData.id}`, formData)
  }
  deleteTonnagePKS(pksTonnageId: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/tonnage-pks/delete/${pksTonnageId}`)
  }

  detailTonnagePKS(pksTonnageId: string): Promise<AxiosResponse<IRESTApiResponse<ITonnagePKSDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/tonnage-pks/${pksTonnageId}`)
  }

  exportTonnagePKSURL(param: { organizationId: string; date: string }): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/tonnage-pks/export?${qs.stringify(param)}`
  }

  getSPBList(param: { organizationId: string }): Promise<AxiosResponse<IRESTApiResponse<ISPBListRow>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/spb/list?${qs.stringify(param)}`)
  }
}
