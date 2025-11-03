import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/_offline-fetch/constants'

export const fetchAllDataForOfflineMode = createAction(c.OFFLINE_FETCH_REQUEST)()
