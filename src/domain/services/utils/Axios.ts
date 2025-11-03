import axios, {AxiosError} from 'axios'
import {IRESTApiResponse} from '@domain/services/types'
import {IError} from '@domain/states/types'
import flux from '@domain/states/store'
import System from '../System'
// import analytics from '@react-native-firebase/analytics';
import * as LOG_CONSTANT from '@utils/constants'

export enum Severity {
  WTF = 'WTF',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
}

const createErrorInterface = (axr: AxiosError<IRESTApiResponse> | null, details: any = null): IError => {
  return {
    code: `${axr?.response?.data?.code || axr?.code || 500}`,
    severity: `${axr?.response?.data?.severity || Severity.WTF}` as Severity,
    message: `${
      axr?.response?.data?.message || axr?.message || 'Tidak dapat melakukan request. Periksa internet atau server anda'
    }`,
    description: `${axr?.response?.data.errorMessage || axr?.response?.data?.status}`,
    details: details,
    response: axr?.response,
  }
}

const Axios = axios.create()

Axios.interceptors.request.use(async config => {
  const token = await getToken()
  Object.assign(config, {
    timeout: 1000 * 15,
    headers: {
      ...config.headers,
      Authorization: token,
    },
  })
  return config
})

Axios.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config

    if (error?.response?.status == 401 && originalRequest.url == System.instance.authService.refreshTokenURL()) {
      const payload_log = {
        api_response_code: error?.response?.data?.code || -1,
        api_response_message: error?.response?.data?.message || '',
        axios_status: error?.response?.status || -1,
        original_request_url: originalRequest?.url || ''
      }
      // analytics().logEvent(LOG_CONSTANT.ERROR_UNAUTHORIZED_EXPIRED_TOKEN_REQUEST, payload_log)
      logout()
      return Promise.reject(createErrorInterface(error))
    }

    if (error?.response?.status == 401 && originalRequest.url == System.instance.authService.loginURL()) {
      const payload_log = {
        api_response_code: error?.response?.data?.code || -1,
        api_response_message: error?.response?.data?.message || '',
        axios_status: error?.response?.status || -1,
        original_request_url: originalRequest?.url || ''
      }
      // analytics().logEvent(LOG_CONSTANT.ERROR_UNAUTHORIZED_REQUEST, payload_log)
      return Promise.reject(createErrorInterface(error))
    }

    if (error?.response?.status == undefined) {
      const payload_log = {
        api_response_code: error?.response?.data?.code || -1,
        api_response_message: error?.response?.data?.message || '',
        axios_status: error?.response?.status || -1,
        original_request_url: originalRequest?.url || ''
      }
      // analytics().logEvent(LOG_CONSTANT.ERROR_UNDEFINED_STATUS, payload_log)
      return Promise.reject(createErrorInterface(null))
    }

    if (error.response.status == 401 && !originalRequest._retry) {
      const payload_log = {
        api_response_code: error?.response?.data?.code || -1,
        api_response_message: error?.response?.data?.message || '',
        axios_status: error?.response?.status || -1,
        original_request_url: originalRequest?.url || ''
      }
      // analytics().logEvent(LOG_CONSTANT.LOG_REFRESH_TOKEN, payload_log)
      originalRequest._retry = true
      const {
        // @ts-ignore
        user: {userCredential},
      } = await flux.store.getState()
      const refreshToken = userCredential?.data?.refreshToken
      const idToken = userCredential?.data?.idToken
      const {
        data: {response},
      } = await System.instance.authService.refreshToken(refreshToken, idToken)
      if (response?.idToken) {
        flux.store.dispatch(flux.actions.login.success({loading: false, data: response}))
        Axios.defaults.headers.common.Authorization = response.idToken
        return Axios(originalRequest)
      }
    }
    return Promise.reject(createErrorInterface(error))
  },
)

export const getToken = () =>
  new Promise(async resolve => {
    const {
      // @ts-ignore
      user: {userCredential},
    } = await flux.store.getState()
    const idToken = userCredential?.data?.idToken
    return resolve(idToken)
  })

const logout = async () => flux.store.dispatch(flux.actions.logout.success({loading: false, data: undefined}))

// export const getToken = () =>
//   new Promise(async resolve => {
//     const currentDate = Date.now().
//     // @ts-ignore
//     const {
//       user: {userCredential},
//     } = await flux.store.getState()
//     const expiresDate = userCredential?.data?.expiresDate * 1000
//     const expiresDateRefreshtoken = userCredential?.data?.expiresDateRefreshtoken * 1000
//     const refreshToken = userCredential?.data?.refreshToken
//     const idToken = userCredential?.data?.idToken
//     if (expiresDate < currentDate && expiresDateRefreshtoken > currentDate) {
//       try {
//         const {
//           data: {response},
//         } = await System.instance.authService.refreshToken(refreshToken, idToken)
//         if (response.idToken) {
//           flux.store.dispatch(flux.actions.login.success({loading: false, data: response}))
//           return resolve(response.idToken)
//         }
//       } catch (error: any) {
//         // if (error?.response?.status === 401) {
//         //   logout()
//         // }
//         return resolve(idToken)
//       }
//     }
//     return resolve(idToken)
//   })

export default Axios
