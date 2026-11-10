import { map, catchError, filter, switchMap, concatMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { isActionOf } from 'typesafe-actions'
import * as actions from '@app/domain/states/tph/actions'
import { StreamType } from '@app/domain/states/types'
import { ITPHFormData, ITPHRowAll } from '@app/models/eplant/TPH'
import TPH from '@app/models/schema/tphs'
import { database } from '@root/index'
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord'
import protectedFunction from './../../utils/protectedFunction'

const createTPH: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createTPH.request)),
    switchMap(action => {
      return from(api.tphService.createTPH(action.payload.data as ITPHFormData)).pipe(
        concatMap((data: any) => [actions.createTPH.success({ loading: false, data }), actions.clearFormTPHStatus()]),
        catchError(error => {
          return of(actions.createTPH.failure({ loading: false, error }), actions.clearFormTPHStatus())
        }),
      )
    }),
  )
}

const editTPH: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editTPH.request)),
    switchMap(action => {
      return from(api.tphService.editTPH(action.payload.data as ITPHFormData)).pipe(
        concatMap((data: any) => {
          return [actions.editTPH.success({ loading: false, data }), actions.clearFormTPHStatus()]
        }),
        catchError(error => of(actions.editTPH.failure({ loading: false, error }), actions.clearFormTPHStatus())),
      )
    }),
  )
}

const deleteTPH: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteTPH.request)),
    switchMap(action => {
      return from(api.tphService.deleteTPH(action.payload.data as string)).pipe(
        concatMap(data => [actions.deleteTPH.success({ loading: false, data }), actions.clearDeleteTPHStatus()]),
        catchError(error => of(actions.deleteTPH.failure({ loading: false, error }), actions.clearDeleteTPHStatus())),
      )
    }),
  )
}
const getTPHLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTPHLists.request)),
    switchMap(action =>
      from(api.tphService.getTPHLists(action.payload.data)).pipe(
        map(({ data }: any) => actions.getTPHLists.success({ loading: false, data: data.response })),
        catchError(error => {
          return of(actions.getTPHLists.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const getTPHDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTPHDetail.request)),
    switchMap(action =>
      from(api.tphService.getTPHDetail(action.payload.data)).pipe(
        map(({ data }: any) => actions.getTPHDetail.success({ loading: false, data: data.response })),
        catchError(error => {
          return of(actions.getTPHDetail.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}
const getTPHAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTPHAll.request)),
    switchMap(action =>
      from(api.tphService.getTPHAll(action.payload.data)).pipe(
        concatMap(({ data }: any) => {
          writeToDb(data?.response)
          if (action?.payload?.next) {
            return [actions.getTPHAll.success({ loading: false, data: data.response }), action?.payload?.next]
          }
          return [actions.getTPHAll.success({ loading: false, data: data.response })]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getTPHAll.failure({ loading: false, error }), action?.payload?.next)
          }
          return of(actions.getTPHAll.failure({ loading: false, error }))
        }),
      ),
    ),
  )
}

const writeToDb = async (tphs: any[]) => {
  try {
    const db = database
    await db.write(async () => {
      const tphCollections = db.collections.get('tphs')
      const allTPHOnDatabase = await db.collections.get('tphs').query().fetch()

      const deleted = allTPHOnDatabase.map(c => c.prepareDestroyPermanently())
      await db.batch(...deleted)

      // // Create
      const dataToInsert = tphs.map(mTph =>
        tphCollections.prepareCreate(
          protectedFunction(r => {
            r._raw = sanitizedRaw(
              {
                id: mTph.id,
                name: mTph.name,
                block: JSON.stringify(mTph.block),
                print_version: mTph.printVersion ?? null,
              },
              tphCollections.schema
            )
          })
        ),
      )


      try {
        await db.batch(dataToInsert)
      } catch (e) {
        console.log('Failed batch insert', e)
      }
    })

  } catch (e) {
    console.log('error writing to db', e)
  }
}

export default [createTPH, editTPH, deleteTPH, getTPHLists, getTPHAll, getTPHDetail]
