import React from 'react'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import Routes from '@navigation/Routes'
import MasterData from '@screens/master-data'
import HomePage from '@screens/shared-screens/home-page'
import OrganizationList from '@screens/modules/master/organization-list'
import OrganizationForm from '@screens/modules/master/organization-form'
import OrganizationDetail from '@screens/modules/master/organization-detail'
import DivisionList from '@screens/modules/master/division-list'
import DivisionDetail from '@screens/modules/master/division-detail'
import BlockList from '@screens/modules/master/block-list'
import BlockDetail from '@screens/modules/master/block-detail'
import BlockForm from '@screens/modules/master/block-form'
import DivisionForm from '@screens/modules/master/division-form'
import TPHList from '@screens/modules/master/tph-list'
import TPHForm from '@screens/modules/master/tph-form'
import ToolsAndEquipmentList from '@screens/modules/master/tools-and-equipment-list'
import CategoryItemForm from '@screens/modules/master/category-item-form'
import CategoryItemList from '@screens/modules/master/category-item-list'
import CategoryItemDetail from '@screens/modules/master/category-item-detail'
import MasterItemForm from '@screens/modules/master/master-item-form'
import MasterItemList from '@screens/modules/master/master-item-list'
import MasterItemDetail from '@screens/modules/master/master-item-detail'
import ItemList from '@screens/modules/master/item-list'
import ItemForm from '@screens/modules/master/item-form'
import RawMaterialList from '@app/presentations/screens/modules/master/raw-material-list'
import RawMaterialForm from '@app/presentations/screens/modules/master/raw-material-form'
import RawMaterialDetail from '@app/presentations/screens/modules/master/raw-material-detail'
import PurchasementHistoryForm from '@app/presentations/screens/modules/master/purchasement-history-form'
import ReceptionHistoryForm from '@app/presentations/screens/modules/master/reception-history-form'
import PlanModulePage from '@app/presentations/screens/plan'
import TaxationList from '@app/presentations/screens/modules/plan/taxation-list'
import TaxationForm from '@app/presentations/screens/modules/plan/taxation-form'
import TaxationDetail from '@app/presentations/screens/modules/plan/taxation-detail'
import CensusList from '@app/presentations/screens/modules/plan/census-list'
import CensusForm from '@app/presentations/screens/modules/plan/census-form'
import AKPList from '@screens/modules/plan/akp-list'
import AKPForm from '@screens/modules/plan/akp-form'
import AKPDetail from '@screens/modules/plan/akp-detail'
import RKHFilter from '@screens/modules/plan/rkh-filter'
import RKHList from '@screens/modules/plan/rkh-list'
import RKHListTab from '@screens/modules/plan/rkh-list-tab'
import CensusDetail from '@app/presentations/screens/modules/plan/census-detail'
import RKHHarvestForm from '@app/presentations/screens/modules/plan/rkh-harvest-form'
import RKHHarvestFormAddEmployee from '@app/presentations/screens/modules/plan/rkh-harvest-form/rkh-harvest-add-employee-form'
import RKHForm from '@screens/modules/plan/rkh-form'
import RKHListEmployee from '@app/presentations/screens/modules/plan/rkh-list-employee'
import RKHTakeCareForm from '@app/presentations/screens/modules/plan/rkh-take-care-form'
import RKHTakeCareFormAddItem from '@app/presentations/screens/modules/plan/rkh-take-care-form/rkh-take-care-add-item-form'
import RKHTakeCareFormAddMaterial from '@app/presentations/screens/modules/plan/rkh-take-care-form/rkh-take-care-add-material-form'
import RKHTakeCareDetail from '@app/presentations/screens/modules/plan/rkh-take-care-detail'
import RKHHarvestDetail from '@app/presentations/screens/modules/plan/rkh-harvest-detail'
import AttendanceFilter from '@app/presentations/screens/modules/attendance/attendance-filter'
import AttendanceList from '@app/presentations/screens/modules/attendance/attendance-list'
import AttendanceEmployeeForm from '@app/presentations/screens/modules/attendance/attendance-employee-form'
import AttendanceDetail from '@app/presentations/screens/modules/attendance/attendance-detail'
import AttendanceFileForm from '@app/presentations/screens/modules/attendance/attendance-file-form'
import HarvestModulePage from '@app/presentations/screens/harvest'
import BKMFilter from '@app/presentations/screens/modules/harvest/bkm-filter'
import BKMList from '@app/presentations/screens/modules/harvest/bkm-list'
import BKMDetail from '@app/presentations/screens/modules/harvest/bkm-detail'
import BKMEmployeeDetail from '@app/presentations/screens/modules/harvest/bkm-employee-detail'
import BKMForm from '@app/presentations/screens/modules/harvest/bkm-form'
import PMAFilter from '@app/presentations/screens/modules/harvest/pma-filter'
import PMAList from '@app/presentations/screens/modules/harvest/pma-list'
import PMAForm from '@app/presentations/screens/modules/harvest/pma-form'
import PMADetail from '@app/presentations/screens/modules/harvest/pma-detail'
import PMAPreview from '@app/presentations/screens/modules/harvest/pma-preview'
import TonnageGardenList from '@app/presentations/screens/modules/harvest/tonnage-garden-list'
import TonnageGardenForm from '@app/presentations/screens/modules/harvest/tonnage-garden-form'
import TonnageGardenUploadFile from '@app/presentations/screens/modules/harvest/tonnage-garden-upload-file'
import TonnageGardenDetail from '@app/presentations/screens/modules/harvest/tonnage-garden-detail'
import TonnagePKSList from '@app/presentations/screens/modules/harvest/tonnage-pks-list'
import TonnagePKSForm from '@app/presentations/screens/modules/harvest/tonnage-pks-form'
import TonnagePKSDetail from '@app/presentations/screens/modules/harvest/tonnage-pks-detail'
import BPBKSFilter from '@app/presentations/screens/modules/harvest/bpbks-filter'
import BPBKSList from '@app/presentations/screens/modules/harvest/bpbks-list'
import BPBKSForm from '@app/presentations/screens/modules/harvest/bpbks-form'
import BPBKSEmployeeDetail from '@app/presentations/screens/modules/harvest/bpbks-employee-detail'

