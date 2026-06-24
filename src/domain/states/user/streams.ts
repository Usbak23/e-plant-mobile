import { map, catchError, filter, switchMap, tap, concatMap, mergeMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { isActionOf } from 'typesafe-actions'
import * as actions from '@app/domain/states/user/actions'
import { StreamType } from '@app/domain/states/types'
import flux from '@app/domain/states/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

// Import actions directly untuk pre-fetch
import * as organizationActions from '@app/domain/states/organization/actions'
import * as divisionActions from '@app/domain/states/division/actions'
import * as blockActions from '@app/domain/states/block/actions'
import * as tphActions from '@app/domain/states/tph/actions'
import * as subActivityActions from '@app/domain/states/subactivity/actions'
import * as roleActions from '@app/domain/states/role/actions'
import * as categoryItemActions from '@app/domain/states/category-item/actions'
import * as masterItemActions from '@app/domain/states/master-item/actions'
import * as itemActions from '@app/domain/states/item/actions'
import * as rawMaterialActions from '@app/domain/states/raw-material/actions'
import * as masterActions from '@app/domain/states/master/actions'
import * as tonnageGardenActions from '@app/domain/states/tonnage-garden/actions'
import * as monitoringTphActions from '@app/domain/states/monitoring-tph/actions'

const login: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.login.request)),
    switchMap(action =>
      from(api.authService.login(action.payload.data)).pipe(
        concatMap(({ data }) => {
          console.log('✅ Login successful!')
          console.log('🔍 Checking available actions...')
          console.log('- organizationActions:', !!organizationActions)
          console.log('- divisionActions:', !!divisionActions)
          console.log('- blockActions:', !!blockActions)
          console.log('- tphActions:', !!tphActions)
          console.log('- tonnageGardenActions:', !!tonnageGardenActions)
          
          const actionsToDispatch: any[] = [
            actions.login.success({ loading: false, data: data.response }),
            actions.getCurrentUser.request({ loading: false }),
          ]
          
          // Pre-fetch master data dengan error handling
          console.log('📦 Pre-fetching master data for offline access...')
          
          try {
            // Organizations
            if (organizationActions?.getOrganizationAll?.request) {
              actionsToDispatch.push(organizationActions.getOrganizationAll.request({ loading: false }))
            }
            
            // Divisions
            if (divisionActions?.getAllDivision?.request) {
              actionsToDispatch.push(divisionActions.getAllDivision.request({ loading: false }))
            }
            
            // Users
            if (actions?.getAllUser?.request) {
              actionsToDispatch.push(actions.getAllUser.request({ loading: false }))
            }
            
            // TPH
            if (tphActions?.getTPHAll?.request) {
              actionsToDispatch.push(tphActions.getTPHAll.request({ loading: false }))
            }
            
            // Monitoring TPH
            if (monitoringTphActions?.getMonitoringTphList?.request) {
              actionsToDispatch.push(monitoringTphActions.getMonitoringTphList.request({ loading: false }))
            }
            
            // Blocks
            if (blockActions?.getAllBlock?.request) {
              actionsToDispatch.push(blockActions.getAllBlock.request({ loading: false }))
            }
            
            // Sub Activities
            if (subActivityActions?.getSubActivityAll?.request) {
              actionsToDispatch.push(subActivityActions.getSubActivityAll.request({ loading: false }))
            }
            
            // Roles
            if (roleActions?.getRoleAll?.request) {
              actionsToDispatch.push(roleActions.getRoleAll.request({ loading: false }))
            }
            
            // Category Items
            if (categoryItemActions?.getCategoryItemAll?.request) {
              actionsToDispatch.push(categoryItemActions.getCategoryItemAll.request({ loading: false }))
            }
            
            // Master Items
            if (masterItemActions?.getMasterItemAll?.request) {
              actionsToDispatch.push(masterItemActions.getMasterItemAll.request({ loading: false }))
            }
            
            // Items
            if (itemActions?.getItemAll?.request) {
              actionsToDispatch.push(itemActions.getItemAll.request({ loading: false }))
            }
            
            // Raw Materials
            if (rawMaterialActions?.getRawMaterialAll?.request) {
              actionsToDispatch.push(rawMaterialActions.getRawMaterialAll.request({ loading: false }))
            }
            
            // Master data lainnya
            if (masterActions?.getMinimumAkp?.request) {
              actionsToDispatch.push(masterActions.getMinimumAkp.request({ loading: false }))
            }
            
            if (masterActions?.getUoms?.request) {
              actionsToDispatch.push(masterActions.getUoms.request({ loading: false }))
            }
            
            if (masterActions?.getSupervisions?.request) {
              actionsToDispatch.push(masterActions.getSupervisions.request({ loading: false }))
            }
            
            if (masterActions?.getWorkStatuses?.request) {
              actionsToDispatch.push(masterActions.getWorkStatuses.request({ loading: false }))
            }
            
            console.log(`✅ Dispatched ${actionsToDispatch.length} pre-fetch actions`)
          } catch (error) {
            console.error('❌ Error preparing pre-fetch actions:', error)
          }
          
          return actionsToDispatch
        }),
        catchError(error => {
          console.error('❌ Login failed:', error)
          return of(
            actions.login.failure({ loading: false, error }),
            actions.clearUserProfile(),
          )
        }),
      ),
    ),
    tap(next => console.log({ loginStream: next.type })),
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
          const currentUser = data.response
          const actionsToDispatch: any[] = [
            actions.getCurrentUser.success({ loading: false, data: currentUser })
          ]
          
          console.log('🔍 Current user data:', {
            hasUser: !!currentUser,
            hasOrg: !!currentUser?.organization,
            orgId: currentUser?.organization?.id,
          })
          
          // Pre-fetch draft options untuk 3 hari (hari ini + 2 hari ke depan)
          // Hanya jika user punya organization
          if (currentUser?.organization?.id) {
            console.log('📦 Pre-fetching draft options for next 3 days...')
            console.log('- Organization ID:', currentUser.organization.id)
            
            try {
              console.log('- Checking tonnageGardenActions:', !!tonnageGardenActions)
              console.log('- Checking getDraftOptions:', !!tonnageGardenActions?.getDraftOptions)
              console.log('- Checking request:', !!tonnageGardenActions?.getDraftOptions?.request)
              
              if (tonnageGardenActions?.getDraftOptions?.request) {
                const today = moment()
                console.log('- Today:', today.format('YYYY-MM-DD'))
                
                for (let i = 0; i < 3; i++) {
                  const date = today.clone().add(i, 'days').format('YYYY-MM-DD')
                  console.log(`- Fetching draft options for day ${i}: ${date}`)
                  actionsToDispatch.push(
                    tonnageGardenActions.getDraftOptions.request({
                      loading: false,
                      data: {
                        organizationId: currentUser.organization.id,
                        date: date,
                      },
                    })
                  )
                }
                console.log('✅ Dispatched draft options fetch for 3 days')
              } else {
                console.warn('⚠️ getDraftOptions action not available')
              }
            } catch (error) {
              console.error('❌ Error dispatching draft options:', error)
            }
          } else {
            console.warn('⚠️ User has no organization, skipping draft options fetch')
          }
          
          if (action?.payload?.next) {
            actionsToDispatch.push(action.payload.next)
          }
          
          return actionsToDispatch
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

