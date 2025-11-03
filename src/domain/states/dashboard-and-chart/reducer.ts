import {createReducer} from 'typesafe-actions'
import * as actions from '@app/domain/states/dashboard-and-chart/actions'
import {ActionsType} from '@app/domain/states/store'
import {IEffectAction, IEffectPayload} from '@app/domain/states/types'
import {IEmployeeWageRow} from '@app/models/eplant/EmployeeWage'
import {IProductionOrganizationChartRow, IProductionOrganizationRow} from '@app/models/eplant/Dashboard'

export interface IRSDashboardAndChart {
  blockAll?: IEffectPayload
  akpReport?: IEffectPayload
  rrpReport?: IEffectPayload
  cropBookReport?: IEffectPayload
  akpPlanningTable?: IEffectPayload
  akpRealizationTable?: IEffectPayload
  akpBarChart?: IEffectPayload
  rkbTakeCare?: IEffectPayload
  rkbHarvest?: IEffectPayload
  bpbksReport?: IEffectPayload
  yieldReport?: IEffectPayload
  rkbMaterial?: IEffectPayload
  bjrBlockReport?: IEffectPayload
  employeeWagesReport?: IEffectPayload<IEmployeeWageRow>
  employeeWagesDeductionReport?: IEffectPayload
  pmaReport?: IEffectPayload
  tonnageGardenReport?: IEffectPayload
  tonnagePKSReport?: IEffectPayload
  refreshMaterializedViewsStatus?: IEffectPayload
  bpkReport?: IEffectPayload
  bmpReport?: IEffectPayload
  chapelReport?: IEffectPayload
  bpkMaterial?: IEffectPayload
  allCharts?: IEffectPayload
  productionOrganization?: IEffectPayload<IProductionOrganizationRow>
  productionOrganizationChart?: IEffectPayload<IProductionOrganizationChartRow[]>
}

const DEFAULT_STATE = {
  productionOrganizationChart: {
    loading: false,
    data: [],
  },
}

