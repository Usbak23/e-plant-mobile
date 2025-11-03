import BaseService from '@app/domain/services/BaseService'
import { AxiosResponse } from 'axios'
import { IRESTApiResponse } from '@app/domain/services/types'
import qs from 'query-string'
import { GET, POST } from '@app/domain/services/utils/http'
import IStdResponse from '@app/models/commons/IStdResponse'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {
  ITonnageGardenDetail,
  ITonnageGardenFileFormData,
  ITonnageGardenFormData,
  ITonnageGardenRow,
} from '@app/models/eplant/TonnageGarden'

export default class TonnageGardenService extends BaseService {
  private get d() {
    return this.config
  }

  getTonnageGardenPaginated(param: {
    page: number
    limit: number
    organizationId?: string
    date?: string
    sort?: string
    search?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<ITonnageGardenRow>>>> {
    if (!param.search || param.search == '') {
      delete param.search
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage?${qs.stringify(param)}`)
  }

  getTonnageGardenAll(param: {
    organizationId?: string
    date?: string
    type?: string
  }): Promise<AxiosResponse<IRESTApiResponse<ITonnageGardenRow[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage/list?${qs.stringify(param)}`)
  }

  uploadFileTonnageGarden(
    formData: ITonnageGardenFileFormData,
  ): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    const multipartBody = new FormData()
    multipartBody.append('file', formData.file)
    multipartBody.append('date', formData.date)
    multipartBody.append('organizationId', formData.organizationId)
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage/upload`, multipartBody, {
      'Content-Type': 'multipart/form-data',
    })
  }

  createTonnageGarden(formData: ITonnageGardenFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage/create`, formData)
  }

  updateTonnageGarden(formData: ITonnageGardenFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage/update/${formData.id}`, formData)
  }

  deleteTonnageGarden(gardenTonnageId: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage/delete/${gardenTonnageId}`)
  }

  detailTonnageGarden(id: string): Promise<AxiosResponse<IRESTApiResponse<ITonnageGardenDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage/${id}`)
  }

  exportTonnageGardenURL(param: { organizationId: string; date: string }): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage/export?${qs.stringify(param)}`
  }

  downloadTemplateURL(): string {
    const url = `${this.d.eplantDomain}/api/eplant-server/web/v0/garden-tonnage/download-template`
    return url
  }
}
