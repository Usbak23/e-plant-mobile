import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@app/domain/services/types'
import BaseService from '@app/domain/services/BaseService'
import {GET, POST} from '@app/domain/services/utils/http'
import IStdEntity from '@app/models/commons/IStdEntity'
import {
  ICategoryItemFormData,
  ICategoryItemRow,
  ICategoryItemRowAll,
  ICategoryItemDetail,
} from '@app/models/eplant/CategoryItem'
import qs from 'query-string'
import IPagingDocs from '@app/models/commons/IPagingDocs'

export default class CategoryItemService extends BaseService {
  private get d() {
    return this.config
  }

  createCategoryItem(formData: ICategoryItemFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/category-items/create`, formData)
  }

  editCategoryItem(formData: ICategoryItemFormData): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/category-items/update/${formData.id}`, formData)
  }

  deleteCategoryItem(id: string): Promise<AxiosResponse<IRESTApiResponse<IStdEntity>>> {
    return POST(`${this.d.eplantDomain}/api/eplant-server/web/v0/category-items/delete/${id}`)
  }

  getCategoryItemLists(param: {
    page: number
    limit: number
    name?: string
    sort?: string
  }): Promise<AxiosResponse<IRESTApiResponse<IPagingDocs<ICategoryItemRow>>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/category-items?${qs.stringify(param)}`)
  }

  getCategoryItemAll(param: {name?: string}): Promise<AxiosResponse<IRESTApiResponse<ICategoryItemRowAll>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/category-items/list?${qs.stringify(param)}`)
  }

  getCategoryItemDetail(id: string): Promise<AxiosResponse<IRESTApiResponse<ICategoryItemDetail>>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/category-items/${id}`)
  }

  exportCategoryItem(): Promise<AxiosResponse<IRESTApiResponse>> {
    return GET(`${this.d.eplantDomain}/api/eplant-server/web/v0/category-items/export`, {
      responseType: 'blob',
    })
  }
}
