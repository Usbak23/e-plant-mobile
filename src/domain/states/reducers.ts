import {combineReducers} from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {persistReducer} from 'redux-persist'
import userReducer, {IRSUser} from '@domain/states/user/reducer'
import leadReducer, {IRSLeads} from '@domain/states/leads/reducer'
import masterReducer, {IRSMaster} from '@domain/states/master/reducer'
import organizationReducer, {IRSOrganization} from '@domain/states/organization/reducer'
import {reducer as networkReducer} from 'react-native-offline'
import divisionReducer, {IRSDivision} from './division/reducer'
import tphReducer, {IRSTPH} from './tph/reducer'
import blockReducer, {IRSBlock} from './block/reducer'
import categoryItemReducer, {IRSCategoryItem} from './category-item/reducer'
import masterItemReducer, {IRSMasterItem} from './master-item/reducer'
import itemReducer, {IRSItem} from './item/reducer'
import rawMaterialReducer, {IRSRawMaterial} from './raw-material/reducer'
import akpReducer, {IRSAKP} from './akp/reducer'
import censusReducer, {IRSCensus} from './census/reducer'
import taxationReducer, {IRSTaxation} from './taxation/reducer'
import rkhReducer, {IRSRKH} from './rkh/reducer'
import subActivityReducer, {IRSSubActivity} from './subactivity/reducer'
import roleReducer, {IRSRole} from './role/reducer'
import rkhTakeCareReducer, {IRSRKHTakeCare} from './rkh-take-care/reducer'
import rkhHarvestReducer, {IRSRKHHarvest} from './rkh-harvest/reducer'
import attendanceReducer, {IRSAttendance} from '@domain/states/attendance/reducer'
import bkmReducer, {IRSBKM} from './bkm/reducer'
import bkmTakeCareReducer, {IRSBKMTakeCare} from './bkm-take-care/reducer'
import pmaReducer, {IRSPMA} from '@domain/states/pma/reducer'
import bpbksReducer, {IRSBPBKS} from '@domain/states/bpbks/reducer'
import tonnageGardenReducer, {IRSTonnageGarden} from '@domain/states/tonnage-garden/reducer'
import tonnagePKSReducer, {IRSTonnagePKS} from '@domain/states/tonnage-pks/reducer'
import dashboardAndChartReducer, {IRSDashboardAndChart} from '@domain/states/dashboard-and-chart/reducer'
import dailyActivityReducer, {IRDailyActivity} from './daily-activity/reducer'
import maintenanceReducer, {IRSMaintenance} from './maintenance/reducer'
import requestReducer, {IRSRequests} from './request/reducer'
import fieldReportReducer, {IRSFieldReport} from './field-report/reducers'
import warehouseReducer, {IRSWarehouseManagement} from './warehouse-management/reducer'
import realizationFertilizationReducer, {IRSRealizationFertilization} from './realization-fertilization/reducer'
import approvalReducer, {ApprovalState} from './approval/reducers'
import notificationReducer, {INotificationState} from './notification/reducer'
import syncQueueReducer, {IRSSyncQueue} from './sync-queue/reducer'
import monitoringTphReducer, {IRSMonitoringTph} from './monitoring-tph/reducer'
import spbLocalReducer, {IRSSpbLocal} from './spb-local/reducer'

export type RootState = {
  user: IRSUser
  lead: IRSLeads
  organization: IRSOrganization
  division: IRSDivision
  block: IRSBlock
  network: {
    isConnected: boolean
  }
  master: IRSMaster
  tph: IRSTPH
  categoryItem: IRSCategoryItem
  masterItem: IRSMasterItem
  item: IRSItem
  rawMaterial: IRSRawMaterial
  akp: IRSAKP
  census: IRSCensus
  taxation: IRSTaxation
  rkh: IRSRKH
  rkhTakeCare: IRSRKHTakeCare
  role: IRSRole
  subActivity: IRSSubActivity
  rkhHarvest: IRSRKHHarvest
  attendanceReducer: IRSAttendance
  bkm: IRSBKM
  pma: IRSPMA
  bpbks: IRSBPBKS
  tonnageGarden: IRSTonnageGarden
  tonnagePKS: IRSTonnagePKS
  bkmTakeCare: IRSBKMTakeCare
  dashboardAndChart: IRSDashboardAndChart
  dailyActivityReducer: IRDailyActivity
  maintenanceReducer: IRSMaintenance
  requestReducer: IRSRequests
  fieldReportReducer: IRSFieldReport
  warehouseReducer: IRSWarehouseManagement
  realizationFertilizationReducer: IRSRealizationFertilization
  approval: ApprovalState
  notification: INotificationState
  syncQueue: IRSSyncQueue
  monitoringTph: IRSMonitoringTph
  spbLocal: IRSSpbLocal
}

