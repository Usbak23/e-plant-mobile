import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/block/actions'
import {StreamType} from '@app/domain/states/types'
import {IBlockFormData} from '@app/models/eplant/Block'

const getAllForeman: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAllForemanX.request)),
    switchMap(action => {
      return from(api.blockService.getAllForeman()).pipe(
        concatMap((data: any) => {
          if (action?.payload?.next) {
            return [actions.getAllForemanX.success({loading: false, data: data.data.response}), action?.payload?.next]
          }
          return [actions.getAllForemanX.success({loading: false, data: data.data.response})]
        }),
        catchError(error => {
          if (action?.payload?.next) {
            return of(actions.getAllForemanX.failure({loading: false, error}), action?.payload?.next)
          }
          return of(actions.getAllForemanX.failure({loading: false, error}))
        }),
      )
    }),
  )
}

const createBlock: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createBlock.request)),
    switchMap(action => {
      return from(api.blockService.createBlock(action.payload.data as IBlockFormData)).pipe(
        concatMap((data: any) => [actions.createBlock.success({loading: false, data}), actions.clearFormBlockStatus()]),
        catchError(error => {
          return of(actions.createBlock.failure({loading: false, error}), actions.clearFormBlockStatus())
        }),
      )
    }),
  )
}

const editBlock: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.editBlock.request)),
    switchMap(action => {
      return from(api.blockService.editBlock(action.payload.data as IBlockFormData)).pipe(
        concatMap((data: any) => [actions.editBlock.success({loading: false, data}), actions.clearFormBlockStatus()]),
        catchError(error => {
          return of(actions.editBlock.failure({loading: false, error}), actions.clearFormBlockStatus())
        }),
      )
    }),
  )
}

const getBlockLists: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBlocksList.request)),
    switchMap(action =>
      from(api.blockService.getBlocksPaginated(action.payload.data)).pipe(
        map(({data}: any) => actions.getBlocksList.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getBlocksList.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const deleteBlock: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteBlock.request)),
    switchMap(action => {
      return from(api.blockService.deleteBlock(action.payload.data as string)).pipe(
        concatMap((data: any) => [
          actions.deleteBlock.success({loading: false, data}),
          actions.clearDeleteBlockStatus(),
        ]),
        catchError(error => of(actions.deleteBlock.failure({loading: false, error}), actions.clearDeleteBlockStatus())),
      )
    }),
  )
}

const getDetailBlock: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.detailBlock.request)),
    switchMap(action => {
      return from(api.blockService.getDetailBlock(action.payload.data as string)).pipe(
        map((data: any) => actions.detailBlock.success({loading: false, data: data.data.response})),
        catchError(error => of(actions.detailBlock.failure({loading: false, error}))),
      )
    }),
  )
}

const getAllBlock: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAllBlock.request)),
    switchMap(action =>
      from(api.blockService.getAllBlock(action.payload.data)).pipe(
        map(({data}: any) => actions.getAllBlock.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getAllBlock.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [createBlock, getBlockLists, editBlock, deleteBlock, getDetailBlock, getAllBlock, getAllForeman]
