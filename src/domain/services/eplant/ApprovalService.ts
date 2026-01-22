import BaseService from '@app/domain/services/BaseServices'
import { AxiosResponse } from 'axios'
import { IRESTApiResponse } from '@app/domain/services/types'
import { GET, POST } from '@app/domain/services/utils/http'
import IStdResponse from '@app/models/commons/IStdResponse'

interface IApprovalItem {
  id: string
  year: number
  organization: {
    id: string
    name: string
  }
  division: {
    id: string
    name: string
  }
  subActivity: {
    id: string
    name: string
  }
  status: string
  currentApprovalLevel: number
  createdAt: string
}

interface IApproveRequest {
  id: string
  notes?: string
}

interface IRejectRequest {
  id: string
  notes: string
}

export default class ApprovalService extends BaseService {
  private get d() {
    return this.config
  }

  getPendingApprovals(): Promise<AxiosResponse<IRESTApiResponse<IApprovalItem[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkt/pending-approvals`)
  }

  approveRkt(data: IApproveRequest): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkt/approve`, data)
  }

  rejectRkt(data: IRejectRequest): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkt/reject`, data)
  }

  getRktDetail(rktId: string): Promise<AxiosResponse<IRESTApiResponse<any>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/rkt/${rktId}`)
  }
}