import UserService from '@domain/services/common/UserService'
import OrganizationService from '@domain/services/eplant/OrganizationService'
import DivisionService from '@domain/services/eplant/DivisionService'
import MasterService from '@domain/services/eplant/MasterService'
import AuthService from '@domain/services/eplant/AuthService'
import TPHService from '@domain/services/eplant/TPHService'
import BlockService from '@domain/services/eplant/BlockService'
import CategoryItemService from '@domain/services/eplant/CategoryItemService'
import MasterItemService from '@domain/services/eplant/MasterItemService'
import ItemService from '@domain/services/eplant/ItemService'
import RawMaterialService from '@domain/services/eplant/RawMaterialService'
import AKPService from '@domain/services/eplant/AKPService'
import CensusService from '@domain/services/eplant/CensusService'
import TaxationService from '@domain/services/eplant/TaxationService'
import RKHService from '@domain/services/eplant/RKHService'
import RoleService from '@domain/services/eplant/RoleService'
import RKHTakeCareService from '@domain/services/eplant/RKHTakeCareService'
import SubActivityService from '@domain/services/eplant/SubActivityService'
import RKHHarvestService from '@domain/services/eplant/RKHHarvestService'
import AttendanceService from './eplant/AttendanceService'
import BKMService from '@domain/services/eplant/BKMService'
import BKMTakeCareService from '@domain/services/eplant/BKMTakeCareService'
import PMAService from '@domain/services/eplant/PMAService'
import BPBKSService from '@domain/services/eplant/BPBKSService'
import TonnageGardenService from '@domain/services/eplant/TonnageGardenService'
import TonnagePKSService from './eplant/TonnagePKSService'
import DashboardAndChartService from './eplant/DashboardAndChartService'
import NormSubactivityService from './eplant/NormSubactivity'
import DailyActivityService from './eplant/DailyActivityService'
import MaintenanceService from './eplant/MaintenanceService'
import RequestService from './eplant/MyRequestService'
import FieldReportService from './eplant/FieldReportService'
import WarehouseManagementService from './eplant/WarehouseManagementService'
import RealizationFertilizationService from '@domain/services/eplant/RealizationFertilization'

class System {
  private static _instance: System
  userService: UserService = new UserService()
  organizationService: OrganizationService = new OrganizationService()
  divisionService: DivisionService = new DivisionService()
  masterService: MasterService = new MasterService()
  authService: AuthService = new AuthService()
  tphService: TPHService = new TPHService()
  blockService: BlockService = new BlockService()
  categoryItemService: CategoryItemService = new CategoryItemService()
  masterItemService: MasterItemService = new MasterItemService()
  itemService: ItemService = new ItemService()
  rawMaterialService: RawMaterialService = new RawMaterialService()
  akpService: AKPService = new AKPService()
  censusService: CensusService = new CensusService()
  taxationService: TaxationService = new TaxationService()
  rkhService: RKHService = new RKHService()
  rkhTakeCareService: RKHTakeCareService = new RKHTakeCareService()
  roleService: RoleService = new RoleService()
  subActivityService: SubActivityService = new SubActivityService()
  rkhHarvestService: RKHHarvestService = new RKHHarvestService()
  attendanceService: AttendanceService = new AttendanceService()
  bkmService: BKMService = new BKMService()
  bkmTakeCareService: BKMTakeCareService = new BKMTakeCareService()
  pmaService: PMAService = new PMAService()
  bpbksService: BPBKSService = new BPBKSService()
  tonnageGarderService: TonnageGardenService = new TonnageGardenService()
  tonnagePKSService: TonnagePKSService = new TonnagePKSService()
  dashboardAndChartService: DashboardAndChartService = new DashboardAndChartService()
  normaService: NormSubactivityService = new NormSubactivityService()
  dailyActivityService: DailyActivityService = new DailyActivityService()
  maintenanceService: MaintenanceService = new MaintenanceService()
  requestService: RequestService = new RequestService()
  fieldReportService: FieldReportService = new FieldReportService()
  warehouseManagementService: WarehouseManagementService = new WarehouseManagementService()
  realizationFertilizationService: RealizationFertilizationService = new RealizationFertilizationService()

  static get instance(): System {
    if (!System._instance) {
      System._instance = new System()
    }
    return System._instance
  }
}

export default System
