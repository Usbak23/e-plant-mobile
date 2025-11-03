import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '../BaseService'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {DELETE, GET, POST, PUT} from '../utils/http'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IDailyActivity, IDailyActivityForm} from '@app/models/eplant/IDailyActivity'
import {IMyRequestDetail, IMyRequestForm} from '@app/models/eplant/MyRequest'
import {IProcessRequest} from '@app/models/eplant/Request'

export default class RequestService extends BaseService {
  private get d() {
    return this.config
  }

  createMyRequest(formData: IMyRequestForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/myrequest/create`, formData)
  }

  editMyRequest(formData: IMyRequestForm): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return PUT(`${this.d.eplantDomain}/api/eplant-server/web/v0/myrequest/update/${formData.id}`, formData)
  }

  processRequest(formData: IProcessRequest): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return PUT(`${this.d.eplantDomain}/api/eplant-server/web/v0/myrequest/process/${formData.id}`, formData)
  }

  deleteMyRequest(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return DELETE(`${this.d.eplantDomain}/api/eplant-server/web/v0/myrequest/delete/${id}`)
  }

  detailMyRequest(id: string): Promise<AxiosResponse<IRESTApiResponse<IMyRequestDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/myrequest/${id}`)
  }

  getMyRequestPaginated(param: {
    page: number
    limit: number
    divisionId: string
    search?: string
    sort?: string
    year?: string
    month?: string
    type?: 'Material' | 'Alat' | 'Transportasi' | 'Uang Tunai'
    status?: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak' | ''
    userId?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<IDailyActivity>>>> {
    if (param?.status == '' || !param?.status) {
      delete param?.status
    }

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

    if (param?.userId == '' || !param?.userId) {
      delete param?.userId
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/myrequest?${qs.stringify(param)}`)
  }
}
