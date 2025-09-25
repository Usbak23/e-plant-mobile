export interface IRESTApiResponse<T = any> {
  status?: string
  severity?: string
  code?: string
  response: T
  message?: string
  errorMessage?: string
}

export type CallbackOrObserver<T extends (...args: any[]) => any> = T | {next: T}
