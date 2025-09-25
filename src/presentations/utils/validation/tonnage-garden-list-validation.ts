import * as yup from 'yup'

export let tonnageGardenListValidationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib diisi'),
  date: yup.string().required('Tanggal wajib diisi'),
})
