import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET} from '@app/domain/services/utils/http'
import {IMinimumAKP, IProvince, IRangeBreakTime, IRangeYear, IUom} from '@app/models/eplant/Master'
import qs from 'query-string'
import IStdEntity from '@app/models/commons/IStdEntity'

export default class MasterService extends BaseService {
  private get d() {
    return this.config
  }

  getProvinces(param: {name?: string}): Promise<AxiosResponse<IRESTApiResponse<IProvince[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master/provinces?${qs.stringify(param)}`)
  }

  getUoms(param: {name?: string}): Promise<AxiosResponse<IRESTApiResponse<IUom[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master/uom?${qs.stringify(param)}`)
  }

  getMinimumAkp(): Promise<AxiosResponse<IRESTApiResponse<IMinimumAKP>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master/min-akp`)
  }
  getRangeYear(): Promise<AxiosResponse<IRESTApiResponse<IRangeYear>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master/range-year`)
  }

  getRangeBreakTime(): Promise<AxiosResponse<IRESTApiResponse<IRangeBreakTime>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master/range-break`)
  }

  getTypeEmployee(): Promise<AxiosResponse<IRESTApiResponse<IStdEntity[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master/type-employee`)
  }

  getSupervisions(): Promise<AxiosResponse<IRESTApiResponse<IStdEntity[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master/supervisions`)
  }

  getWorkStatus(): Promise<AxiosResponse<IRESTApiResponse<IStdEntity[]>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/master/work-status`)
  }
}