const syncMasterData: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.syncMasterData.request)),
    switchMap(action => {
      const actionsToDispatch: any[] = []
      
      try {
        // Organizations
        if (organizationActions?.getOrganizationAll?.request) {
          actionsToDispatch.push(organizationActions.getOrganizationAll.request({ loading: false }))
        }
        
        // Divisions
        if (divisionActions?.getAllDivision?.request) {
          actionsToDispatch.push(divisionActions.getAllDivision.request({ loading: false }))
        }
        
        // Users
        if (actions?.getAllUser?.request) {
          actionsToDispatch.push(actions.getAllUser.request({ loading: false }))
        }
        
        // TPH
        if (tphActions?.getTPHAll?.request) {
          actionsToDispatch.push(tphActions.getTPHAll.request({ loading: false }))
        }
        
        // Monitoring TPH
        if (monitoringTphActions?.getMonitoringTphList?.request) {
          actionsToDispatch.push(monitoringTphActions.getMonitoringTphList.request({ loading: false }))
        }
        
        // Blocks
        if (blockActions?.getAllBlock?.request) {
          actionsToDispatch.push(blockActions.getAllBlock.request({ loading: false }))
        }
        
        // Sub Activities
        if (subActivityActions?.getSubActivityAll?.request) {
          actionsToDispatch.push(subActivityActions.getSubActivityAll.request({ loading: false }))
        }
        
        // Roles
        if (roleActions?.getRoleAll?.request) {
          actionsToDispatch.push(roleActions.getRoleAll.request({ loading: false }))
        }
        
        // Category Items
        if (categoryItemActions?.getCategoryItemAll?.request) {
          actionsToDispatch.push(categoryItemActions.getCategoryItemAll.request({ loading: false }))
        }
        
        // Master Items
        if (masterItemActions?.getMasterItemAll?.request) {
          actionsToDispatch.push(masterItemActions.getMasterItemAll.request({ loading: false }))
        }
        
        // Items
        if (itemActions?.getItemAll?.request) {
          actionsToDispatch.push(itemActions.getItemAll.request({ loading: false }))
        }
        
        // Raw Materials
        if (rawMaterialActions?.getRawMaterialAll?.request) {
          actionsToDispatch.push(rawMaterialActions.getRawMaterialAll.request({ loading: false }))
        }
        
        // Master data lainnya
        if (masterActions?.getMinimumAkp?.request) {
          actionsToDispatch.push(masterActions.getMinimumAkp.request({ loading: false }))
        }
        
        if (masterActions?.getUoms?.request) {
          actionsToDispatch.push(masterActions.getUoms.request({ loading: false }))
        }
        
        if (masterActions?.getSupervisions?.request) {
          actionsToDispatch.push(masterActions.getSupervisions.request({ loading: false }))
        }
        
        if (masterActions?.getWorkStatuses?.request) {
          actionsToDispatch.push(masterActions.getWorkStatuses.request({ loading: false }))
        }
        
        // Draft options (3 hari ke depan)
        const currentUser = state$.value.user?.currentUserInfo?.data
        let organizationId = currentUser?.organization?.id
        
        // Fallback: ambil dari userDivisions jika tidak ada
        if (!organizationId && currentUser?.userDivisions && currentUser.userDivisions.length > 0) {
          organizationId = currentUser.userDivisions[0]?.division?.organization?.id
        }
        
        if (organizationId && tonnageGardenActions?.getDraftOptions?.request) {
          const today = moment()
          for (let i = 0; i < 3; i++) {
            const date = today.clone().add(i, 'days').format('YYYY-MM-DD')
            actionsToDispatch.push(
              tonnageGardenActions.getDraftOptions.request({
                loading: false,
                data: {
                  organizationId: organizationId,
                  date: date,
                },
              })
            )
          }
        }
        
        // Hitung total actions sebelum menambahkan success action
        const totalSyncActions = actionsToDispatch.length
        actionsToDispatch.push(actions.syncMasterData.success({ loading: false, data: { synced: totalSyncActions } }))
        
        return from(actionsToDispatch)
      } catch (error) {
        return of(actions.syncMasterData.failure({ loading: false, error: error as any }))
      }
    }),
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
  syncMasterData,
]
