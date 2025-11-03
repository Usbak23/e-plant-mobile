import * as yup from 'yup'

function emptyStringToZero(value: any, originalValue: any) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return 0;
  }
  return value;
}

export const pmaEmployees = yup.object().shape({
  blockId: yup.string().required('Blok wajib dipilih').typeError('Pilih blok terlebih dahulu'),
  plantingYear: yup.string().required('Tahun Tanam wajib diisi').typeError('Isi Tahun Tanam dengan benar'),
  ancak: yup.number().min(0, 'Minimum Ancak adalah 0').typeError('Masukkan Ancak dengan benar'),
  notHarvestFruit: yup
    .number()
    .min(0, 'Minimum Buah Tidak Dipanen adalah 0')
    .transform(emptyStringToZero)
    .typeError('Masukkan Buah Tidak Dipanen dengan benar'),
  sunFruit: yup
    .number()
    .min(0, 'Minimum Buah Matahari adalah 0')
    .transform(emptyStringToZero)
    .typeError('Masukkan Buah Matahari dengan benar'),
  looseOnPlateAndPikul: yup
    .number()
    .min(0, 'Minimum Di Piringan & Pasar Pikul adalah 0')
    .transform(emptyStringToZero)
    .typeError('Masukkan Di Piringan & Pasar Pikul dengan benar'),
  looseOnTph: yup
    .number()
    .min(0, 'Minimum Di TPH adalah 0')
    .transform(emptyStringToZero)
    .typeError('Masukkan Di TPH dengan benar'),
  brokenMidrib: yup
    .number()
    .min(0, 'Minimum Sengkleh adalah 0')
    .transform(emptyStringToZero)
    .typeError('Masukkan Sengkleh dengan benar'),
  onPlateMidrib: yup
    .number()
    .min(0, 'Minimum Di Piringan adalah 0')
    .transform(emptyStringToZero)
    .typeError('Masukkan Di Piringan dengan benar'),
  checkedTree: yup.number().min(0, 'Pokok diperiksa tidak boleh minus').transform(emptyStringToZero).typeError('Masukkan Jumlah Pokok diperiksa dengan benar').required('Jumlah Pokok Diperiksa wajib diisi'),
  remainingFruitTree: yup.number().min(0, 'Buah Tinggal Per-pokok tidak boleh minus').transform(emptyStringToZero).typeError('Masukkan Buah Tinggal Per-Pokok dengan benar').required('Buah Tinggal Per-pokok wajib diisi (auto)'),
  brondolanEachTree: yup.number().min(0, 'Brondolan Per-pokok tidak boleh minus').transform(emptyStringToZero).typeError('Masukkan Brondolan Per-Pokok dengan benar').required('Brondolan Per-pokok wajib diisi (auto)')
})

export let pmaFormValidationSchema = yup.object().shape({
  datePma: yup.string().required('Tanggal PMA wajib diisi').typeError('Masukkan tanggal dengan benar'),
  divisionId: yup.string().required('Pilih divisi terlebih dahulu'),
  foremanId: yup.string().required('Pilih mandor terlebih dahulu'),
  userId: yup.string().required('Karyawan wajib dipilih'),
  blockId: yup.string().required('Blok wajib dipilih'),
  plantingYear: yup.string().required('Tahun Tanam wajib diisi').typeError('Isi Tahun Tanam dengan benar'),
  ancak: yup.number().min(0, 'Minimum Ancak adalah 0').typeError('Masukkan Ancak dengan benar'),
  notHarvestFruit: yup
    .number()
    .min(0, 'Minimum Buah Tidak Dipanen adalah 0')
    .typeError('Masukkan Buah Tidak Dipanen dengan benar'),
  sunFruit: yup.number().min(0, 'Minimum Buah Matahari adalah 0').typeError('Masukkan Buah Matahari dengan benar'),
  looseOnPlateAndPikul: yup
    .number()
    .min(0, 'Minimum Di Piringan & Pasar Pikul adalah 0')
    .typeError('Masukkan Di Piringan & Pasar Pikul dengan benar'),
  looseOnTph: yup.number().min(0, 'Minimum Di TPH adalah 0').typeError('Masukkan Di TPH dengan benar'),
  brokenMidrib: yup.number().min(0, 'Minimum Sengkleh adalah 0').typeError('Masukkan Sengkleh dengan benar'),
  onPlateMidrib: yup.number().min(0, 'Minimum Di Piringan adalah 0').typeError('Masukkan Di Piringan dengan benar'),


  // employee: yup.array().of(pmaEmployees).required('Data Karyawan wajib diisi'),
})

export let pmaParentValidationSchema = yup.object().shape({
  datePma: yup.string().required('Tanggal PMA wajib diisi').typeError('Masukkan tanggal dengan benar'),
  divisionId: yup.string().required('Pilih divisi terlebih dahulu'),
  foremanId: yup.string().required('Pilih mandor terlebih dahulu'),
  userId: yup.string().required('Pilih karyawan terlebih dahulu'),
  employee: yup.array().of(pmaEmployees).required('Data Blok wajib diisi').min(1, 'Setidaknya ada perlu satu data')
})
