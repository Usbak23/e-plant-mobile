import * as yup from 'yup'

export let attendanceValidationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib dipilih'),
  dateAttendance: yup.string().required('Tanggal absensi wajib diisi').typeError('Masukkan tanggal dengan benar'),
})
