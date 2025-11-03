import * as yup from 'yup'

export let rkhHarvestEmployeeValidationSchema = yup.object().shape({
  id: yup.string().required('Wajib diisi'),
  typeEmployeeId: yup.string().required('Tipe Karyawan wajib diisi'),
  qty: yup
    .number()
    .required('Kuantitas wajib diisi')
    .min(1, 'Minimal Kuantitas adalah satu (1)')
    .typeError('Kuantitas tidak valid'),
  cost: yup
    .number()
    .required('Biaya wajib diisi')
    .min(0, 'Minimal Biaya adalah nol (0)')
    .typeError('Biaya tidak valid'),
  name: yup.string(),
  roleCategory: yup.string(),
  typeEmployee: yup.string(),
})

export let rkhHarvestArrayWorkerSchema = yup.object().shape({
  _id: yup.string().required('Wajib diisi'),
  typeEmployeeId: yup.string().required('Tipe Karyawan wajib diisi'),
  qty: yup
    .number()
    .required('Kuantitas wajib diisi')
    .min(1, 'Minimal Kuantitas adalah satu (1)')
    .typeError('Kuantitas tidak valid'),
  cost: yup
    .number()
    .required('Biaya wajib diisi')
    .min(0, 'Minimal Biaya adalah nol (0)')
    .typeError('Biaya tidak valid'),
  name: yup.string(),
  roleCategory: yup.string(),
  typeEmployee: yup.string(),
})

export let rkhTakeCareItemValidationSchema = yup.object().shape({
  id: yup.string().required('Wajib diisi'),
  qty: yup
    .number()
    .required('Kuantitas wajib diisi')
    .min(1, 'Minimal Kuantitas adalah satu (1)')
    .typeError('Kuantitas tidak valid'),
  cost: yup
    .number()
    .required('Biaya wajib diisi')
    .min(0, 'Minimal Biaya adalah nol (0)')
    .typeError('Biaya tidak valid'),
})

export const rkhHarvestFormValidationSchema = yup.object().shape({
  rkhId: yup.string().required('RKH ID wajib diisi'),
  taxationId: yup.string().required('Taksasi ID wajib diisi'),
  worker: yup
    .array()
    .of(rkhHarvestArrayWorkerSchema)
    .required('Tenaga Kerja wajib diisi')
    .min(1, 'Tenaga Kerja tidak boleh kosong')
    .typeError('Tenaga Kerja tidak valid'),
})
