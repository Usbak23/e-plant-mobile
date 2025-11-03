import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '../BaseService'
import {
  IBKMTakeCareDetail,
  IBKMTakeCareFormDataCreate,
  IBKMTakeCareFormDataUpdate,
  IBKMTakeCareRow,
} from '@app/models/eplant/BKMTakeCare'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET, POST} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class BKMService extends BaseService {
  private get d() {
    return this.config
  }

  createBKMTakeCare(formData: IBKMTakeCareFormDataCreate): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    const data = {
      tempId: formData?.tempId,
      divisionId: formData?.divisionId,
      foremanId: formData?.foremanId,
      date: formData?.date,
      subActivityId: formData?.subActivityId,
      bkmEmployee: formData?.bkmEmployee.map(e => ({
        userId: e.userId,
        supervisionId: formData?.supervisionId,
        workStatusId: formData?.workStatusId,
        wages: formData?.wages,
        typeEmployee: formData?.typeEmployee,
        blockId: e?.blockId,
        workResultHa: parseFloat(e?.workResultHa?.toString()),
        hkAmount: parseFloat(e?.hkAmount?.toString()),
        bkmMaterials: e?.bkmMaterials?.map(m => ({
          materialId: m?.materialId,
          qty: parseInt(m?.qty?.toString()),
        })),
      })),
    }
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm-takecare/create`, data)
  }

  editBKMTakeCare(formData: IBKMTakeCareFormDataUpdate): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm-takecare/update/${formData.id}`, formData)
  }

  getBKMTakeCareLists(param: {
    page: number
    limit: number
    foremanId?: string
    organizationId?: string
    divisionId?: string
    date?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IBKMTakeCareRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm-takecare?${qs.stringify(param)}`)
  }

  getBKMTakeCareMobile(param: {
    organizationId?: string
    divisionId?: string
    date?: string
    foreman?: string
    subActivityId?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IBKMTakeCareDetail[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm-takecare/mobile?${qs.stringify(param)}`)
  }

  deleteBKMTakeCare(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm-takecare/employee/delete/${id}`)
  }

  getDetailBKMTakeCare(id: string): Promise<AxiosResponse<IRESTApiResponse<IBKMTakeCareDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/bkm-takecare/${id}`)
  }

  exportBKMTakeCareURL(param: {
    organizationId?: string
    divisionId?: string
    date?: string
    foremanId?: string
    subActivityId?: string
  }): string {
    if (param?.organizationId) {
      delete param?.organizationId
    }

    return `${this.d.eplantDomain}/api/eplant-server/web/v0/bkm-takecare/export?${qs.stringify(param)}`
  }

  exportBKMTakeCare(param: {
    organizationId?: string
    divisionId?: string
    date?: string
    foremanId?: string
  }): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(this.exportBKMTakeCareURL(param), {
      responseType: 'blob',
    })
  }
}
