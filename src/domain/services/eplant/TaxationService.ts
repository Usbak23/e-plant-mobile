import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET, POST} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {
  ITaxationDetail,
  ITaxationFormData,
  ITaxationHaRealization,
  ITaxationHaRealizationParam,
  ITaxationRow,
} from '@app/models/eplant/Taxation'

export default class TaxationService extends BaseService {
  private get d() {
    return this.config
  }

  createTaxation(formData: ITaxationFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/taxations/create`, formData)
  }

  editTaxation(formData: ITaxationFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/taxations/update/${formData.id}`, formData)
  }

  deleteTaxation(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/taxations/delete/${id}`)
  }

  getTaxationPaginated(param: {
    page: number
    limit: number
    numberTaxation?: string
    numberAkp?: string
    sort?: string
    divisionId: string
    date: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<ITaxationRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/taxations?${qs.stringify(param)}`)
  }

  getHaRealizationTaxation(
    param: ITaxationHaRealizationParam,
  ): Promise<AxiosResponse<IRESTApiResponse<ITaxationHaRealization>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/taxations/get-realization-ha?${qs.stringify(param)}`)
  }

  getTaxationDetail(taxationId: string): Promise<AxiosResponse<IRESTApiResponse<ITaxationDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/taxations/${taxationId}`)
  }

  exportTaxation(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/taxations/export`, {
      responseType: 'blob',
    })
  }
}
