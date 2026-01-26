import {createStore, applyMiddleware, compose} from 'redux'
import {combineEpics, createEpicMiddleware} from 'redux-observable'
import {ActionType} from 'typesafe-actions'
import System from '@domain/services/System'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {persistStore, persistReducer} from 'redux-persist'
import reducers, {RootState} from '@domain/states/reducers'
import * as userActions from '@domain/states/user/actions'
import * as leadActions from '@domain/states/leads/actions'
import * as organizationActions from '@domain/states/organization/actions'
import * as divisionActions from '@domain/states/division/actions'
import * as blockActions from '@domain/states/block/actions'
import * as categoryItemActions from '@domain/states/category-item/actions'
import * as masterItemActions from '@domain/states/master-item/actions'
import * as itemActions from '@domain/states/item/actions'
import * as rawMaterialActions from '@domain/states/raw-material/actions'
import * as censusActions from '@domain/states/census/actions'
import * as taxationActions from '@domain/states/taxation/actions'
import * as tonnageGardenActions from '@domain/states/tonnage-garden/actions'
import * as tonnagePksActions from '@domain/states/tonnage-pks/actions'
import userStreams from '@domain/states/user/streams'
import divisionStreams from '@domain/states/division/streams'
import * as masterActions from '@domain/states/master/actions'
import * as tphActions from '@domain/states/tph/actions'
import * as akpActions from '@domain/states/akp/actions'
import * as rkhActions from '@domain/states/rkh/actions'
import * as subActivityActions from '@domain/states/subactivity/actions'
import * as roleActions from '@domain/states/role/actions'
import * as rkhTakeCareActions from '@domain/states/rkh-take-care/actions'
import * as rkhHarvestActions from '@domain/states/rkh-harvest/actions'
import * as attendanceActions from '@domain/states/attendance/actions'
import * as bkmActions from '@domain/states/bkm/actions'
import * as bkmTakeCareActions from '@domain/states/bkm-take-care/actions'
import * as pmaActions from '@domain/states/pma/actions'
import * as bpbksActions from '@domain/states/bpbks/actions'
import * as dashboardActions from '@domain/states/dashboard-and-chart/actions'
import * as offlineActions from '@domain/states/_offline-fetch/actions'
import * as dailyActivityActions from '@domain/states/daily-activity/actions'
import * as maintenanceActions from '@domain/states/maintenance/actions'
import * as requestActions from '@domain/states/request/actions'
import * as fieldReportActions from '@domain/states/field-report/actions'
import * as warehouseActions from '@domain/states/warehouse-management/actions'
import * as realizationFertilizationActions from '@domain/states/realization-fertilization/actions'
import * as approvalActions from '@domain/states/approval/actions'
import * as notificationActions from '@domain/states/notification/actions'
import leadStreams from '@domain/states/leads/streams'
import organizationStreams from '@domain/states/organization/streams'
import masterStreams from '@domain/states/master/streams'
import tphStreams from '@domain/states/tph/streams'
import blockStreams from '@domain/states/block/streams'
import categoryItemStreams from '@domain/states/category-item/streams'
import masterItemStreams from '@domain/states/master-item/streams'
import itemStreams from '@domain/states/item/streams'
import rawMaterialStreams from '@domain/states/raw-material/streams'
import akpStreams from '@domain/states/akp/streams'
import censusStreams from '@domain/states/census/streams'
import taxationStreams from '@domain/states/taxation/streams'
import rkhStreams from '@domain/states/rkh/streams'
import subActivityStreams from '@domain/states/subactivity/streams'
import roleStreams from '@domain/states/role/streams'
import rkhTakeCareStreams from '@domain/states/rkh-take-care/streams'
import rkhHarvestStreams from '@domain/states/rkh-harvest/streams'
import attendanceStreams from '@domain/states/attendance/streams'
import bkmStreams from '@domain/states/bkm/streams'
import bkmTakeCareStreams from '@domain/states/bkm-take-care/streams'
import pmaStreams from '@domain/states/pma/streams'
import bpbksStreams from '@domain/states/bpbks/streams'
import tonnagePKSStreams from '@domain/states/tonnage-pks/streams'
import tonnageGardenStreams from '@domain/states/tonnage-garden/streams'
import dashboardAndChartStreams from './dashboard-and-chart/streams'
import offlineStreams from '@domain/states/_offline-fetch/streams'
import dailyActivityStreams from '@domain/states/daily-activity/streams'
import maintenanceStreams from '@domain/states/maintenance/streams'
import requestStreams from '@domain/states/request/streams'
import fieldReportStreams from '@domain/states/field-report/streams'
import warehouseStreams from '@domain/states/warehouse-management/streams'
import realizationFertilizationStreams from '@domain/states/realization-fertilization/streams'
import approvalStreams from '@domain/states/approval/streams'
import notificationStreams from '@domain/states/notification/streams'

export const actions = {
  ...userActions,
  ...leadActions,
  ...organizationActions,
  ...divisionActions,
  ...masterActions,
  ...tphActions,
  ...blockActions,
  ...categoryItemActions,
  ...masterItemActions,
  ...itemActions,
  ...rawMaterialActions,
  ...akpActions,
  ...censusActions,
  ...taxationActions,
  ...rkhActions,
  ...subActivityActions,
  ...roleActions,
  ...rkhTakeCareActions,
  ...rkhHarvestActions,
  ...attendanceActions,
  ...bkmActions,
  ...pmaActions,
  ...bpbksActions,
  ...tonnageGardenActions,
  ...tonnagePksActions,
  ...bkmTakeCareActions,
  ...dashboardActions,
  ...offlineActions,
  ...dailyActivityActions,
  ...maintenanceActions,
  ...requestActions,
  ...fieldReportActions,
  ...warehouseActions,
  ...realizationFertilizationActions,
  approval: approvalActions,
  notification: notificationActions,
}

const streams = [
  ...userStreams,
  ...leadStreams,
  ...organizationStreams,
  ...divisionStreams,
  ...masterStreams,
  ...tphStreams,
  ...blockStreams,
  ...categoryItemStreams,
  ...masterItemStreams,
  ...itemStreams,
  ...rawMaterialStreams,
  ...akpStreams,
  ...censusStreams,
  ...taxationStreams,
  ...rkhStreams,
  ...subActivityStreams,
  ...roleStreams,
  ...rkhTakeCareStreams,
  ...rkhHarvestStreams,
  ...attendanceStreams,
  ...bkmStreams,
  ...pmaStreams,
  ...bpbksStreams,
  ...tonnageGardenStreams,
  ...tonnagePKSStreams,
  ...bkmTakeCareStreams,
  ...dashboardAndChartStreams,
  ...offlineStreams,
  ...dailyActivityStreams,
  ...maintenanceStreams,
  ...requestStreams,
  ...fieldReportStreams,
  ...warehouseStreams,
  ...realizationFertilizationStreams,
  ...approvalStreams,
  ...notificationStreams,
]

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // storage,
  // blacklist: ['user'],
}

export type RootStateType = RootState
export type ActionsType = ActionType<typeof actions>

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducers)
const streamsMiddleware = createEpicMiddleware<ActionsType, ActionsType, RootStateType>({dependencies: System.instance})

const setupStore = (initialState?: RootStateType) => {
  const middlewares = [streamsMiddleware]
  const enhancer = compose(applyMiddleware(...middlewares))
  return createStore(persistedReducer, initialState, enhancer)
}

const store = setupStore()

let persistor = persistStore(store)

streamsMiddleware.run(combineEpics(...streams))

export default {store, actions, persistor}