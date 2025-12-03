import {AxiosResponse} from 'axios'
import {IRKHTakeCareFormData, IRKHTakeCareRow, IRKHTakeCareDetail} from '@app/models/eplant/RKHTakeCare'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseServices'
import {GET, POST} from '@app/domain/services/utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import IStdEntity from '@app/models/commons/IStdEntity'
import qs from 'query-string'

export default class RKHTakeCareService extends BaseService {
  private get d() {
    return this.config
  }

  createRKHTakeCare(formData: IRKHTakeCareFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    const payload = {
      tempId: formData.tempId,
      rkhId: formData.rkhId,
      blockId: formData.blockId,
      subActivityId: formData.subActivityId,
      realizationToThisDay: formData.realizationToThisDay,
      hectaresTomorrow: formData.hectaresTomorrow,
      totalPlanHectare: formData.totalPlanHectare,
      hkPerHa: formData.hkPerHa,
      totalPlanHk: formData.totalPlanHk,
      material: [...formData.material],
    }
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/take-care/create`, payload)
  }

  editRKHTakeCare(formData: IRKHTakeCareFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    const payload = {
      tempId: formData.tempId,
      rkhId: formData.rkhId,
      blockId: formData.blockId,
      subActivityId: formData.subActivityId,
      realizationToThisDay: formData.realizationToThisDay,
      hectaresTomorrow: formData.hectaresTomorrow,
      totalPlanHectare: formData.totalPlanHectare,
      hkPerHa: formData.hkPerHa,
      totalPlanHk: formData.totalPlanHk,
      material: [...formData.material],
    }
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/take-care/update/${formData.id}`, payload)
  }

  deleteRKHTakeCare(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/take-care/delete/${id}`)
  }

  getRKHTakeCareLists(param: {
    page: number
    limit: number
    date?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IRKHTakeCareRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/take-care?${qs.stringify(param)}`)
  }

  getRKHTakeCareAll(): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IRKHTakeCareRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/take-care/list`)
  }

  getRKHTakeCareDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<IRKHTakeCareDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/take-care/${id}`)
  }

  exportRKHTakeCare(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/take-care/export`, {
      responseType: 'blob',
    })
  }

  exportRKHTakeCareURL(rkhId: string): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/rkh/export/${rkhId}`
  }
}
