import BaseService from '@app/domain/services/BaseService'
import { AxiosResponse } from 'axios'
import { IRESTApiResponse } from '@app/domain/services/types'
import qs from 'query-string'
import { GET, POST } from '@app/domain/services/utils/http'
import { IAttendance, IAttendanceFileFormData, IAttendanceFormData } from '@app/models/eplant/Attendance'
import IStdResponse from '@app/models/commons/IStdResponse'

export default class AttendanceService extends BaseService {
  private get d() {
    return this.config
  }

  getAttendanceEmployeeList(param: {
    organizationId: string
    divisionId?: string
    date: string
  }): Promise<AxiosResponse<IRESTApiResponse<IAttendance>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/attendances/employee/list?${qs.stringify(param)}`)
  }

  uploadFileAttendance(formData: IAttendanceFileFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    const multipartBody = new FormData()
    multipartBody.append('file', formData.file)
    multipartBody.append('date', formData.date)
    multipartBody.append('divisionId', formData.divisionId)
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/attendances/employee/upload`, multipartBody, {
      'Content-Type': 'multipart/form-data',
    })
  }

  createAttendance(formData: IAttendanceFormData): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/attendances/employee/create`, formData)
  }

  deleteAttendance(attendanceEmployeeId: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/attendances/employee/delete/${attendanceEmployeeId}`)
  }

  downloadTemplateAbsensi(): string {
    const url = `${this.d.eplantDomain}/api/eplant-server/web/v0/attendances/employee/download-template`
    return url
  }
}