const defaultConfig = {
  storage: AsyncStorage,
}

const reducers = combineReducers({
  user: persistReducer(
    {
      ...defaultConfig,
      key: 'user',
      blacklist: ['userCredential.loading', 'userCredential.error', 'userProfile.loading', 'userProfile.error'],
    },
    userReducer,
  ),
  lead: leadReducer,
  organization: persistReducer(
    {
      ...defaultConfig,
      key: 'organization',
      blacklist: [
        'formOrganizationStatus',
        'deleteOrganizationStatus',
        'organizationAll.loading',
        'organizationAll.error',
        'organizationList',
        'organizationDetail',
      ],
    },
    organizationReducer,
  ), //here to save on persist to
  division: persistReducer(
    {
      ...defaultConfig,
      key: 'division',
      blacklist: [
        'divisionList',
        'formDivisionStatus',
        'deleteDivisionStatus',
        'divisionDetail',
        'divisionAll.loading',
        'divisionAll.error',
      ],
    },
    divisionReducer,
  ),
  network: networkReducer,
  tph: persistReducer(
    {
      ...defaultConfig,
      key: 'tph',
      blacklist: ['formTPHStatus', 'deleteTPHStatus', 'tphAll.error', 'tphAll.loading', 'tphList', 'tphDetail'],
    },
    tphReducer,
  ),
  master: persistReducer(
    {
      ...defaultConfig,
      key: 'master',
      blacklist: [
        'minimumAkp.loading',
        'minimumAkp.error',
        'uoms.loading',
        'uoms.error',
        'rangeYear.loading',
        'rangeYear.error',
        'rangeBreakTime.loading',
        'rangeBreakTime.error',
        'typeEmployees',
        'supervisions.loading',
        'supervisions.error',
        'workStatuses.loading',
        'workStatuses.error',
      ],
    },
    masterReducer,
  ),
  block: persistReducer(
    {
      ...defaultConfig,
      key: 'block',
      blacklist: [
        'formCreateBlockStatus',
        'blockList',
        'deleteBlockStatus',
        'blockDetail',
        'blockAll.loading',
        'blockAll.error',
        'foremanList',
      ],
    },
    blockReducer,
  ),
  categoryItem: persistReducer(
    {
      ...defaultConfig,
      key: 'categoryItem',
      blacklist: [
        'formCategoryItemStatus',
        'deleteCategoryItemStatus',
        'categoryItemAll.loading',
        'categoryItemAll.error',
        'categoryItemList',
        'categoryItemDetail',
      ],
    },
    categoryItemReducer,
  ),
  masterItem: persistReducer(
    {
      ...defaultConfig,
      key: 'masterItem',
      blacklist: [
        'formMasterItemStatus',
        'deleteMasterItemStatus',
        'masterItemAll.loading',
        'masterItemAll.error',
        'masterItemList',
        'masterItemDetail',
      ],
    },
    masterItemReducer,
  ),
  item: persistReducer(
    {
      ...defaultConfig,
      key: 'item',
      blacklist: ['formItemStatus', 'deleteItemStatus', 'itemAll.loading', 'itemAll.error', 'itemList', 'itemDetail'],
    },
    itemReducer,
  ),
  rawMaterial: persistReducer(
    {
      ...defaultConfig,
      key: 'rawMaterial',
      blacklist: [
        'formRawMaterialStatus',
        'formPurchasementHistoryStatus',
        'formReceptionHistoryStatus',
        'rawMaterialList',
        'purchasementHistoryList',
        'receptionHistoryList',
        'rawMaterialDetail',
        'deleteRawMaterialStatus',
        'normMaterial',
        'rawMaterialAll.loading',
        'rawMaterialAll.error',
        'normaSubactivities.loading',
        'normaSubactivities.error',
      ],
    },
    rawMaterialReducer,
  ),
  akp: persistReducer(
    {
      ...defaultConfig,
      key: 'akp',
      blacklist: ['formAKPStatus', 'deleteAKPStatus', 'akpList', 'akpDetail', 'akpAll.loading', 'akpAll.error'],
    },
    akpReducer,
  ),
  census: censusReducer,
  taxation: taxationReducer,
  rkh: persistReducer(
    {
      ...defaultConfig,
      key: 'rkh',
      blacklist: ['formRKHStatus', 'deleteRKHStatus', 'rkhList', 'rkhDetail', 'rkhAll.loading', 'rkhAll.error'],
    },
    rkhReducer,
  ),
  rkhTakeCare: persistReducer(
    {
      ...defaultConfig,
      key: 'rkhTakeCare',
      blacklist: [
        'formRKHTakeCareStatus',
        'deleteRKHTakeCareStatus',
        'rkhTakeCareDetail',
        'rkhTakeCareList.loading',
        'rkhTakeCareList.error',
      ],
    },
    rkhTakeCareReducer,
  ),
  subActivity: persistReducer(
    {
      ...defaultConfig,
      key: 'subActivity',
      blacklist: ['subActivityAll.loading', 'subActivityAll.error'],
    },
    subActivityReducer,
  ),
  role: persistReducer(
    {
      ...defaultConfig,
      key: 'role',
      blacklist: ['roleAll.loading', 'roleAll.error'],
    },
    roleReducer,
  ),
  rkhHarvest: persistReducer(
    {
      ...defaultConfig,
      key: 'rkhHarvest',
      blacklist: ['rkhHarvestDetail', 'rkhHarvestAll.loading', 'rkhHarvestAll.error'],
    },
    rkhHarvestReducer,
  ),
  attendanceReducer: persistReducer(
    {
      ...defaultConfig,
      key: 'attendance',
      blacklist: ['attendanceList', 'formAttendanceStatus', 'deleteAttendanceStatus'],
    },
    attendanceReducer,
  ),
  bkm: persistReducer(
    {
      ...defaultConfig,
      key: 'bkm',
      blacklist: ['formBKMStatus', 'deleteBKMStatus', 'bkmList', 'bkmDetail', 'bkmDetailMobile'],
    },
    bkmReducer,
  ),
  pma: persistReducer(
    {
      ...defaultConfig,
      key: 'pma',
      blacklist: [
        'formPMAStatus',
        'formEmployeeStatus',
        'deletePMAStatus',
        'pmaList.loading',
        'pmaList.error',
        'pmaLists',
        'pmaDetail',
      ],
    },
    pmaReducer,
  ),
  bpbks: persistReducer(
    {
      ...defaultConfig,
      key: 'bpbks',
      blacklist: ['formBPBKSStatus', 'deleteBPBKSStatus', 'bpbksAll.loading', 'bpbksAll.error'],
    },
    bpbksReducer,
  ),
  tonnageGarden: persistReducer(
    {
      ...defaultConfig,
      key: 'tonnageGarden',
      blacklist: [
        'formTonnageGardenStatus',
        'deleteTonnageGardenStatus',
        'tonnageGardenList',
        'tonnageGardenDetail',
        'tonnageGardenAll.loading',
        'tonnageGardenAll.error',
        'tonnageGardenWithoutPKS.loading',
        'tonnageGardenWithoutPKS.error',
        'draftOptions.loading',
        'draftOptions.error',
      ],
    },
    tonnageGardenReducer,
  ), // ← draftOptions.data DI-PERSIST untuk offline access ✅
  tonnagePKS: tonnagePKSReducer,
  bkmTakeCare: persistReducer(
    {
      ...defaultConfig,
      key: 'bkmTakeCare',
      blacklist: [
        'formBKMTakeCareStatus',
        'deleteBKMTakeCareStatus',
        'bkmTakeCareList.loading',
        'bkmTakeCareList.error',
        'bkmTakeCareDetail',
        'bkmTakeCareDetailMobile',
      ],
    },
    bkmTakeCareReducer,
  ),
  dashboardAndChart: dashboardAndChartReducer,
  dailyActivityReducer: dailyActivityReducer,
  maintenanceReducer: maintenanceReducer,
  requestReducer: requestReducer,
  fieldReportReducer: fieldReportReducer,
  warehouseReducer: warehouseReducer,
  realizationFertilizationReducer: realizationFertilizationReducer,
  approval: approvalReducer,
  notification: notificationReducer,
  syncQueue: persistReducer(
    {
      ...defaultConfig,
      key: 'syncQueue',
    },
    syncQueueReducer,
  ),
  monitoringTph: monitoringTphReducer,
  spbLocal: persistReducer(
    {
      ...defaultConfig,
      key: 'spbLocal',
      blacklist: ['list.loading', 'list.error', 'detail.loading', 'detail.error', 'formStatus', 'deleteStatus'],
    },
    spbLocalReducer,
  ),
})

export default reducers