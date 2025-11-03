import {createAsyncAction, createAction} from 'typesafe-actions'
import * as c from '@app/domain/states/dashboard-and-chart/constants'
import {IEffectPayload, IError} from '@app/domain/states/types'
import IStdResponse from '@app/models/commons/IStdResponse'
import IStdIframeResponse from '@app/models/commons/IStdIframeResponse'
import clearAction from '../utils/clearAction'
import {
  IDashboardChartRow,
  IProductionOrganizationChartRow,
  IProductionOrganizationRow,
} from '@app/models/eplant/Dashboard'
import {IRKBMaterialTable} from '@app/models/eplant/RKBMaterialTable'
import {create} from 'react-test-renderer'
import {IBPKMaterial} from '@app/models/eplant/BPK'
import {IBlockRow} from '@app/models/eplant/Block'
import {IReportChapelDay, IReportChapelResponse} from '@app/models/eplant/ReportChapel'

export const getAllBlockByDivision = createAsyncAction(
  c.GET_BLOCKS_BY_DIVISION_REQUEST,
  c.GET_BLOCKS_BY_DIVISION_SUCCESS,
  c.GET_BLOCKS_BY_DIVISION_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IBlockRow[], false>, IEffectPayload<null, false, IError>>()

export const refreshMaterializedViews = createAsyncAction(
  c.REFRESH_MATERIALIZED_VIEWS_REQUEST,
  c.REFRESH_MATERIALIZED_VIEWS_SUCCESS,
  c.REFRESH_MATERIALIZED_VIEWS_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdResponse, false>, IEffectPayload<null, false, IError>>()

export const getAKPReport = createAsyncAction(
  c.GET_AKP_REPORT_REQUEST,
  c.GET_AKP_REPORT_SUCCESS,
  c.GET_AKP_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getRRPReport = createAsyncAction(
  c.GET_RRP_REPORT_REQUEST,
  c.GET_RRP_REPORT_SUCCESS,
  c.GET_RRP_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getCropBookReport = createAsyncAction(
  c.GET_CROPBOOK_REPORT_REQUEST,
  c.GET_CROPBOOK_REPORT_SUCCESS,
  c.GET_CROPBOOK_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getAKPPlanningTable = createAsyncAction(
  c.GET_AKP_PLANNING_REQUEST,
  c.GET_AKP_PLANNING_SUCCESS,
  c.GET_AKP_PLANNING_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getAKPRealizationTable = createAsyncAction(
  c.GET_AKP_REALIZATION_REQUEST,
  c.GET_AKP_REALIZATION_SUCCESS,
  c.GET_AKP_REALIZATION_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getRKBTakeCareReport = createAsyncAction(
  c.GET_RKB_TAKE_CARE_REQUEST,
  c.GET_RKB_TAKE_CARE_SUCCESS,
  c.GET_RKB_TAKE_CARE_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getRKBHarvestReport = createAsyncAction(
  c.GET_RKB_HARVEST_REQUEST,
  c.GET_RKB_HARVEST_SUCCESS,
  c.GET_RKB_HARVEST_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getBPBKSReport = createAsyncAction(
  c.GET_BPBKS_REPORT_REQUEST,
  c.GET_BPBKS_REPORT_SUCCESS,
  c.GET_BPBKS_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getYieldReport = createAsyncAction(
  c.GET_YIELD_REPORT_REQUEST,
  c.GET_YIELD_REPORT_SUCCESS,
  c.GET_YIELD_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getRKBMaterialTable = createAsyncAction(
  c.GET_SEE_MATERIAL_RKB_REQUEST,
  c.GET_SEE_MATERIAL_RKB_SUCCESS,
  c.GET_SEE_MATERIAL_RKB_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IRKBMaterialTable, false>, IEffectPayload<null, false, IError>>()

export const getAKPChart = createAsyncAction(
  c.GET_AKP_BAR_CHART_REQUEST,
  c.GET_AKP_BAR_CHART_SUCCESS,
  c.GET_AKP_BAR_CHART_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getBJRReport = createAsyncAction(
  c.GET_BJR_REPORT_REQUEST,
  c.GET_BJR_REPORT_SUCCESS,
  c.GET_BJR_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getEmployeeWagesReport = createAsyncAction(
  c.GET_EMPLOYEE_WAGES_REQUEST,
  c.GET_EMPLOYEE_WAGES_SUCCESS,
  c.GET_EMPLOYEE_WAGES_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getEmployeeWagesDeductionReport = createAsyncAction(
  c.GET_EMPLOYEE_WAGES_DEDUCTION_REQUEST,
  c.GET_EMPLOYEE_WAGES_DEDUCTION_SUCCESS,
  c.GET_EMPLOYEE_WAGES_DEDUCTION_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getPMAReport = createAsyncAction(
  c.GET_PMA_REPORT_REQUEST,
  c.GET_PMA_REPORT_SUCCESS,
  c.GET_PMA_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getTonnageGardenReport = createAsyncAction(
  c.GET_TONNAGE_GARDEN_REPORT_REQUEST,
  c.GET_TONNAGE_GARDEN_REPORT_SUCCESS,
  c.GET_TONNAGE_GARDEN_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getTonnagePKSReport = createAsyncAction(
  c.GET_TONNAGE_PKS_REPORT_REQUEST,
  c.GET_TONNAGE_PKS_REPORT_SUCCESS,
  c.GET_TONNAGE_PKS_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getAllChart = createAsyncAction(c.GET_ALL_CHART_REQUEST, c.GET_ALL_CHART_SUCCESS, c.GET_ALL_CHART_FAILURE)<
  IEffectPayload<any, true>,
  IEffectPayload<IDashboardChartRow[], false>,
  IEffectPayload<null, false, IError>
>()

export const getBPKReport = createAsyncAction(
  c.GET_BPK_REPORT_REQUEST,
  c.GET_BPK_REPORT_SUCCESS,
  c.GET_BPK_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getBPKMaterialReport = createAsyncAction(
  c.GET_BPK_MATERIAL_REPORT_REQUEST,
  c.GET_BPK_MATERIAL_REPORT_SUCCESS,
  c.GET_BPK_MATERIAL_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IBPKMaterial[], false>, IEffectPayload<null, false, IError>>()

export const getBMPReport = createAsyncAction(
  c.GET_BMP_REPORT_REQUEST,
  c.GET_BMP_REPORT_SUCCESS,
  c.GET_BMP_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IStdIframeResponse, false>, IEffectPayload<null, false, IError>>()

export const getChapelReport = createAsyncAction(
  c.GET_CHAPEL_REPORT_REQUEST,
  c.GET_CHAPEL_REPORT_SUCCESS,
  c.GET_CHAPEL_REPORT_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IReportChapelResponse[], false>, IEffectPayload<null, false, IError>>()

export const getProductionOrganization = createAsyncAction(
  c.GET_PRODUCTION_ORGANIZATION_REQUEST,
  c.GET_PRODUCTION_ORGANIZATION_SUCCESS,
  c.GET_PRODUCTION_ORGANIZATION_FAILURE,
)<IEffectPayload<any, true>, IEffectPayload<IProductionOrganizationRow, false>, IEffectPayload<null, false, IError>>()

export const getProductionOrganizationChart = createAsyncAction(
  c.GET_PRODUCTION_ORGANIZATION_CHART_REQUEST,
  c.GET_PRODUCTION_ORGANIZATION_CHART_SUCCESS,
  c.GET_PRODUCTION_ORGANIZATION_CHART_FAILURE,
)<
  IEffectPayload<any, true>,
  IEffectPayload<IProductionOrganizationChartRow, false>,
  IEffectPayload<null, false, IError>
>()

export const clearAllBlocksByDivision = createAction(c.CLEAR_BLOCKS_BY_DIVISION, clearAction)()
export const clearMaterializedViews = createAction(c.CLEAR_MATERIALIZED_VIEWS, clearAction)()
export const clearAkpReport = createAction(c.CLEAR_AKP_REPORT, clearAction)()
export const clearAkpPlanning = createAction(c.CLEAR_AKP_PLANNING, clearAction)()
export const clearAkpRealization = createAction(c.CLEAR_AKP_REALIZATION, clearAction)()
export const clearAkpBarChart = createAction(c.CLEAR_AKP_BAR_CHART, clearAction)()
export const clearAllChart = createAction(c.CLEAR_ALL_CHART, clearAction)()
export const clearRkbTakeCare = createAction(c.CLEAR_RKB_TAKE_CARE_REPORT, clearAction)()
export const clearRkbHarvest = createAction(c.CLEAR_RKB_HARVEST_REPORT, clearAction)()
export const clearRKBMaterialReport = createAction(c.CLEAR_RKB_MAYERIAL, clearAction)()
export const clearBpbksReport = createAction(c.CLEAR_BPBKS_REPORT, clearAction)()
export const clearYieldReport = createAction(c.CLEAR_YIELD_REPORT, clearAction)()
export const clearBJRBlockReport = createAction(c.CLEAR_BJR_REPORT, clearAction)()
export const clearEmployeeWagesReport = createAction(c.CLEAR_EMPLOYEE_WAGES_REPORT, clearAction)()
export const clearEmployeeWageDeductionReport = createAction(c.CLEAR_EMPLOYEE_WAGES_DEDUCTION_REPORT, clearAction)()
export const clearPMAReport = createAction(c.CLEAR_PMA_REPORT, clearAction)()
export const clearTonnageGardenReport = createAction(c.CLEAR_TONNAGE_GARDEN_REPORT, clearAction)()
export const clearTonnagePKSReport = createAction(c.CLEAR_TONNAGE_PKS_REPORT, clearAction)()
export const clearRRPReport = createAction(c.CLEAR_RRP_REPORT, clearAction)()
export const clearCropBookReport = createAction(c.CLEAR_CROPBOOK_REPORT, clearAction)()
export const clearBPKReport = createAction(c.CLEAR_BPK_REPORT, clearAction)()
export const clearBPKMaterialReport = createAction(c.CLEAR_BPK_MATERIAL_REPORT, clearAction)()
export const clearBMPReport = createAction(c.CLEAR_BMP_REPORT, clearAction)()
export const clearChapelReport = createAction(c.CLEAR_CHAPEL_REPORT, clearAction)()
