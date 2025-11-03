import * as yup from 'yup'

export let bkmValidationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib diisi'),
  date: yup.string().required('Tanggal wajib diisi'),
  divisionId: yup.string().required('Divisi wajib diisi'),
  supervisionId: yup.string().required('Supervisi wajib diisi'),
  workStatusId: yup.string().required('Status Kerja wajib diisi'),
  userId: yup.string().required('NIP wajib diisi'),
  subActivityId: yup.string().required('Sub Aktivitas wajib dipilih'),
  typeEmployee: yup.string().required('Jenis Karyawan wajib dipilih'),
})

export let bkmHarvestValidationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib diisi'),
  date: yup.string().required('Tanggal wajib diisi'),
  divisionId: yup.string().required('Divisi wajib diisi'),
  supervisionId: yup.string().required('Supervisi wajib diisi'),
  workStatusId: yup.string().required('Status Kerja wajib diisi'),
  typeEmployee: yup.string().required('Jenis Karyawan perlu dipilih'),
  workday: yup.string().required('Pilih Hari Kerja terlebih dulu'),
  userId: yup.string().required('NIP wajib diisi'),
  subActivityId: yup.string().required('Sub Aktivitas wajib dipilih'),
})
