import * as yup from 'yup'

export let bpbksValidationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib diisi'),
  foremanId: yup.string().required('Pemanen wajib diisi'),
  date: yup.string().required('Tanggal wajib diisi'),
  divisionId: yup.string().required('Divisi wajib diisi'),
  harvesterId: yup.string().required('Pemanen wajib diisi'),
  cutNumber: yup.number().required('No. Potong wajib diisi').typeError('Isi No. Potong dengan angka'),
})
