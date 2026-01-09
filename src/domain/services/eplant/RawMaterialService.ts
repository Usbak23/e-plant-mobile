import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET, POST} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {
  INormMaterial,
  IPurchasementHistoryRow,
  IRawMaterialDetail,
  IRawMaterialFormData,
  IRawMaterialRow,
  IRawMaterialUpdateFormData,
  IRawPurchasementHistoryFormData,
  IRawReceptionHistoryFormData,
  IReceptionHistoryRow,
} from '@app/models/eplant/RawMaterial'

export default class RawMaterialService extends BaseService {
  private get d() {
    return this.config
  }

  createRawMaterial(formData: IRawMaterialFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/create`, formData)
  }

  getRawMaterialLists(param: {
    page: number
    limit: number
    name?: string
    code?: string
    location?: string
    district?: string
    sort?: string
    isLessThanStock?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IRawMaterialRow>>>> {
    return GET<IRESTApiResponse<IPagingDocs<IRawMaterialRow>>>(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials?${qs.stringify(param)}`,
    )
  }
  getRawMaterialAll(param: {name?: string}): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IRawMaterialRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/list?${qs.stringify(param)}`)
  }

  getRawMaterialDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IRawMaterialDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/detail/${id}`)
  }

  editRawMaterial(formData: IRawMaterialUpdateFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/update/${formData.id}`, formData)
  }

  createPurchasementHistory(
    formData: IRawPurchasementHistoryFormData,
  ): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/history/purchase/create`, formData)
  }

  editPurchasementHistory(
    formData: IRawPurchasementHistoryFormData,
  ): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/history/purchase/update/${formData.id}`,
      formData,
    )
  }

  editReceptionHistory(formData: IRawReceptionHistoryFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/history/acceptance/update/${formData.id}`,
      formData,
    )
  }

  deleteRawMaterial(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/delete/${id}`)
  }
  getPurchasementHistoryLists(param: {
    page: number
    limit: number
    rawMaterialId: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IPurchasementHistoryRow>>>> {
    return GET(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/history/purchase/${
        param.rawMaterialId
      }?${qs.stringify(param)}`,
    )
  }

  getReceptionHistoryLists(param: {
    page: number
    limit: number
    rawMaterialId: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IReceptionHistoryRow>>>> {
    return GET(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/history/acceptance/${
        param.rawMaterialId
      }?${qs.stringify(param)}`,
    )
  }

  exportRawMaterial(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/raw-materials/export`, {
      responseType: 'blob',
    })
  }

  getNormMaterialList(param: {
    organizationId?: string
    year?: number
  }): Promise<AxiosResponse<IRESTApiResponse<INormMaterial>>> {
    if (!param?.organizationId || param?.organizationId == '') {
      delete param?.organizationId
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/norm/material/list?${qs.stringify(param)}`)
  }
}
