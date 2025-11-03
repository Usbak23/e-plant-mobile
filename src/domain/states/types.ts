import {Action} from 'redux'
import {Epic} from 'redux-observable'
import {ActionsType} from '@domain/states/store'
import {RootState} from '@domain/states/reducers'
import System from '@domain/services/System'

export enum Severity {
  WTF = 'WTF',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
}

export interface IError<T = any> {
  code: string
  severity: Severity
  message: string
  description?: string
  details?: T
  response?: any
}

export interface IEffectPayload<T = any, L = boolean | undefined | null, E = Error | IError> {
  loading: L
  data?: T
  error?: E
}

export interface IEffectAction<T = any> extends Action {
  type: string
  payload: IEffectPayload<T>
}

export type StreamType = Epic<ActionsType, ActionsType, RootState, System>
