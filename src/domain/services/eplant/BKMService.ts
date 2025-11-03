import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '../BaseService'
import { IBKMDetail, IBKMFormDataCreate, IBKMFormDataUpdate, IBKMRow } from '@app/models/eplant/BKM'
import { AxiosResponse } from 'axios'
import { IRESTApiResponse } from '../types'
import { GET, POST } from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class BKMService extends BaseService {
  private get d() {
    return this.config
  }

  createBKM(formData: IBKMFormDataCreate): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    const data = {
      tempId: formData?.tempId,
      divisionId: formData?.divisionId,
      foremanId: formData?.foremanId,
      subActivityId: formData?.subActivityId,
      date: formData?.date,
      bkmEmployee: formData?.bkmEmployee.map(e => ({
        userId: e.userId,
        supervisionId: formData?.supervisionId,
        workStatusId: formData?.workStatusId,
        blockId: e?.blockId,
        workResultHa: parseFloat(e?.workResultHa?.toString()),
        workResultKg: parseFloat(e?.workResultKg != undefined ? e.workResultKg.toString() : "0"),
        workday: e?.workday,
        plantingYear: e?.plantingYear,
        typeEmployee: e?.typeEmployee,
        hkAmount: parseFloat(e?.hkAmount?.toString()),
        categoryChapel: e?.categoryChapel,
      })),
    }
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm/create`, data)
  }

  editBKM(formData: IBKMFormDataUpdate): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm/update/${formData.id}`, formData)
  }

  getBKMLists(param: {
    page: number
    limit: number
    foremanId?: string
    organizationId?: string
    divisionId?: string
    date?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IBKMRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm?${qs.stringify(param)}`)
  }

  getBKMMobile(param: {
    organizationId?: string
    divisionId?: string
    date?: string
    foremanId?: string
    subActivityId?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IBKMDetail[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm/mobile?${qs.stringify(param)}`)
  }

  deleteBKM(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm/employee/delete/${id}`)
  }

  getDetailBKM(id: string): Promise<AxiosResponse<IRESTApiResponse<IBKMDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm/${id}`)
  }

  exportBKMURL(param: { organizationId?: string; divisionId?: string; date?: string; foremanId?: string }): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/bkm/export?${qs.stringify(param)}`
  }

  exportBKM(param: {
    organizationId?: string
    divisionId?: string
    date?: string
    foremanId?: string
  }): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(this.exportBKMURL(param), {
      responseType: 'blob',
    })
  }
}

