import qs from 'query-string'
import IStdResponse from '@app/models/commons/IStdResponse'
import BaseService from '@app/domain/services/BaseServices'
import {IBPBKSFormDataCreate, IBPBKSFormDataUpdate, IBPBKSResponse} from '@app/models/eplant/BPBKS'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '../types'
import {GET, POST} from '../utils/http'

export default class BKMService extends BaseService {
  private get d() {
    return this.config
  }

  createBPBKS(formData: IBPBKSFormDataCreate): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    const data = {
      divisionId: formData?.divisionId,
      date: formData?.date,
      foremanId: formData?.foremanId,
      harvesterId: formData?.harvesterId,
      cutNumber: formData?.cutNumber,
      gardenTonnageId: formData?.gardenTonnageId,
      tphs: formData?.tphs?.map(e => ({
        tphId: e?.tphId,
        blockId: e?.blockId,
        plantingYear: e?.plantingYear,
        numberOfLength: parseInt(e?.numberOfLength?.toString() || '0'),
        loose: parseInt(e?.loose?.toString() || '0'),
        ripeFruitChecked: parseInt(e?.ripeFruitChecked?.toString() || '0'),
        rawFruitChecked: parseInt(e?.rawFruitChecked?.toString() || '0'),
        lateRipeChecked: parseInt(e?.lateRipeChecked?.toString() || '0'),
        rottenFruitChecked: parseInt(e?.rottenFruitChecked?.toString() || '0'),
        longHandleChecked: parseInt(e?.longHandleChecked?.toString() || '0'),
        looseChecked: parseInt(e?.looseChecked?.toString() || '0'),
      })),
    }

    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bpbks/create`, data)
  }

  editBPBKS(formData: IBPBKSFormDataUpdate): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bpbks/update/${formData.id}`, formData)
  }

  getBPBKSAll(param: {
    page: number
    limit: number
    foremanId?: string
    organizationId?: string
    divisionId?: string
    date?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IBPBKSResponse>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/bpbks/list?${qs.stringify(param)}`)
  }

  deleteBPBKS(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdResponse>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bpbks/delete/${id}`)
  }

  exportBPBKSURL(param: {divisionId?: string; date?: string; foremanId?: string}): string {
    return `${this.d.eplantDomain}/api/eplant-server/web/v0/bpbks/export?${qs.stringify(param)}`
  }

  exportBPBKS(param: {
    divisionId?: string
    date?: string
    foremanId?: string
  }): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(this.exportBPBKSURL(param), {
      responseType: 'blob',
    })
  }

  scanQRCode(qrCode: string): Promise<AxiosResponse<IRESTApiResponse>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bpbks/scan-qr`, { qrCode })
  }

  uploadPhotos(bpbksTphId: string, photoFruit: any, photoKrani: any): Promise<AxiosResponse<IRESTApiResponse>> {
    const formData = new FormData()
    formData.append('bpbksTphsId', bpbksTphId)
    if (photoFruit) formData.append('photoFruit', { uri: photoFruit.uri, type: photoFruit.type || 'image/jpeg', name: photoFruit.fileName || 'photoFruit.jpg' } as any)
    if (photoKrani) formData.append('photoKrani', { uri: photoKrani.uri, type: photoKrani.type || 'image/jpeg', name: photoKrani.fileName || 'photoKrani.jpg' } as any)
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/bpbks/upload-photos`, formData, { 'Content-Type': 'multipart/form-data' })
  }
}
