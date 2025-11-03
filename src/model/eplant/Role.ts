// 353
export interface IRoleRow {
  id: string
  name: string
  // roleCategory: null | string: 353
  roleCategory: string[]
  organization: {
    id: string
    name: string
  }
  createdAt: string
}

// add more of these next time.
// this is a key and value of roles.
// key means label, value means it slugs
export const ROLE_ACCESS_SLUG: any = {
  //Master data
  SEE_ORGANIZATION: 'lihat-organisasi',
  ORGANIZE_ORGANIZATION: 'mengelola-organisasi',
  SEE_DIVISION: 'lihat-divisi',
  ORGANIZE_DIVISION: 'mengelola-divisi',
  SEE_BLOCK: 'lihat-blok',
  ORGANIZE_BLOCK: 'mengelola-blok',
  SEE_TPH: 'lihat-tph',
  ORGANIZE_TPH: 'mengelola-tph',
  SEE_MATERIAL: 'lihat-material',
  ORGANIZE_MATERIAL: 'mengelola-material',
  ORGANIZE_MATERIAL_PURCHASEMENT: 'mengelola-pembelian',
  ORGANIZE_MATERIAL_RECEIVEMENT: 'mengelola-penerimaan',
  ORGANIZE_STOCK: 'mengelola-stok',
  SEE_ALAT: 'lihat-alat-dan-perlengkapan',
  ORGANIZE_ALAT: 'mengelola-alat-dan-perlengkapan',

  //rencana
  SEE_AKP: 'lihat-akp',
  ORGANIZE_AKP: 'mengelola-akp',
  SEE_TAXATION: 'lihat-taksasi',
  ORGANIZE_TAXATION: 'mengelola-taksasi',
  SEE_CENSUS: 'lihat-sensus',
  ORGANIZE_CENSUS: 'mengelola-sensus',
  SEE_RKH: 'lihat-rkh',
  ORGANIZE_RKH: 'mengelola-rkh',

  //absensi
  SEE_ABSENSI: 'lihat-absensi',
  ORGANIZE_ABSENSI: 'mengelola-absensi',

  //panen
  SEE_BKM_HARVEST: 'lihat-bkm',
  ORGANIZE_BKM_HARVEST: 'mengelola-bkm',
  SEE_PMA: 'lihat-pma',
  ORGANIZE_PMA: 'mengelola-pma',
  SEE_BPBKS: 'lihat-bpbks',
  ORGANIZE_BPBKS: 'mengelola-bpbks',
  SEE_TONNAGE_GARDEN: 'lihat-tonase-kebun',
  ORGANIZE_TONNAGE_GARDEN: 'mengelola-tonase-kebun',
  SEE_TONNAGE_PKS: 'lihat-tonase-pks',
  ORGANIZE_TONNAGE_PKS: 'mengelola-tonase-pks',

  //rawat
  SEE_BKM_TAKE_CARE: 'lihat-bkm-rawat',
  ORGANIZE_BKM_TAKE_CARE: 'mengelola-bkm-rawat',
  SEE_FERTILIZATION_REALIZATION: 'lihat-realisasi-pemupukan',
  ORGANIZE_FERTILIZATION_REALIZATION: 'mengelola-realisasi-pemupukan',

  //report
  SEE_REPORT_AKP: 'lihat-laporan-akp',
  SEE_REPORT_PMB: 'lihat-laporan-r-pmb',
  SEE_REPORT_PMA: 'lihat-laporan-r-pma',
  SEE_REPORT_YIELD: 'lihat-laporan-yield',
  SEE_REPORT_RKB_TAKE_CARE: 'lihat-laporan-rkb-rawat',
  SEE_REPORT_RKB_HARVEST: 'lihat-laporan-rkb-panen',
  SEE_REPORT_BJR: 'lihat-laporan-bjr-per-blok',
  SEE_REPORT_WAGE_EMPLOYEE: 'lihat-laporan-upah-karyawan',
  SEE_REPORT_WAGE_DEDUCTION: 'lihat-laporan-potongan-karyawan',
  SEE_REPORT_RRP: 'lihat-laporan-rrp',
  SEE_REPORT_CROPBOOK: 'lihat-laporan-cropbook',
  SEE_REPORT_TONNAGE_GARDEN: 'lihat-laporan-tonase-kebun',
  SEE_REPORT_TONNAGE_PKS: 'lihat-laporan-tonase-pks',
  SEE_REPORT_BPK: 'lihat-laporan-bpk',
  SEE_REPORT_BMP: 'lihat-laporan-bmp',
  SEE_REPORT_CHAPEL: 'lihat-laporan-pusingan-kapel',

  //dashboard
  SEE_DASHBOARD: 'dashboard',
  SEE_DASHBOARD_TOTAL_PRODUCTION: 'lihat-total-produksi',
  SEE_DASHBOARD_TOTAL_TAKECARE_AND_FERTILIZATION: 'lihat-total-rawat-dan-pemupukan',
  SEE_DASHBOARD_PRODUCTION_PER_MANDOR: 'lihat-produksi-per-mandor',
  SEE_DASHBOARD_PRODUCTION_PER_HARVESTER: 'lihat-produksi-per-permanen',
  SEE_DASHBOARD_QUALITY_OF_FRUIT_PER_BLOCK: 'lihat-kualitas-buah-per-blok',

  SEE_DASHBOARD_TAKE_CARE_RESULT: 'lihat-hasil-perawatan',
  SEE_DASHBOARD_BUDGETING: 'lihat-budgeting',
  SEE_DASHBOARD_TAKE_CARE_BUDGET: 'lihat-biaya-rawat-ha',
  SEE_DASHBOARD_HARVEST_BUDGET: 'lihat-biaya-panen-kg',
  SEE_DASHBOARD_PRODUCTION_PER_GROUP: 'lihat-produksi-group',
  SEE_DASHBOARD_RESTAN: 'lihat-restan',
  SEE_DASHBOARD_REFRAKSI: 'lihat-refraksi',

  //phase 2
  //BERITA ACARA
  SEE_FIELD_REPORT: 'lihat-berita-acara',
  ORGANIZE_FIELD_REPORT: 'mengelola-berita-acara',

  //REQUEST
  SEE_MY_REQUEST: 'lihat-permintaan-saya',
  ORGANIZE_MY_REQUEST: 'mengelola-permintaan-saya',
  SEE_LIST_OF_REQUEST: 'lihat-daftar-permintaan',
  ORGANIZE_LIST_OF_REQUEST: 'mengelola-daftar-permintaan',
  SEE_WAREHOUSE_MANAGEMENT: 'lihat-manajemen-gudang',
  ORGANIZE_WAREHOUSE_MANAGEMENT: 'mengelola-manajemen-gudang',

  // LENGKAPI_RKH: 'lengkapi-rkh',
  // UBAH_RKH: 'ubah-rkh',
  // HAPUS_RKH: 'hapus-rkh',
  // TAMBAH_RKH: 'tambah-rkh',
  // LIHAT_BIAYA_RKH: 'lihat-biaya-rkh',
  // LIHAT_RKH: 'lihat-rkh',
}
