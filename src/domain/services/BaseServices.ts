import Config, {IConfig} from '@root/Config'
import {AxiosResponse} from 'axios'
import {IRESTApiResponse} from '@domain/services/types'
import {POST} from '@domain/services/utils/http'

export default abstract class BaseService {
  protected config: IConfig = Config

  protected async upload<B = {}, R = any>(
    url: string,
    requestBody: B,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<AxiosResponse<IRESTApiResponse<R>>> {
    const formSubmit: FormData = new FormData()
    Object.entries(requestBody).forEach(([key, value]) => {
      formSubmit.append(key, value)
    })
    return await POST(
      url,
      formSubmit,
      {
        'Content-Type': 'multipart/form-data',
      },
      // {
      //   onUploadProgress: onUploadProgress,
      // },
    )
  }
}
