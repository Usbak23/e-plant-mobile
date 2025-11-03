import * as yup from 'yup'

export let attendanceEmployeeFormValidationSchema = yup.object().shape({
  date: yup.string().required('Tanggal absensi wajib diisi').typeError('Masukkan tanggal dengan benar'),
  divisionId: yup.string().required('Divisi wajib dipilih'),
  userId: yup.string().required('Pilih karyawan terlebih dahulu wajib diisi'),
  in: yup.string().required('Jam Masuk wajib diisi'),
  out: yup.string().required('Jam Keluar wajib diisi'),
})
