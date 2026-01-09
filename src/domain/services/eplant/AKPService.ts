import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseServices'
import {GET, POST} from '@app/domain/services/utils/http'
import IStdEntity from '@app/models/commons/IStdEntity'
import {IAKPFormData, IAKPRow, IAKPRowAll, IAKPDetail} from '@app/models/eplant/AKP'
import qs from 'query-string'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class AKPService extends BaseService {
  private get d() {
    return this.config
  }

  createAKP(formData: IAKPFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    const data = {
      tempId: formData.tempId,
      blockId: formData.blockId,
      harvestDate: formData.harvestDate,
      akpLines: formData.akpLines,
    }
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/akp/create`, data)
  }

  editAKP(formData: IAKPFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    const data = {
      id: formData.id,
      blockId: formData.blockId,
      harvestDate: formData.harvestDate,
      akpLines: formData.akpLines,
    }
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/akp/update/${formData.id}`, data)
  }

  deleteAKP(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/akp/delete/${id}`)
  }

  getAKPLists(param: {
    page: number
    limit: number
    numberAkp?: string
    sort?: string
    date: string
    divisionId: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IAKPRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/akp?${qs.stringify(param)}`)
  }

  getAKPAll(param: {name?: string}): Promise<AxiosResponse<IRESTApiResponse<IAKPRowAll>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/akp/list?${qs.stringify(param)}`)
  }

  getAKPDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IAKPDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/akp/${id}`)
  }

  exportAKP(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/akp/export`, {
      responseType: 'blob',
    })
  }
}
