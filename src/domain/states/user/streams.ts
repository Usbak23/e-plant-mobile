import { map, catchError, filter, switchMap, tap, concatMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { isActionOf } from 'typesafe-actions'
import * as actions from '@app/domain/states/user/actions'
import { StreamType } from '@app/domain/states/types'
import flux from '@app/domain/states/store'
import AsyncStorage from '@react-native-async-storage/async-storage'

const login: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.login.request)),
    switchMap(action =>
      from(api.authService.login(action.payload.data)).pipe(
        map(({ data }) => {
          return actions.login.success({ loading: false, data: data.response })
        }),
        catchError(error => {
          return of(
            actions.login.failure({ loading: false, error }),
            actions.clearUserProfile(),
            // actions.clearUserLoginForm(),
          )
        }),
      ),
    ),
    tap(next => console.log({ login: next })),
  )
}

const logout: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.logout.request)),
    switchMap(action =>
      from(api.authService.logout()).pipe(
        concatMap(({ data }) => {
          // flux.persistor.purge().then(() => {})
          // AsyncStorage.clear()
          return [actions.logout.success({ loading: false, data: data.response })]
        }),
        catchError(error => of(actions.logout.failure({ loading: false, error }))),
      ),
    ),
  )
}

const forgotPassword: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.forgotPassword.request)),
    switchMap((action: any) =>
      from(api.authService.forgotPassword(action.payload.data)).pipe(
        concatMap(({ data }) => [
          actions.forgotPassword.success({ loading: false, data: data }),
          actions.clearUserForgotPassword(),
        ]),
        catchError(error =>
          of(actions.forgotPassword.failure({ loading: false, error }), actions.clearUserForgotPassword()),
        ),
      ),
    ),
  )
}
const changePassword: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.changePassword.request)),
    switchMap((action: any) =>
      from(api.authService.changePassword(action.payload.data)).pipe(
        concatMap(({ data }) => [
          actions.changePassword.success({ loading: false, data: data }),
          actions.clearUserResetPassword(),
        ]),
        catchError(error =>
          of(actions.changePassword.failure({ loading: false, error }), actions.clearUserResetPassword()),
        ),
      ),
    ),
  )
}

const getAllUser: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAllUser.request)),
    switchMap(action =>
      from(api.userService.getAllUser(action.payload.data)).pipe(
        concatMap(({ data }: any) => {

          if (action?.payload?.next) {
            return [actions.getAllUser.success({ loading: false, data: data.response }), action?.payload?.next]
          }
          return [actions.getAllUser.success({ loading: false, data: data.response })]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getAllUser.failure({ loading: false, error }), action?.payload?.next)
          }
          return of(actions.getAllUser.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const getAllUserCost: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAllUserCost.request)),
    switchMap(action =>
      from(api.userService.getAllUserCost(action.payload.data)).pipe(
        map(({ data }: any) => actions.getAllUserCost.success({ loading: false, data: data.response })),
        catchError(error => {
          return of(actions.getAllUserCost.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const getCurrentUserInfo: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getCurrentUser.request)),
    switchMap(action =>
      from(api.authService.getCurrentUser()).pipe(
        concatMap(({ data }: any) => {
          if (action?.payload?.next) {
            return [actions.getCurrentUser.success({ loading: false, data: data.response }), action?.payload?.next]
          }
          return [actions.getCurrentUser.success({ loading: false, data: data.response })]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getCurrentUser.failure({ loading: false, error }), action?.payload?.next)
          }
          return of(actions.getCurrentUser.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const uploadProfilePicture: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.uploadProfilePicture.request)),
    switchMap(action =>
      from(api.authService.uploadProfilePicture(action.payload.data)).pipe(
        concatMap(({ data }: any) => {
          return [
            actions.uploadProfilePicture.success({ loading: false, data: data }),
            actions.clearUserUploadProfilePicture(),
            actions.getCurrentUser.request({ loading: true }),
          ]
        }),
        catchError(error => {
          return of(actions.uploadProfilePicture.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const addOrChangeEmail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.addOrChangeEmail.request)),
    switchMap(action =>
      from(api.authService.addOrChangeEmail(action.payload.data as { email: string })).pipe(
        concatMap(({ data }: any) => {
          return [
            actions.addOrChangeEmail.success({ loading: false, data: data }),
            actions.clearUserAddOrChangeEmail(),
            actions.getCurrentUser.request({ loading: true }),
          ]
        }),
        catchError(error => {
          return of(actions.addOrChangeEmail.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const updatePassword: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.updatePassword.request)),
    switchMap(action =>
      from(api.authService.updatePassword(action.payload.data as { currentPassword: string; password: string })).pipe(
        concatMap(({ data }: any) => {
          return [
            actions.updatePassword.success({ loading: false, data: data }),
            actions.clearUserUpdatePassword(),
            actions.getCurrentUser.request({ loading: true }),
          ]
        }),
        catchError(error => {
          return of(actions.updatePassword.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

export default [
  login,
  getAllUser,
  logout,
  getAllUserCost,
  getCurrentUserInfo,
  uploadProfilePicture,
  addOrChangeEmail,
  updatePassword,
  forgotPassword,
  changePassword,
]
