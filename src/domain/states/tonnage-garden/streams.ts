import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/tonnage-garden/actions'
import {StreamType} from '@app/domain/states/types'
import {
  ITonnageGardenBlockFormData,
  ITonnageGardenFileFormData,
  ITonnageGardenFormData,
} from '@app/models/eplant/TonnageGarden'

const uploadTonnageGarden: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.uploadTonnageGarden.request)),
    switchMap(action => {
      return from(
        api.tonnageGarderService.uploadFileTonnageGarden(action.payload.data as ITonnageGardenFileFormData),
      ).pipe(
        concatMap((data: any) => [
          actions.uploadTonnageGarden.success({loading: false, data}),
          actions.clearFormTonnageGardenStatus(),
        ]),
        catchError(error => {
          return of(
            actions.uploadTonnageGarden.failure({loading: false, error}),
            actions.clearFormTonnageGardenStatus(),
          )
        }),
      )
    }),
  )
}
const createTonnageGarden: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.createTonnageGarden.request)),
    switchMap(action => {
      return from(api.tonnageGarderService.createTonnageGarden(action.payload.data as ITonnageGardenFormData)).pipe(
        concatMap((data: any) => [
          actions.createTonnageGarden.success({loading: false, data}),
          actions.clearFormTonnageGardenStatus(),
        ]),
        catchError(error => {
          return of(
            actions.createTonnageGarden.failure({loading: false, error}),
            actions.clearFormTonnageGardenStatus(),
          )
        }),
      )
    }),
  )
}

const editTonnageGarden: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.updateTonnageGarden.request)),
    switchMap(action => {
      return from(api.tonnageGarderService.updateTonnageGarden(action.payload.data as ITonnageGardenFormData)).pipe(
        concatMap((data: any) => {
          return [actions.updateTonnageGarden.success({loading: false, data}), actions.clearFormTonnageGardenStatus()]
        }),
        catchError(error =>
          of(actions.updateTonnageGarden.failure({loading: false, error}), actions.clearFormTonnageGardenStatus()),
        ),
      )
    }),
  )
}

const deleteTonnageGarden: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.deleteTonnageGarden.request)),
    switchMap(action => {
      return from(api.tonnageGarderService.deleteTonnageGarden(action.payload.data as string)).pipe(
        concatMap(data => [
          actions.deleteTonnageGarden.success({loading: false, data}),
          actions.clearDeleteTonnageGardenStatus(),
        ]),
        catchError(error =>
          of(actions.deleteTonnageGarden.failure({loading: false, error}), actions.clearDeleteTonnageGardenStatus()),
        ),
      )
    }),
  )
}

const getTonnageGardenPaginated: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTonnageGardenPaginated.request)),
    switchMap(action =>
      from(api.tonnageGarderService.getTonnageGardenPaginated(action.payload.data)).pipe(
        map(({data}: any) => actions.getTonnageGardenPaginated.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getTonnageGardenPaginated.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getTonnageGardenAll: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTonnageGardenAll.request)),
    switchMap(action =>
      from(api.tonnageGarderService.getTonnageGardenAll(action.payload.data)).pipe(
        map(({data}: any) => actions.getTonnageGardenAll.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getTonnageGardenAll.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getTonnageGardenWithoutPKS: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTonnageGardenWithoutPKS.request)),
    switchMap(action =>
      from(api.tonnageGarderService.getTonnageGardenAll(action.payload.data)).pipe(
        map(({data}: any) => actions.getTonnageGardenWithoutPKS.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getTonnageGardenWithoutPKS.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

const getTonnageGardenDetail: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTonnageGardenDetail.request)),
    switchMap(action =>
      from(api.tonnageGarderService.detailTonnageGarden(action.payload.data)).pipe(
        map(({data}: any) => actions.getTonnageGardenDetail.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getTonnageGardenDetail.failure({loading: false, error}))
        }),
      ),
    ),
  )
}

export default [
  createTonnageGarden,
  editTonnageGarden,
  deleteTonnageGarden,
  getTonnageGardenDetail,
  getTonnageGardenAll,
  getTonnageGardenPaginated,
  uploadTonnageGarden,
  getTonnageGardenWithoutPKS,
]
