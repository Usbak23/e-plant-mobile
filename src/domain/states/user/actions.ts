import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/user/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import {IArvisCredential, ICurrentUser, IUserCost, IUserRow} from '@app/models/eplant/User'
import clearAction from '@domain/states/utils/clearAction'
import IStdResponse from '@app/models/commons/IStdResponse'

export const login = createAsyncAction(c.LOGIN_REQUEST, c.LOGIN_SUCCESS, c.LOGIN_FAILURE)<
  IEffectPayload<any, true>,
  IEffectPayload<IArvisCredential, false>,
  IEffectPayload<null, false, Error>
>()

export const logout = createAsyncAction(c.LOGOUT_REQUEST, c.LOGOUT_SUCCESS, c.LOGOUT_FAILURE)<
  IEffectPayload<any, true>,
  IEffectPayload<IArvisCredential, false>,
  IEffectPayload<null, false, Error>
>()

export const forgotPassword = createAsyncAction(
  c.FORGOT_PASSWORD_REQUEST,
  c.FORGOT_PASSWORD_SUCCESS,
  c.FORGOT_PASSWORD_FAILURE,
)<IEffectPayload<{email: string}, true>, IEffectPayload<any, false>, IEffectPayload<null, false, Error>>()

export const changePassword = createAsyncAction(
  c.CHANGE_PASSWORD_REQUEST,
  c.CHANGE_PASSWORD_SUCCESS,
  c.CHANGE_PASSWORD_FAILURE,
)<
  IEffectPayload<{email: string; token: string; password: string}, true>,
  IEffectPayload<any, false>,
  IEffectPayload<null, false, Error>
>()

export const getAllUser = createAsyncAction(c.GET_ALL_USER_REQUEST, c.GET_ALL_USER_SUCCESS, c.GET_ALL_USER_FAILURE)<
  IEffectPayload<any, boolean>,
  IEffectPayload<IUserRow[], false>,
  IEffectPayload<null, false, IError>
>()

export const getAllUserCost = createAsyncAction(
  c.GET_ALL_USER_COST_REQUEST,
  c.GET_ALL_USER_COST_SUCCESS,
  c.GET_ALL_USER_COST_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IUserCost, false>, IEffectPayload<null, false, IError>>()

export const getCurrentUser = createAsyncAction(
  c.GET_CURRENT_USER_REQUEST,
  c.GET_CURRENT_USER_SUCCESS,
  c.GET_CURRENT_USER_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<ICurrentUser, false>, IEffectPayload<null, false, IError>>()

export const uploadProfilePicture = createAsyncAction(
  c.UPLOAD_PROFILE_PICTURE_REQUEST,
  c.UPLOAD_PROFILE_PICTURE_SUCCESS,
  c.UPLOAD_PROFILE_PICTURE_FAILURE,
)<IEffectPayload<any, boolean>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const addOrChangeEmail = createAsyncAction(
  c.ADD_OR_UPDATE_EMAIL_REQUEST,
  c.ADD_OR_UPDATE_EMAIL_SUCCESS,
  c.ADD_OR_UPDATE_EMAIL_FAILURE,
)<IEffectPayload<{email: string}, boolean>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const updatePassword = createAsyncAction(
  c.UPDATE_PASSWORD_REQUEST,
  c.UPDATE_PASSWORD_SUCCESS,
  c.UPDATE_PASSWORD_FAILURE,
)<
  IEffectPayload<{currentPassword: string; password: string}, boolean>,
  IEffectPayload<IStdResponse, false>,
  IEffectPayload<null, false, IError>
>()

export const clearUserLoginForm = createAction(c.LOGIN_FORM_CLEAR)
export const clearUserProfile = createAction(c.CLEAR_USER_PROFILE, clearAction)()
export const clearUserCrendential = createAction(c.CLEAR_USER_CREDENTIAL, clearAction)()
export const clearUserUploadProfilePicture = createAction(c.UPLOAD_PROFILE_PICTURE_CLEAR, clearAction)()
export const clearUserAddOrChangeEmail = createAction(c.ADD_OR_UPDATE_EMAIL_CLEAR, clearAction)()
export const clearUserUpdatePassword = createAction(c.UPDATE_PASSWORD_CLEAR, clearAction)()
export const clearUserForgotPassword = createAction(c.FORGOT_PASSWORD_CLEAR, clearAction)()
export const clearUserResetPassword = createAction(c.RESET_PASSWORD_CLEAR, clearAction)()