import BKMTakeCareFilter from '@app/presentations/screens/modules/take-care/bkm-take-care-filter'
import BKMTakeCareList from '@app/presentations/screens/modules/take-care/bkm-take-care-list'
import BKMTakeCareDetail from '@app/presentations/screens/modules/take-care/bkm-take-care-detail'
import BKMTakeCareEmployeeDetail from '@app/presentations/screens/modules/take-care/bkm-take-care-employee-detail'
import BKMTakeCareForm from '@app/presentations/screens/modules/take-care/bkm-take-care-form'
import TakeCareModulePage from '@app/presentations/screens/take-care'
import BKMTakeCareFormAddMaterial from '@app/presentations/screens/modules/take-care/bkm-take-care-form/material-form'
import Report from '@app/presentations/screens/report'
import AKPPlanTableReport from '@app/presentations/screens/modules/report/akp-plan'
import AKPRealizationTableReport from '@app/presentations/screens/modules/report/akp-realization'
import BPBKSTableReport from '@app/presentations/screens/modules/report/bpbks'
import RKBHarvestReport from '@app/presentations/screens/modules/report/rkb-harvest'
import RKBTakeCareReport from '@app/presentations/screens/modules/report/rkb-takecare'
import YieldReport from '@app/presentations/screens/modules/report/yield-report'
import SeeMaterialRKBTakeCare from '@app/presentations/screens/modules/report/see-material-from-rkb-takecare'
import BJRBlockReport from '@app/presentations/screens/modules/report/bjr'
import EmployeeWageReport from '@app/presentations/screens/modules/report/employee-wage'
import EmployeeWageCutReport from '@app/presentations/screens/modules/report/employee-wage-cut'
import AKPReport from '@app/presentations/screens/modules/report/akp'
import PMAReport from '@app/presentations/screens/modules/report/pma'
import TonnageGardenReport from '@app/presentations/screens/modules/report/tonnage-garden'
import TonnagePKSReport from '@app/presentations/screens/modules/report/tonnage-pks'
import RRPReport from '@app/presentations/screens/modules/report/rrp'
import CropBookReport from '@app/presentations/screens/modules/report/cropbook'
import BPKReport from '@app/presentations/screens/modules/report/bpk'
import SeeMaterialBPK from '@app/presentations/screens/modules/report/see-material-bpk'
import AKPFilter from '@app/presentations/screens/modules/plan/akp-filter'
import TaxationFilter from '@app/presentations/screens/modules/plan/taxation-filter'
import CensusFilter from '@app/presentations/screens/modules/plan/census-filter'
import RequestPage from '@app/presentations/screens/request'
import MyRequestFilter from '@app/presentations/screens/modules/request/my-request-filter'
import MyRequestList from '@app/presentations/screens/modules/request/my-request-list'
import MyRequestDetail from '@app/presentations/screens/modules/request/my-request-detail'
import MyRequestFormFirst from '@app/presentations/screens/modules/request/my-request-form-first'
import MyRequestFormTool from '@app/presentations/screens/modules/request/my-request-form-tool'
import MyRequestFormMaterial from '@app/presentations/screens/modules/request/my-request-form-material'
import MyRequestFormTransportation from '@app/presentations/screens/modules/request/my-request-form-transportation'
import MyRequestFormCash from '@app/presentations/screens/modules/request/my-request-form-cash'
import ListRequestFilter from '@app/presentations/screens/modules/request/list-request-filter'
import ListRequestList from '@app/presentations/screens/modules/request/list-request-list'
import ListRequestDetail from '@app/presentations/screens/modules/request/list-request-detail'
import ItemDetailTransportation from '@app/presentations/screens/modules/master/item-detail-transportation'
import DailyActivityForm from '@app/presentations/screens/modules/master/daily-activity-form'
import MaintenanceForm from '@app/presentations/screens/modules/master/maintenance-form'
import MaintenanceDetail from '@app/presentations/screens/modules/master/maintenance-detail'
import DailyActivityDetail from '@app/presentations/screens/modules/master/daily-activity-detail'
import FieldReportFilter from '@app/presentations/screens/modules/field-report/field-report-filter'
import FieldReportList from '@app/presentations/screens/modules/field-report/field-report-list'
import FieldReportForm from '@app/presentations/screens/modules/field-report/field-report-form'
import FieldReportDetail from '@app/presentations/screens/modules/field-report/field-report-detail'
import PreviewImageFieldReport from '@app/presentations/screens/modules/field-report/field-report-detail/preview-image'
import WareHousemanagementFilter from '@app/presentations/screens/modules/request/warehouse-management-filter'
import WareHousemanagementList from '@app/presentations/screens/modules/request/warehouse-management-list'
import WarehouseManagementDetail from '@app/presentations/screens/modules/request/warehouse-management-detail'
import WarehouseManagementDetailDescription from '@app/presentations/screens/modules/request/warehouse-management-detail-description'
import WarehouseManagementBPU from '@app/presentations/screens/modules/request/warehouse-management-bpu'
import RealizationFertilizationFilter from '@app/presentations/screens/modules/take-care/realization-fertilization-filter'
import RealizationFertilizationList from '@app/presentations/screens/modules/take-care/realization-fertilization-list'
import RealizationFertilizationForm from '@app/presentations/screens/modules/take-care/realization-fertilization-form'
import RealizationFertilizationDetail from '@app/presentations/screens/modules/take-care/realization-fertilization-detail'
import BMPReport from '@app/presentations/screens/modules/report/bmp'
import ChapelReport from '@app/presentations/screens/modules/report/chapel'
import InformationLongText from '@app/presentations/screens/modules/common/info-long-text'
import ApprovalScreen from '@app/presentations/screens/shared-screens/approval'

