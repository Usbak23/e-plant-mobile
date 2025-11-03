import {map, catchError, filter, switchMap, concatMap} from 'rxjs/operators'
import {from, of} from 'rxjs'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/dashboard-and-chart/actions'
import {StreamType} from '@app/domain/states/types'

const refreshMaterializedView: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.refreshMaterializedViews.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.refreshMaterializedView()).pipe(
        concatMap((data: any) => [actions.refreshMaterializedViews.success({loading: false, data: data?.response})]),
        catchError(error => {
          return of(actions.refreshMaterializedViews.failure({loading: false, error}), actions.clearMaterializedViews())
        }),
      )
    }),
  )
}

const getAKPReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAKPReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseAkpReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getAKPReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getAKPReport.failure({loading: false, error}), actions.clearAkpReport())
        }),
      )
    }),
  )
}

const getRRPReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRRPReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseRRPReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getRRPReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getRRPReport.failure({loading: false, error}), actions.clearRRPReport())
        }),
      )
    }),
  )
}

const getBPKReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBPKReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseBPKReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getBPKReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getBPKReport.failure({loading: false, error}), actions.clearBPKReport())
        }),
      )
    }),
  )
}

const getBMPReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBMPReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseBMPReport(action.payload.data)).pipe(
        concatMap((data: any) => {
          return [actions.getBMPReport.success({loading: false, data})]
        }),
        catchError(error => {
          return of(actions.getBMPReport.failure({loading: false, error}), actions.clearBMPReport())
        }),
      )
    }),
  )
}

const getChapelReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getChapelReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseChapelReport(action.payload.data)).pipe(
        concatMap((data: any) => {
          return [actions.getChapelReport.success({loading: false, data})]
        }),
        catchError(error => {
          return of(actions.getChapelReport.failure({loading: false, error}), actions.clearChapelReport())
        }),
      )
    }),
  )
}

const getCropBookReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getCropBookReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseCropBookkReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getCropBookReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getCropBookReport.failure({loading: false, error}), actions.clearCropBookReport())
        }),
      )
    }),
  )
}

const getAKPBarChart: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAKPChart.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseAkpBarChart(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getAKPChart.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getAKPChart.failure({loading: false, error}), actions.clearAkpBarChart())
        }),
      )
    }),
  )
}

const getRKBHarvestReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKBHarvestReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseRkbHarvest(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getRKBHarvestReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getRKBHarvestReport.failure({loading: false, error}), actions.clearRkbHarvest())
        }),
      )
    }),
  )
}

const getRKBTakeCareReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKBTakeCareReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseRkbTakeCare(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getRKBTakeCareReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getRKBTakeCareReport.failure({loading: false, error}), actions.clearRkbTakeCare())
        }),
      )
    }),
  )
}

const getRKBMaterialTable: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getRKBMaterialTable.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseSeeMaterialRKBTakeCare(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getRKBMaterialTable.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getRKBMaterialTable.failure({loading: false, error}), actions.clearRKBMaterialReport())
        }),
      )
    }),
  )
}

const getAKPPlanningTable: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAKPPlanningTable.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseAkpPlanningTable(action.payload.data)).pipe(
        concatMap((data: any) => {
          return [actions.getAKPPlanningTable.success({loading: false, data: data.data})]
        }),
        catchError(error => {
          return of(actions.getAKPPlanningTable.failure({loading: false, error}), actions.clearAkpPlanning())
        }),
      )
    }),
  )
}

const getAKPRealizationTable: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAKPRealizationTable.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseAkpRealizationTable(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getAKPRealizationTable.success({loading: false, data: data.data})]),
        catchError(error => {
          return of(actions.getAKPRealizationTable.failure({loading: false, error}), actions.clearAkpRealization())
        }),
      )
    }),
  )
}

const getBPBKSReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBPBKSReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseBPKSReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getBPBKSReport.success({loading: false, data: data.data})]),
        catchError(error => {
          return of(actions.getBPBKSReport.failure({loading: false, error}), actions.clearBpbksReport())
        }),
      )
    }),
  )
}

const getBPKMaterialReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBPKMaterialReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseBPKMaterialReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getBPKMaterialReport.success({loading: false, data: data?.data})]),
        catchError(error => {
          return of(actions.getBPKMaterialReport.failure({loading: false, error}), actions.clearBPKMaterialReport())
        }),
      )
    }),
  )
}

const getBJRBlockReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getBJRReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseBjrBlockReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getBJRReport.success({loading: false, data: data.data})]),
        catchError(error => {
          return of(actions.getBJRReport.failure({loading: false, error}), actions.clearBJRBlockReport())
        }),
      )
    }),
  )
}

const getEmployeeWageReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getEmployeeWagesReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.getReportEmployeeWage(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getEmployeeWagesReport.success({loading: false, data: data.data.response})]),
        catchError(error => {
          return of(actions.getEmployeeWagesReport.failure({loading: false, error}), actions.clearEmployeeWagesReport())
        }),
      )
    }),
  )
}

const getEmployeeWageDeductionReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getEmployeeWagesDeductionReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseEmployeeWagesDeductionReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getEmployeeWagesDeductionReport.success({loading: false, data: data.data})]),
        catchError(error => {
          return of(
            actions.getEmployeeWagesDeductionReport.failure({loading: false, error}),
            actions.clearEmployeeWageDeductionReport(),
          )
        }),
      )
    }),
  )
}

const getYieldReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getYieldReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseYieldReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getYieldReport.success({loading: false, data: data.data})]),
        catchError(error => {
          return of(actions.getYieldReport.failure({loading: false, error}), actions.clearYieldReport())
        }),
      )
    }),
  )
}

const getPMAReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getPMAReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabasePMAReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getPMAReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getPMAReport.failure({loading: false, error}), actions.clearPMAReport())
        }),
      )
    }),
  )
}

const getTonnageGardenReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTonnageGardenReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseTonnageGardenReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getTonnageGardenReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getTonnageGardenReport.failure({loading: false, error}), actions.clearTonnageGardenReport())
        }),
      )
    }),
  )
}

const getTonnagePKSReport: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getTonnagePKSReport.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.metabaseTonnagePKSReport(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getTonnagePKSReport.success({loading: false, data})]),
        catchError(error => {
          return of(actions.getTonnagePKSReport.failure({loading: false, error}), actions.clearTonnagePKSReport())
        }),
      )
    }),
  )
}

const getAllChart: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAllChart.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.allChart(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getAllChart.success({loading: false, data: data.data})]),
        catchError(error => {
          return of(actions.getAllChart.failure({loading: false, error}), actions.clearAllChart())
        }),
      )
    }),
  )
}

const getAllBlockByDivision: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getAllBlockByDivision.request)),
    switchMap(action =>
      from(api.dashboardAndChartService.getAllBlock(action.payload.data)).pipe(
        map(({data}: any) => actions.getAllBlockByDivision.success({loading: false, data: data.response})),
        catchError(error => {
          return of(actions.getAllBlockByDivision.failure({loading: false, error}), actions.clearAllBlocksByDivision())
        }),
      ),
    ),
  )
}

const getProductionOrganization: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getProductionOrganization.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.getProductionOrganization(action.payload.data)).pipe(
        concatMap((data: any) => [
          actions.getProductionOrganization.success({loading: false, data: data.data.response}),
        ]),
        catchError(error => {
          return of(actions.getProductionOrganization.failure({loading: false, error}), actions.clearAllChart())
        }),
      )
    }),
  )
}

const getProductionOrganizationChart: StreamType = (action$, state$, api) => {
  return action$.pipe(
    filter(isActionOf(actions.getProductionOrganizationChart.request)),
    switchMap(action => {
      return from(api.dashboardAndChartService.getProductionOrganizationChart(action.payload.data)).pipe(
        concatMap((data: any) => [actions.getProductionOrganizationChart.success({loading: false, data: data.data.response})]),
        catchError(error => {
          return of(actions.getProductionOrganizationChart.failure({loading: false, error}), actions.clearAllChart())
        }),
      )
    }),
  )
}

export default [
  getAllBlockByDivision,
  refreshMaterializedView,
  getAKPBarChart,
  getAKPPlanningTable,
  getAKPRealizationTable,
  getAllChart,
  getRKBTakeCareReport,
  getRKBHarvestReport,
  getBPBKSReport,
  getYieldReport,
  getRKBMaterialTable,
  getBJRBlockReport,
  getEmployeeWageReport,
  getEmployeeWageDeductionReport,
  getAKPReport,
  getPMAReport,
  getTonnageGardenReport,
  getTonnagePKSReport,
  getRRPReport,
  getCropBookReport,
  getBPKReport,
  getBPKMaterialReport,
  getBMPReport,
  getChapelReport,
  getProductionOrganization,
  getProductionOrganizationChart,
]
