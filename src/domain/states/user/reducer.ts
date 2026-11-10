import {createReducer} from 'typesafe-actions'
import * as actions from '@domain/states/user/actions'
import {IEffectAction, IEffectPayload} from '@domain/states/types'
import {IArvisCredential, IArvisUserData, ICurrentUser, IUserCost, IUserRow} from '@models/eplant/User'

export interface IRSUser {
  userCredential?: IEffectPayload<IArvisCredential>
  userProfile?: IEffectPayload<IArvisUserData>
  userDataLogin?: {nipOrEmail: string; password: string; rememberMe: boolean}
  userAll?: IEffectPayload<IUserRow[]>
  userAllCost?: IEffectPayload<IUserCost>
  currentUserInfo?: IEffectPayload<ICurrentUser>
  userProfilePictureForm?: IEffectPayload
  userAddOrChangeEmailForm?: IEffectPayload
  userUpdatePasswordForm?: IEffectPayload
  syncMasterDataStatus?: IEffectPayload
  baseURL: 'http://localhost:5011'
  changePasswordStatus: IEffectPayload
  forgotPasswordStatus: IEffectPayload
}

const DEFAULT_STATE: IRSUser = {
  userCredential: undefined,
  userProfile: undefined,
  userDataLogin: undefined,
}

const userReducer = createReducer<IRSUser, IEffectAction>(DEFAULT_STATE)
  .handleAction(
    [actions.login.request, actions.login.failure, actions.login.success],
    (state: IRSUser, action: IEffectAction) => {
      const payload = (action as IEffectAction<IArvisCredential>).payload
      return {
        ...state,
        userCredential: payload,
        userProfile: payload.data?.data,
      }
    },
  )
  .handleAction([actions.login.request], (state: IRSUser, action: IEffectAction) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      userDataLogin: payload.data.rememberMe ? payload.data : undefined,
    }
  })
  .handleAction([actions.getAllUser.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      userAll: payload,
    }
  })
  .handleAction([actions.getAllUser.request, actions.getAllUser.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      userAll: {
        data: state.userAll?.data,
        ...payload,
      },
    }
  })
  .handleAction([actions.getCurrentUser.request, actions.getCurrentUser.failure], (state, action) => {
    const payload = (action as IEffectAction).payload

    return {
      ...state,
      currentUserInfo: {
        ...payload,
        data: state.currentUserInfo?.data,
      },
    }
  })
  .handleAction([actions.getCurrentUser.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      currentUserInfo: payload,
    }
  })
  .handleAction(
    [
      actions.changePassword.request,
      actions.changePassword.success,
      actions.changePassword.failure,
      actions.clearUserResetPassword,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        changePasswordStatus: payload,
      }
    },
  )
  .handleAction(
    [
      actions.forgotPassword.request,
      actions.forgotPassword.success,
      actions.forgotPassword.failure,
      actions.clearUserForgotPassword,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        forgotPasswordStatus: payload,
      }
    },
  )
  .handleAction([actions.logout.success], (state, action) => {
    if (!state.userDataLogin?.rememberMe) {
      state.userDataLogin = undefined
    }
    return {
      ...state,
      userCredential: undefined,
      userProfile: undefined,
    }
  })
  .handleType('SET_BASE_URL', (state, action) => {
    return {
      ...state,
      baseURL: action.payload,
    }
  })
  .handleAction(
    [actions.getAllUserCost.request, actions.getAllUserCost.success, actions.getAllUserCost.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        userAllCost: {
          data: state.userAllCost?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.uploadProfilePicture.request,
      actions.uploadProfilePicture.failure,
      actions.uploadProfilePicture.success,
      actions.clearUserUploadProfilePicture,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        userProfilePictureForm: payload,
      }
    },
  )
  .handleAction(
    [
      actions.addOrChangeEmail.request,
      actions.addOrChangeEmail.failure,
      actions.addOrChangeEmail.success,
      actions.clearUserAddOrChangeEmail,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        userAddOrChangeEmailForm: payload,
      }
    },
  )
  .handleAction(
    [
      actions.updatePassword.request,
      actions.updatePassword.failure,
      actions.updatePassword.success,
      actions.clearUserUpdatePassword,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        userUpdatePasswordForm: payload,
      }
    },
  )
  .handleAction(
    [
      actions.syncMasterData.request,
      actions.syncMasterData.failure,
      actions.syncMasterData.success,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        syncMasterDataStatus: payload,
      }
    },
  )
export default userReducer