interface HomeStackProps {}
const Stack = createStackNavigator()

const HomeStack: React.FC<HomeStackProps> = ({}) => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.HOME_PAGE}
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name={Routes.HOME_PAGE} component={HomePage} />
      <Stack.Screen name={Routes.MASTER_DATA} component={MasterData} />
      <Stack.Screen name={Routes.DIVISION_LIST} component={DivisionList} />
      <Stack.Screen name={Routes.DIVISION_FORM} component={DivisionForm} />
      <Stack.Screen name={Routes.DIVISION_DETAIL} component={DivisionDetail} />
      <Stack.Screen name={Routes.BLOCK_LIST} component={BlockList} />
      <Stack.Screen name={Routes.BLOCK_DETAIL} component={BlockDetail} />
      <Stack.Screen name={Routes.BLOCK_FORM} component={BlockForm} />
      <Stack.Screen name={Routes.ORGANIZATION_LIST} component={OrganizationList} />
      <Stack.Screen name={Routes.ORGANIZATION_FORM} component={OrganizationForm} />
      <Stack.Screen name={Routes.ORGANIZATION_DETAIL} component={OrganizationDetail} />
      <Stack.Screen name={Routes.TPH_LIST} component={TPHList} />
      <Stack.Screen name={Routes.TPH_FORM} component={TPHForm} />
      <Stack.Screen name={Routes.RAW_MATERIAL_LIST} component={RawMaterialList} />
      <Stack.Screen name={Routes.RAW_MATERIAL_FORM} component={RawMaterialForm} />
      <Stack.Screen name={Routes.RAW_MATERIAL_DETAIL} component={RawMaterialDetail} />
      <Stack.Screen name={Routes.TOOLS_AND_EQUIPMENT_LIST} component={ToolsAndEquipmentList} />
      <Stack.Screen name={Routes.CATEGORY_ITEM_FORM} component={CategoryItemForm} />
      <Stack.Screen name={Routes.CATEGORY_ITEM_LIST} component={CategoryItemList} />
      <Stack.Screen name={Routes.CATEGORY_ITEM_DETAIL} component={CategoryItemDetail} />
      <Stack.Screen name={Routes.MASTER_ITEM_FORM} component={MasterItemForm} />
      <Stack.Screen name={Routes.MASTER_ITEM_LIST} component={MasterItemList} />
      <Stack.Screen name={Routes.MASTER_ITEM_DETAIL} component={MasterItemDetail} />
      <Stack.Screen name={Routes.ITEM_LIST} component={ItemList} />
      <Stack.Screen name={Routes.ITEM_FORM} component={ItemForm} />
      <Stack.Screen name={Routes.RAW_MATERIAL_PURCHASEMENT_FORM} component={PurchasementHistoryForm} />
      <Stack.Screen name={Routes.RAW_MATERIAL_RECEPTION_FORM} component={ReceptionHistoryForm} />
      <Stack.Screen name={Routes.ITEM_DETAIL_TRANSPORTATION} component={ItemDetailTransportation} />
      <Stack.Screen name={Routes.DAILY_ACTIVITY_FORM} component={DailyActivityForm} />
      <Stack.Screen name={Routes.MAINTENANCE_FORM} component={MaintenanceForm} />
      <Stack.Screen name={Routes.MAINTENANCE_DETAIL} component={MaintenanceDetail} />
      <Stack.Screen name={Routes.DAILY_ACTIVITY_DETAIL} component={DailyActivityDetail} />

      {/* PLAN */}
      <Stack.Screen name={Routes.PLAN} component={PlanModulePage} />
      <Stack.Screen name={Routes.TAXATION_FILTER} component={TaxationFilter} />
      <Stack.Screen name={Routes.TAXATION_LIST} component={TaxationList} />
      <Stack.Screen name={Routes.TAXATION_FORM} component={TaxationForm} />
      <Stack.Screen name={Routes.AKP_FILTER} component={AKPFilter} />
      <Stack.Screen name={Routes.AKP_LIST} component={AKPList} />
      <Stack.Screen name={Routes.AKP_FORM} component={AKPForm} />
      <Stack.Screen name={Routes.AKP_DETAIL} component={AKPDetail} />
      <Stack.Screen name={Routes.TAXATION_DETAIL} component={TaxationDetail} />

      <Stack.Screen name={Routes.CENSUS_FILTER} component={CensusFilter} />
      <Stack.Screen name={Routes.CENSUS_LIST} component={CensusList} />
      <Stack.Screen name={Routes.CENSUS_FORM} component={CensusForm} />

      <Stack.Screen name={Routes.RKH_FILTER} component={RKHFilter} />
      <Stack.Screen name={Routes.RKH_LIST} component={RKHList} />
      <Stack.Screen name={Routes.RKH_FORM} component={RKHForm} />
      <Stack.Screen name={Routes.RKH_TAKE_CARE_FORM} component={RKHTakeCareForm} />
      <Stack.Screen name={Routes.RKH_TAKE_CARE_FORM_ITEM} component={RKHTakeCareFormAddItem} />
      <Stack.Screen name={Routes.RKH_TAKE_CARE_FORM_MATERIAL} component={RKHTakeCareFormAddMaterial} />
      <Stack.Screen name={Routes.RKH_TAKE_CARE_DETAIL} component={RKHTakeCareDetail} />
      <Stack.Screen name={Routes.RKH_LIST_TAB} component={RKHListTab} />
      <Stack.Screen name={Routes.CENSUS_DETAIL} component={CensusDetail} />
      <Stack.Screen name={Routes.RKH_HARVEST_FORM} component={RKHHarvestForm} />
      <Stack.Screen name={Routes.RKH_HARVEST_FORM_EMPLOYEE} component={RKHHarvestFormAddEmployee} />
      <Stack.Screen name={Routes.RKH_LIST_EMPLOYEE} component={RKHListEmployee} />
      <Stack.Screen name={Routes.RKH_HARVEST_DETAIL} component={RKHHarvestDetail} />
      <Stack.Screen name={Routes.ATTENDANCE_FILTER} component={AttendanceFilter} />
      <Stack.Screen name={Routes.ATTENDANCE_LIST} component={AttendanceList} />
      <Stack.Screen name={Routes.ATTENDANCE_EMPLOYEE_FORM} component={AttendanceEmployeeForm} />
      <Stack.Screen name={Routes.ATTENDANCE_DETAIL} component={AttendanceDetail} />
      <Stack.Screen name={Routes.ATTENDANCE_FILE_FORM} component={AttendanceFileForm} />

      {/* HARVEST */}
      <Stack.Screen name={Routes.BKM_FILTER} component={BKMFilter} />
      <Stack.Screen name={Routes.BKM_LIST} component={BKMList} />
      <Stack.Screen name={Routes.BKM_FORM} component={BKMForm} />
      <Stack.Screen name={Routes.BKM_DETAIL} component={BKMDetail} />
      <Stack.Screen name={Routes.BKM_EMPLOYEE_DETAIL} component={BKMEmployeeDetail} />
      <Stack.Screen name={Routes.HARVEST} component={HarvestModulePage} />
      <Stack.Screen name={Routes.PMA_FILTER} component={PMAFilter} />
      <Stack.Screen name={Routes.PMA_LIST} component={PMAList} />
      <Stack.Screen name={Routes.PMA_FORM} component={PMAForm} />
      <Stack.Screen name={Routes.PMA_DETAIL} component={PMADetail} />
      <Stack.Screen name={Routes.PMA_PREVIEW} component={PMAPreview} />
      <Stack.Screen name={Routes.TONNAGE_GARDEN_LIST} component={TonnageGardenList} />
      <Stack.Screen name={Routes.TONNAGE_GARDEN_FORM} component={TonnageGardenForm} />
      <Stack.Screen name={Routes.TONNAGE_GARDEN_UPLOAD_FILE} component={TonnageGardenUploadFile} />
      <Stack.Screen name={Routes.TONNAGE_GARDEN_DETAIL} component={TonnageGardenDetail} />
      <Stack.Screen name={Routes.TONNAGE_PKS_LIST} component={TonnagePKSList} />
      <Stack.Screen name={Routes.TONNAGE_PKS_FORM} component={TonnagePKSForm} />
      <Stack.Screen name={Routes.TONNAGE_PKS_DETAIL} component={TonnagePKSDetail} />
      <Stack.Screen name={Routes.BPBKS_FILTER} component={BPBKSFilter} />
      <Stack.Screen name={Routes.BPBKS_LIST} component={BPBKSList} />
      <Stack.Screen name={Routes.BPBKS_FORM} component={BPBKSForm} />
      <Stack.Screen name={Routes.BPBKS_EMPLOYEE_DETAIL} component={BPBKSEmployeeDetail} />

      {/* TAKE CARE */}
      <Stack.Screen name={Routes.TAKE_CARE} component={TakeCareModulePage} />
      <Stack.Screen name={Routes.BKM_TAKE_CARE_FILTER} component={BKMTakeCareFilter} />
      <Stack.Screen name={Routes.BKM_TAKE_CARE_LIST} component={BKMTakeCareList} />
      <Stack.Screen name={Routes.BKM_TAKE_CARE_FORM} component={BKMTakeCareForm} />
      <Stack.Screen name={Routes.BKM_TAKE_CARE_DETAIL} component={BKMTakeCareDetail} />
      <Stack.Screen name={Routes.BKM_TAKE_CARE_EMPLOYEE_DETAIL} component={BKMTakeCareEmployeeDetail} />
      <Stack.Screen name={Routes.BKM_TAKE_CARE_MATERIAL_FORM} component={BKMTakeCareFormAddMaterial} />
      <Stack.Screen name={Routes.REALIZATION_FERTILIZATION_FILTER} component={RealizationFertilizationFilter} />
      <Stack.Screen name={Routes.REALIZATION_FERTILIZATION_LIST} component={RealizationFertilizationList} />
      <Stack.Screen name={Routes.REALIZATION_FERTILIZATION_FORM} component={RealizationFertilizationForm} />
      <Stack.Screen name={Routes.REALIZATION_FERTILIZATION_DETAIL} component={RealizationFertilizationDetail} />

      {/* REPORT */}
      <Stack.Screen name={Routes.REPORT} component={Report} />
      <Stack.Screen name={Routes.REPORT_AKP_REPORT} component={AKPReport} />
      <Stack.Screen name={Routes.REPORT_AKP_PLAN} component={AKPPlanTableReport} />
      <Stack.Screen name={Routes.REPORT_AKP_REALIZATION} component={AKPRealizationTableReport} />
      <Stack.Screen name={Routes.REPORT_BPBKS} component={BPBKSTableReport} />
      <Stack.Screen name={Routes.REPORT_YIELD_REPORT} component={YieldReport} />
      <Stack.Screen name={Routes.REPORT_RKB_TAKE_CARE} component={RKBTakeCareReport} />
      <Stack.Screen name={Routes.REPORT_RKB_HARVEST} component={RKBHarvestReport} />
      <Stack.Screen name={Routes.REPORT_RKB_MATERIAL} component={SeeMaterialRKBTakeCare} />
      <Stack.Screen name={Routes.REPORT_BJB_PER_BLOK} component={BJRBlockReport} />
      <Stack.Screen name={Routes.REPORT_EMPLOYEE_WAGE} component={EmployeeWageReport} />
      <Stack.Screen name={Routes.REPORT_EMPLOYEE_WAGE_CUT} component={EmployeeWageCutReport} />
      <Stack.Screen name={Routes.REPORT_PMA} component={PMAReport} />
      <Stack.Screen name={Routes.REPORT_TONNAGE_GARDEN} component={TonnageGardenReport} />
      <Stack.Screen name={Routes.REPORT_TONNAGE_PKS} component={TonnagePKSReport} />
      <Stack.Screen name={Routes.REPORT_RRP} component={RRPReport} />
      <Stack.Screen name={Routes.REPORT_CROPBOOK} component={CropBookReport} />
      <Stack.Screen name={Routes.REPORT_BPK} component={BPKReport} />
      <Stack.Screen name={Routes.REPORT_BMP} component={BMPReport} />
      <Stack.Screen name={Routes.REPORT_CHAPEL} component={ChapelReport} />
      <Stack.Screen name={Routes.SEE_BPK_MATERIAL} component={SeeMaterialBPK} />

      {/* REQUEST & MANAJEMEN GUDANG */}
      <Stack.Screen name={Routes.REQUEST} component={RequestPage} />
      <Stack.Screen name={Routes.MY_REQUEST_FILTER} component={MyRequestFilter} />
      <Stack.Screen name={Routes.MY_REQUEST_LIST} component={MyRequestList} />
      <Stack.Screen name={Routes.MY_REQUEST_DETAIL} component={MyRequestDetail} />
      <Stack.Screen name={Routes.MY_REQUEST_FORM_FIRST} component={MyRequestFormFirst} />
      <Stack.Screen name={Routes.MY_REQUEST_FORM_TOOL} component={MyRequestFormTool} />
      <Stack.Screen name={Routes.MY_REQUEST_FORM_MATERIAL} component={MyRequestFormMaterial} />
      <Stack.Screen name={Routes.MY_REQUEST_FORM_TRANSPORTATION} component={MyRequestFormTransportation} />
      <Stack.Screen name={Routes.MY_REQUEST_FORM_CASH} component={MyRequestFormCash} />
      <Stack.Screen name={Routes.LIST_OF_REQUEST_FILTER} component={ListRequestFilter} />
      <Stack.Screen name={Routes.LIST_OF_REQUEST} component={ListRequestList} />
      <Stack.Screen name={Routes.LIST_OF_REQUEST_DETAIL} component={ListRequestDetail} />
      <Stack.Screen name={Routes.WAREHOUSE_MANAGEMENT_FILTER} component={WareHousemanagementFilter} />
      <Stack.Screen name={Routes.WAREHOUSE_MANAGEMENT_LIST} component={WareHousemanagementList} />
      <Stack.Screen name={Routes.WAREHOUSE_MANAGEMENT_DETAIL} component={WarehouseManagementDetail} />
      <Stack.Screen name={Routes.WAREHOUSE_MANAGEMENT_BPU} component={WarehouseManagementBPU} />
      <Stack.Screen
        name={Routes.WAREHOUSE_MANAGEMENT_DETAIL_DESCRIPTION}
        component={WarehouseManagementDetailDescription}
      />

      {/* FIELD REPORT BERITA ACARA */}
      <Stack.Screen name={Routes.FIELD_REPORT_FILTER} component={FieldReportFilter} />
      <Stack.Screen name={Routes.FIELD_REPORT_LIST} component={FieldReportList} />
      <Stack.Screen name={Routes.FIELD_REPORT_FORM} component={FieldReportForm} />
      <Stack.Screen name={Routes.FIELD_REPORT_DETAIL} component={FieldReportDetail} />
      <Stack.Screen name={Routes.FIELD_REPORT_PREVIEW_IMAGE} component={PreviewImageFieldReport} />

      {/* COMMON */}
      <Stack.Screen name={Routes.COMMON_INFORMATION_LONG} component={InformationLongText} />
      
      {/* APPROVAL */}
      <Stack.Screen name={Routes.APPROVAL} component={ApprovalScreen} />
    </Stack.Navigator>
  )
}

export default HomeStack
