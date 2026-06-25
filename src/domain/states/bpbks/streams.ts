import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of, EMPTY} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/bpbks/actions'
import {StreamType} from '@app/domain/states/types'
import {IBPBKSFormDataCreate, IBPBKSFormDataUpdate} from '@app/models/eplant/BPBKS'
import uuid from 'react-native-uuid'
import RNFS from 'react-native-fs'

const autoSyncOnOnline: StreamType = (action$, state$) => {
  return action$.pipe(
    filter((action: any) => action.type === '@@network-connectivity/CONNECTION_CHANGE'),
    filter(() => state$?.value?.network.isConnected),
    concatMap(() => {
      const listTemporary = state$?.value?.bpbks?.bpbksListTemp || []
      const hasPending = listTemporary.some((item: any) => item.syncStatus === 'pending' || item.syncStatus === 'failed')
      if (hasPending) {
        console.log('🔄 Network online: Auto-syncing BPBKS...')
        return of(actions.syncBPBKS())
      }
      return EMPTY
    }),
  )
}

const syncBPBKS: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.syncBPBKS)),
    concatMap(() => {
      const loading = state$?.value?.bpbks.formBPBKSStatus?.loading
      const data = state$?.value?.bpbks.formBPBKSStatus?.data
      const isConnected = state$?.value?.network.isConnected
      const listTemporary = state$?.value?.bpbks?.bpbksListTemp || []
      const lastIndex = listTemporary.length - 1
      const allow = Boolean(
        isConnected && !loading && listTemporary.length > 0 && data?.tempId !== listTemporary[lastIndex].tempId,
      )
      if (!allow) {
        return EMPTY
      }
      return [
        actions.updateBPBKSTempStatus({tempId: listTemporary[lastIndex].tempId!, syncStatus: 'syncing'}),
        actions.createBPBKS.request({loading: true, data: listTemporary[lastIndex]}),
      ]
    }),
  )
}

const createBPBKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createBPBKS.request)),
    switchMap(action => {
      const newData = !action.payload.data?.tempId
      const isConnected = state$?.value?.network.isConnected
      const tempId = uuid.v4()
      if (!isConnected && newData) {
        const tphs = action.payload.data?.tphs?.map(item => ({
          ...item,
          tempId,
          employeeTempId: uuid.v4(),
        }))
        Object.assign(action.payload.data ?? {}, {tempId, tphs}) 

        return of(
          actions.addBPBKSTemp(action.payload.data),
          actions.createBPBKS.success({
            loading: false,
            //@ts-ignore
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormBPBKSStatus(),
          actions.syncBPBKS(),
        )
      }
      return from(api.bpbksService.createBPBKS(action.payload.data as IBPBKSFormDataCreate)).pipe(
        concatMap((data: any) => {
          const syncingTempId = action.payload.data?.tempId
          const createdTphs = data?.data?.response?.tphs || []
          const tphForms = action.payload.data?.tphs || []

          // Upload photos for each TPH after successful create
          const uploadPromises = tphForms.map(async (tph: any, i: number) => {
            const createdTph = createdTphs[i]
            if (!createdTph?.id) return
            
            const photoFields = ['photoFruitFront', 'photoFruitBack', 'photoFruitSide', 'photoKrani'] as const
            const hasPhoto = photoFields.some(field => tph[field]?.uri)
            if (!hasPhoto) return

            // Validasi dan prepare foto dengan metadata lengkap
            const photos: any = {}
            for (const field of photoFields) {
              const photo = tph[field]
              if (photo?.uri) {
                try {
                  // Check if file exists
                  const exists = await RNFS.exists(photo.uri.replace('file://', ''))
                  if (exists) {
                    photos[field] = {
                      uri: photo.uri,
                      type: photo.type || 'image/jpeg',
                      fileName: photo.fileName || `${field}_${Date.now()}.jpg`,
                    }
                  } else {
                    console.warn(`Photo ${field} not found: ${photo.uri}`)
                  }
                } catch (e) {
                  console.warn(`Error validating photo ${field}:`, e)
                }
              }
            }

            // Upload jika ada foto yang valid
            if (Object.keys(photos).length > 0) {
              try {
                await api.bpbksService.uploadPhotos(createdTph.id, photos)
                console.log(`✅ Photos uploaded for TPH ${createdTph.id}`)
              } catch (e: any) {
                console.error(`❌ Photo upload failed for TPH ${createdTph.id}:`, e?.message)
              }
            }
          })

          return from(Promise.all(uploadPromises)).pipe(
            concatMap(() => {
              const result: any[] = [
                actions.createBPBKS.success({loading: false, data}),
                actions.clearFormBPBKSStatus(),
                actions.getBPBKSAll.request({loading: true, data: action.payload.data}),
                actions.syncBPBKS(),
              ]
              if (syncingTempId) result.unshift(actions.deleteBPBKSTemp(action.payload.data) as any)
              return result
            }),
          )
        }),
        catchError(error => {
          const syncingTempId = action.payload.data?.tempId
          if (newData && error.message === 'Network Error') {
            Object.assign(action.payload.data ?? {}, {tempId: uuid.v4()})
            return of(
              actions.addBPBKSTemp(action.payload.data),
              actions.createBPBKS.success({
                loading: false,
                //@ts-ignore
                data: {data: {status: 'success', code: 200, response: action.payload.data}},
              }),
              actions.clearFormBPBKSStatus(),
            )
          }
          // kalau sync retry gagal, tandai failed
          if (syncingTempId) {
            return of(
              actions.updateBPBKSTempStatus({tempId: syncingTempId, syncStatus: 'failed', syncError: error?.message}),
              actions.createBPBKS.failure({loading: false, error}),
              actions.clearFormBPBKSStatus(),
            )
          }
          return of(actions.createBPBKS.failure({loading: false, error}), actions.clearFormBPBKSStatus())
        }),
      )
    }),
  )
}

const editBPBKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editBPBKS.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId
      if (isTemp) {
        return [
          actions.editBPBKSTemp(action.payload.data),
          actions.editBPBKS.success({
            loading: false,
            //@ts-ignore
            data: {data: {status: 'success', code: 200, response: action.payload.data}},
          }),
          actions.clearFormBPBKSStatus(),
        ]
      }
      return from(api.bpbksService.editBPBKS(action.payload.data as IBPBKSFormDataUpdate)).pipe(
        concatMap((data: any) => [
          actions.getBPBKSAll.request({loading: true, data: action.payload.data}),
          actions.editBPBKS.success({loading: false, data}),
          actions.clearFormBPBKSStatus(),
        ]),
        catchError(error => of(actions.editBPBKS.failure({loading: false, error}), actions.clearFormBPBKSStatus())),
      )
    }),
  )
}

const deleteBPBKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteBPBKS.request)),
    switchMap(action => {
      const isTemp = action.payload.data?.tempId != undefined || Boolean(action.payload.data?.isTemp)
      if (isTemp) {
        return of(
          actions.deleteBPBKSEmployeeTemp(action.payload.data),
          actions.deleteBPBKS.success({loading: false, data: action.payload.data}),
          actions.clearDeleteBPBKSStatus(),
        )
      }
      return from(api.bpbksService.deleteBPBKS(action.payload.data?.id as string)).pipe(
        //@ts-ignore
        concatMap(data => [actions.deleteBPBKS.success({loading: false, data}), actions.clearDeleteBPBKSStatus()]),
        catchError(error => of(actions.deleteBPBKS.failure({loading: false, error}), actions.clearDeleteBPBKSStatus())),
      )
    }),
  )
}

const getBPBKSAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBPBKSAll.request)),
    switchMap(action =>
      from(api.bpbksService.getBPBKSAll(action.payload.data as any)).pipe(
        map(({data}: any) =>
          actions.getBPBKSAll.success({loading: false, data: {...data.response, ...action.payload.data}}),
        ),
        catchError(error => {
          return of(actions.getBPBKSAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const clearBpbksDraft: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.clearBpbksDraft.request)),
    switchMap(() => {
      return of(actions.clearBpbksDraft.success({loading: false, data: []}))
    }),
  )
}

export default [createBPBKS, editBPBKS, deleteBPBKS, syncBPBKS, getBPBKSAll, clearBpbksDraft, autoSyncOnOnline]
