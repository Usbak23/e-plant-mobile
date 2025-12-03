import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET} from '../utils/http'
import IStdIframeResponse from '@app/models/commons/IStdIframeResponse'
import {IDashboardChartRow} from '@app/models/eplant/Dashboard'
import {IBlockRow} from '@app/models/eplant/Block'
import {IReportChapelResponse} from '@app/models/eplant/ReportChapel'
import {IEmployeeWageRow} from '@app/models/eplant/EmployeeWage'

export default class DashboardAndChartService extends BaseService {
  private get d() {
    return this.config
  }

  refreshMaterializedView(): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/refresh-materialized-views`)
  }

  metabaseAkpReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    date: ''
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/akp?${qs.stringify(params)}`)
  }

  metabaseRRPReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    date: ''
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/rrp?${qs.stringify(params)}`)
  }

  metabaseBPKReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    subActivityId: string
    year: string | number
    month: string | number
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    if (!isNaN(parseInt(params?.month.toString()))) {
      params.month = parseInt(params.month.toString())
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/mobile/bpk?${qs.stringify(params)}`)
  }

  metabaseBMPReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    subActivityId: string
    year: string | number
    materialId: string | number
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/bmp?${qs.stringify(params)}`)
  }

  metabaseCropBookkReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    date: string
    year?: string
    month?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/cropbook?${qs.stringify(params)}`)
  }

  // metabaseChapelReport(params: {
  //   search?: string
  //   organizationId: string
  //   divisionId: string
  //   date: string
  //   chapel: string
  // }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
  //   if (!params.search || params.search == '') {
  //     delete params.search
  //   }
  //   return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/chapel?${qs.stringify(params)}`)
  // }

  metabaseAkpPlanningTable(params: {
    search?: string
    organizationId: string
    divisionId: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/akp/planning?${qs.stringify(params)}`)
  }

  metabaseAkpRealizationTable(params: {
    search?: string
    organizationId: string
    divisionId: string
    date: ''
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/akp/realization?${qs.stringify(params)}`)
  }

  metabaseRkbTakeCare(params: {
    search?: string
    organizationId: string
    divisionId: string
    year: string | number
    month: string | number
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    if (!isNaN(parseInt(params?.month.toString()))) {
      params.month = parseInt(params.month.toString())
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/rkb/mobile/takecare?${qs.stringify(params)}`)
  }

  metabaseRkbHarvest(params: {
    search?: string
    organizationId: string
    divisionId: string
    year: string | number
    month: string | number
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    if (!isNaN(parseInt(params?.month.toString()))) {
      params.month = parseInt(params.month.toString())
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/rkb/harvest?${qs.stringify(params)}`)
  }

  metabaseBPKSReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    date: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/bpbks?${qs.stringify(params)}`)
  }

  metabaseBPKMaterialReport(params: {
    blockId?: string
    date?: string
    subActivityId?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/bpk/detail?${qs.stringify(params)}`)
  }

  metabaseSeeMaterialRKBTakeCare(params: {
    search?: string
    blockId: string
    month: string | number
    year: string | number
    subActivityId?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.subActivityId || params.subActivityId == '') {
      delete params.subActivityId
    }
    if (!params.search || params.search == '') {
      delete params.search
    }

    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    if (!isNaN(parseInt(params?.month.toString()))) {
      params.month = parseInt(params.month.toString())
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/rkb/material?${qs.stringify(params)}`)
  }

  metabaseYieldReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    date: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/yield?${qs.stringify(params)}`)
  }

  metabaseAkpBarChart(params: {
    organizationId: string
    divisionId: string
    year: string | number
    month: string | number
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    if (!isNaN(parseInt(params?.month.toString()))) {
      params.month = parseInt(params.month.toString())
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/akp/chart?${qs.stringify(params)}`)
  }

  metabaseBjrBlockReport(params: {
    organizationId: string
    divisionId: string
    blockId?: string
    year: string | number
    month: string | number
    search?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    if (!isNaN(parseInt(params?.month.toString()))) {
      params.month = parseInt(params.month.toString())
    }

    if (params.blockId == '') {
      delete params.blockId
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/bjr/block?${qs.stringify(params)}`)
  }

  metabaseEmployeeWagesReport(params: {
    organizationId: string
    divisionId: string
    // blockId: string
    year: string | number
    month: string | number
    search?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    if (!isNaN(parseInt(params?.month.toString()))) {
      params.month = parseInt(params.month.toString())
    }

    if (!params.search || params.search == '') {
      delete params.search
    }

    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/employee/wages?${qs.stringify(params)}`)
  }

  metabaseEmployeeWagesDeductionReport(params: {
    organizationId: string
    divisionId: string
    // blockId: string
    year: string | number
    month: string | number
    search?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!isNaN(parseInt(params?.year.toString()))) {
      params.year = parseInt(params.year.toString())
    }

    if (!isNaN(parseInt(params?.month.toString()))) {
      params.month = parseInt(params.month.toString())
    }

    if (!params.search || params.search == '') {
      delete params.search
    }
    return GET(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/employee/wage-deduction?${qs.stringify(params)}`,
    )
  }

  metabasePMAReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    year: string
    month: string
    userId: string
    // date: ''
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/pma?${qs.stringify(params)}`)
  }

  metabaseTonnageGardenReport(params: {
    search?: string
    organizationId: string
    date?: string
    year?: string
    month?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/garden-tonnage?${qs.stringify(params)}`)
  }

  metabaseTonnagePKSReport(params: {
    search?: string
    organizationId: string
    divisionId: string
    date?: ''
    month?: ''
    year?: ''
  }): Promise<AxiosResponse<IRESTApiResponse<IStdIframeResponse>>> {
    if (!params.search || params.search == '') {
      delete params.search
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/tonnage-pks?${qs.stringify(params)}`)
  }

  //it is different from metabase reponse
  metabaseChapelReport(params: {
    divisionId: string
    date: string
  }): Promise<AxiosResponse<IRESTApiResponse<IReportChapelResponse[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/chapel?${qs.stringify(params)}`)
  }

  getExportChapelReportURL(params: {divisionId: string; date: string}): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/chapel/export?${qs.stringify(params)}`
  }

  allChart(params: {
    organizationId: string
    divisionId?: string
    year: string | number
    month?: string | number
    subActivityId?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IDashboardChartRow[]>>> {
    // if (params.divisionId) {
    //   delete params.divisionId
    // }

    if (params.subActivityId == '') {
      delete params.subActivityId
    }

    if (params.year) {
      params.year = parseInt(params.year.toString())
    }

    // if (!params.month) {
    //   delete params.month
    // }

    if (params.month) {
      params.month = parseInt(params.month.toString())
    }
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/all/chart?${qs.stringify(params)}`)
  }

  //used for report module that needs blocks
  getAllBlock(param: {division: string}): Promise<AxiosResponse<IRESTApiResponse<IBlockRow[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/blocks/list?${qs.stringify(param)}`)
  }

  getReportEmployeeWage(params: {
    organizationId: string
    divisionId?: string
    year: string | number
    month?: string | number
  }): Promise<AxiosResponse<IRESTApiResponse<IEmployeeWageRow[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/employee/wages?${qs.stringify(params)}`)
  }

  exportReportEmployeeWage(params: {
    organizationId: string
    divisionId?: string
    year: string | number
    month?: string | number
    type?: 1 | 0
  }): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/employee/wages/export?${qs.stringify(params)}`
  }

  getProductionOrganization(params: {
    organizationId: string
    divisionId?: string
    year: string | number
    month?: string | number
  }): Promise<AxiosResponse<IRESTApiResponse<IEmployeeWageRow[]>>> {
    return GET(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/production-organization?${qs.stringify(params)}`,
    )
  }

  getProductionOrganizationChart(params: {
    organizationId: string
    divisionId?: string
    year: string | number
    month?: string | number
  }): Promise<AxiosResponse<IRESTApiResponse<IEmployeeWageRow[]>>> {
    return GET(
      `${this.d.eplantDomain}/api/eplant-server/web/v0/dashboard/production-organization/chart?${qs.stringify(params)}`,
    )
  }
}