const dashboardAndChartReducer = createReducer<IRSDashboardAndChart, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [actions.getAKPReport.request, actions.getAKPReport.failure, actions.getAKPReport.success, actions.clearAkpReport],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        akpReport: payload,
      }
    },
  )
  .handleAction(
    [
      actions.getAllBlockByDivision.request,
      actions.getAllBlockByDivision.failure,
      actions.getAllBlockByDivision.success,
      actions.clearAllBlocksByDivision,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        blockAll: payload,
      }
    },
  )
  .handleAction(
    [actions.getRRPReport.request, actions.getRRPReport.failure, actions.getRRPReport.success, actions.clearRRPReport],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rrpReport: payload,
      }
    },
  )
  .handleAction(
    [
      actions.getCropBookReport.request,
      actions.getCropBookReport.failure,
      actions.getCropBookReport.success,
      actions.clearCropBookReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        cropBookReport: payload,
      }
    },
  )
  .handleAction(
    [actions.getAKPChart.request, actions.getAKPChart.failure, actions.getAKPChart.success, actions.clearAkpBarChart],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        akpBarChart: payload,
      }
    },
  )
  .handleAction(
    [
      actions.getAKPPlanningTable.request,
      actions.getAKPPlanningTable.failure,
      actions.getAKPPlanningTable.success,
      actions.clearAkpPlanning,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        akpPlanningTable: payload,
      }
    },
  )
  .handleAction(
    [
      actions.getAKPRealizationTable.request,
      actions.getAKPRealizationTable.failure,
      actions.getAKPRealizationTable.success,
      actions.clearAkpRealization,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        akpRealizationTable: {
          data: state.akpRealizationTable?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getRKBTakeCareReport.request,
      actions.getRKBTakeCareReport.failure,
      actions.getRKBTakeCareReport.success,
      actions.clearRkbTakeCare,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rkbTakeCare: {
          data: state.rkbTakeCare?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [actions.getBPKReport.request, actions.getBPKReport.failure, actions.getBPKReport.success, actions.clearBPKReport],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        bpkReport: {
          data: state.bpkReport?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [actions.getBMPReport.request, actions.getBMPReport.failure, actions.getBMPReport.success, actions.clearBMPReport],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        bmpReport: {
          data: state.bmpReport?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getChapelReport.request,
      actions.getChapelReport.failure,
      actions.getChapelReport.success,
      actions.clearChapelReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        chapelReport: {
          data: state.chapelReport?.data,
          ...payload,
        },
      }
    },
  )

  .handleAction(
    [
      actions.getRKBHarvestReport.request,
      actions.getRKBHarvestReport.failure,
      actions.getRKBHarvestReport.success,
      actions.clearRkbHarvest,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        rkbHarvest: {
          data: state.rkbHarvest?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getBPBKSReport.request,
      actions.getBPBKSReport.failure,
      actions.getBPBKSReport.success,
      actions.clearBpbksReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        bpbksReport: {
          data: state.bpbksReport?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getYieldReport.request,
      actions.getYieldReport.failure,
      actions.getYieldReport.success,
      actions.clearYieldReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        yieldReport: {
          data: state.yieldReport?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getBJRReport.request,
      actions.getBJRReport.failure,
      actions.getBJRReport.success,
      actions.clearBJRBlockReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        bjrBlockReport: {
          data: state.bjrBlockReport?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getEmployeeWagesReport.request,
      actions.getEmployeeWagesReport.failure,
      actions.getEmployeeWagesReport.success,
      actions.clearEmployeeWagesReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        employeeWagesReport: {
          data: state.employeeWagesReport?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getEmployeeWagesDeductionReport.request,
      actions.getEmployeeWagesDeductionReport.failure,
      actions.getEmployeeWagesDeductionReport.success,
      actions.clearEmployeeWageDeductionReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        employeeWagesDeductionReport: {
          data: state.employeeWagesDeductionReport?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getRKBMaterialTable.request,
      actions.getRKBMaterialTable.failure,
      actions.getRKBMaterialTable.success,
      actions.clearRKBMaterialReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        rkbMaterial: {
          data: state.rkbMaterial?.data,
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [
      actions.getBPKMaterialReport.request,
      actions.getBPKMaterialReport.failure,
      actions.getBPKMaterialReport.success,
      actions.clearBPKMaterialReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        bpkMaterial: {
          ...payload,
        },
      }
    },
  )
  .handleAction(
    [actions.getPMAReport.request, actions.getPMAReport.failure, actions.getPMAReport.success, actions.clearPMAReport],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        pmaReport: payload,
      }
    },
  )
  .handleAction(
    [
      actions.getTonnageGardenReport.request,
      actions.getTonnageGardenReport.failure,
      actions.getTonnageGardenReport.success,
      actions.clearTonnageGardenReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        tonnageGardenReport: payload,
      }
    },
  )
  .handleAction(
    [
      actions.getTonnagePKSReport.request,
      actions.getTonnagePKSReport.failure,
      actions.getTonnagePKSReport.success,
      actions.clearTonnagePKSReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        tonnagePKSReport: payload,
      }
    },
  )
  .handleAction(
    [
      actions.refreshMaterializedViews.request,
      actions.refreshMaterializedViews.failure,
      actions.refreshMaterializedViews.success,
      actions.clearMaterializedViews,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        refreshMaterializedViewsStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.getAllChart.request, actions.getAllChart.failure, actions.getAllChart.success, actions.clearAllChart],
    (state, action) => {
      const payload = (action as IEffectAction).payload

      return {
        ...state,
        allCharts: payload,
      }
    },
  )
  .handleAction([actions.getProductionOrganization.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      productionOrganization: payload,
    }
  })
  .handleAction(
    [actions.getProductionOrganization.request, actions.getProductionOrganization.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        productionOrganization: {
          ...payload,
          data: state.productionOrganization?.data,
        },
      }
    },
  )
  .handleAction([actions.getProductionOrganizationChart.success], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      productionOrganizationChart: payload,
    }
  })
  .handleAction(
    [actions.getProductionOrganizationChart.request, actions.getProductionOrganizationChart.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        productionOrganizationChart: {
          ...payload,
          data: state.productionOrganizationChart?.data,
        },
      }
    },
  )

export default dashboardAndChartReducer
