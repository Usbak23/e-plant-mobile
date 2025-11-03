import * as yup from 'yup'

export let pmaFilterValidationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib dipilih'),
  divisionId: yup.string().required('Pilih divisi terlebih dahulu'),
  foreman: yup.string().required('Pilih mandor terlebih dahulu'),
  datePMA: yup.string().required('Tanggal PMA wajib diisi').typeError('Masukkan tanggal dengan benar'),
})
