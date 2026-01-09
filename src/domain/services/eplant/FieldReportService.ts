import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {DELETE, GET, POST, PUT} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IDailyActivity, IDailyActivityForm} from '@app/models/eplant/IDailyActivity'
import {IFieldReport, IFieldReportDetail, IFieldReportForm} from '@app/models/eplant/FieldReport'

//as known as Berita Acara
export default class FieldReportService extends BaseService {
  private get d() {
    return this.config
  }

  getCreateFieldReportUrl(): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/official-report/create`
  }

  getUpdateFieldReportUrl(id: string): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/official-report/update/${id}`
  }

  getDownloadUrl(id: string): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/official-report/file/${id}`
  }

  createFieldReport(formData: IFieldReportForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    const multipartBody = new FormData()
    if (formData.files.length > 0) {
      formData.files.forEach((file: any) => {
        multipartBody.append('files', file)
      })
    }

    if (formData.videos.length > 0) {
      formData.videos.forEach((video: any) => {
        multipartBody.append('videos', video)
      })
    } else {
      multipartBody.append('videos', '')
    }

    multipartBody.append('subject', formData.subject)
    multipartBody.append('date', formData.date)
    multipartBody.append('blockId', formData.blockId)
    multipartBody.append('category', formData.category)
    multipartBody.append('description', formData.description)
    multipartBody.append('subActivityId', formData.subActivityId)
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/official-report/create`, multipartBody, {
      'Content-Type': 'multipart/form-data',
    })
  }

  editFieldReport(formData: any): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return PUT(`${this.d.eplantDomain}/api/eplant-server/web/v0/official-report/update/${formData.id}`, formData)
  }

  deleteFieldReport(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return DELETE(`${this.d.eplantDomain}/api/eplant-server/web/v0/official-report/delete/${id}`)
  }

  deleteFileFieldReport(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return DELETE(`${this.d.eplantDomain}/api/eplant-server/web/v0/official-report/delete/file/${id}`)
  }

  detailFieldReport(id: string): Promise<AxiosResponse<IRESTApiResponse<IFieldReportDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/official-report/${id}`)
  }
  getFieldReportPaginated(param: {
    page: number
    limit: number
    divisionId: string
    search?: string
    sort?: string
    year?: string
    month?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IFieldReport>>>> {
    if (param?.sort == '' || !param?.sort) {
      delete param?.sort
    }

    if (param?.search == '' || !param?.search) {
      delete param?.search
    }

    if (param?.year == '' || !param?.year) {
      delete param?.year
    }

    if (param?.month == '' || !param?.month) {
      delete param?.month
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/official-report?${qs.stringify(param)}`)
  }
}
