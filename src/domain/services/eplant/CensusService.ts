import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET, POST} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {ICensusDetail, ICensusEditFormData, ICensusFormData, ICensusRow} from '@app/models/eplant/Census'

export default class CensusService extends BaseService {
  private get d() {
    return this.config
  }

  createCensus(formData: ICensusFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/censuses/create`, formData)
  }

  editCensus(editPayload: ICensusEditFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/censuses/update/${editPayload.id}`,
      editPayload.formData,
    )
  }

  getCensusDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<ICensusDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/censuses/${id}`)
  }

  deleteCensus(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/censuses/delete/${id}`)
  }

  exportCensus(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/censuses/export`, {
      responseType: 'blob',
    })
  }

  getCensusPaginated(param: {
    page: number
    limit: number
    numberCensus?: string
    sort?: string
    divisionId: string
    year: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<ICensusRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/censuses?${qs.stringify(param)}`)
  }
}
