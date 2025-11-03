import {AxiosRequestConfig, AxiosResponse} from 'axios'
import Axios from './Axios'
import {IRESTApiResponse} from '@domain/services/types'

export const GET = async <T = IRESTApiResponse>(
  url: string,
  headers?: {[key: string]: any},
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const defaultHeader = headers
  return await Axios.get<T>(url, {
    ...(config ?? {}),
    headers: defaultHeader,
  })
}

export const DELETE = async <T = IRESTApiResponse>(
  url: string,
  headers?: {[key: string]: any},
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const defaultHeader = headers
  return await Axios.delete<T>(url, {
    ...(config ?? {}),
    headers: defaultHeader,
  })
}

export const POST = async <T = IRESTApiResponse>(
  url: string,
  postBody?: any,
  headers?: {[key: string]: any},
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const defaultHeader = headers
  const _newHeaders = headers as {[key: string]: any}
  const responseType = _newHeaders ? _newHeaders.responseType : null

  if (responseType) {
    return await Axios.post(url, postBody, {
      ...(config ?? {}),
      headers: defaultHeader,
      responseType: responseType,
    })
  }

  return await Axios.post(url, postBody, {
    ...(config ?? {}),
    headers: defaultHeader,
  })
}

export const PUT = async <T = IRESTApiResponse>(
  url: string,
  postBody?: any,
  headers?: {[key: string]: any},
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const defaultHeader = headers
  const _newHeaders = headers as {[key: string]: any}
  const responseType = _newHeaders ? _newHeaders.responseType : null

  if (responseType) {
    return await Axios.put(url, postBody, {
      ...(config ?? {}),
      headers: defaultHeader,
      responseType: responseType,
    })
  }

  return await Axios.put(url, postBody, {
    ...(config ?? {}),
    headers: defaultHeader,
  })
}
