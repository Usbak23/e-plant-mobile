import {CalculationReferences} from '@app/models/eplant/Taxation'
import * as yup from 'yup'
export let taxationValidationSchema = yup.object().shape({
  akpId: yup.string().required('AKP Id wajib diisi'),
  harvestChapel: yup.string().required('Kapel Panen wajib diisi').typeError('Kapel Panen tidak valid'),
  // .min(0, 'Minimal Kapel Panen adalah nol'),
  akpPercent: yup.number().positive('% AKP tidak valid').required('% AKP wajib diisi').typeError('% AKP tidak valid'),
  // .min(0, 'Minimal % AKP adalah nol'),
  sph: yup.number().required('SPH wajib diisi').typeError('SPH tidak valid').min(0, 'Minimal SPH adalah nol'),
  totalHectares: yup
    .number()
    // .transform(value => (isNaN(value) || value == '' || !isFinite(value) ? null : value.toFixed(2)))
    .positive('Total Ha tidak valid')
    .required('Total Ha wajib diisi')
    // .min(0, 'Minimal Total Ha adalah nol')
    .typeError('Total Ha tidak valid'),
  hectareRestOfToday: yup
    .number()
    .required('Ha Hari Ini wajib diisi')
    .min(0, 'Minimal Ha Hari Ini adalah nol')
    .max(yup.ref('totalHectares'), 'Ha Hari Ini tidak boleh lebih besar dari Total Ha')
    .typeError('Ha Hari Ini tidak valid'),

  hectareRestOfTommorow: yup
    .number()
    .required('Ha Esok Hari wajib diisi')
    .min(0, 'Minimal Ha Esok Hari adalah nol')
    .typeError('Ha Esok Hari tidak valid'),

  ripeFruit: yup
    .number()
    .required('Janjang Masak wajib diisi')
    .min(0, 'Minimal Janjang Masak adalah nol')
    .typeError('Janjang Masak tidak valid'),

  bjr: yup
    .number()
    .required('BJR Ini wajib diisi')
    .min(0, 'Minimal BJR adalah nol')
    .typeError('BJR tidak valid')
    .test('floatingPoint', 'BJR yang dimasukkan tidak valid', value => {
      if (value == 0) {
        return true
      }
      if (value) {
        // const validated = value.toString().match(/^(\d*\.{0,1}\d{0,3}$)/)
        const validated = value.toFixed(2)
        return Boolean(validated)
      }

      return false
    }),

  kilogram: yup
    .number()
    .required('Kilogram wajib diisi')
    .min(0, 'Minimal Kilogram adalah nol')
    // .round('ceil')
    .typeError('Kilogram tidak valid'),

  calculationReference: yup
    .mixed()
    .oneOf(
      CalculationReferences.map(reference => reference.value),
      'Acuan Hitung tidak valid',
    )
    .required('Acuan Hitung wajib diisi')
    .typeError('Acuan Hitung tidak valid'),
  numberOfEmployees: yup
    .number()
    .positive('Jumlah Karyawan tidak valid')
    .required('Jumlah Karyawan wajib diisi')
    .typeError('Jumlah Karyawan tidak valid'),

  kilogramPerHk: yup
    .number()
    .min(0, 'Kilogram/HK minimum adalah nol')
    .required('Kilogram/HK wajib diisi')
    .typeError('Kilogram/HK tidak valid')
    .test('floatingPoint', 'Angka yang dimasukkan tidak valid', value => {
      if (value == 0) {
        return true
      }
      if (value) {
        // const validated = value.toString().match(/^(\d*\.{0,1}\d{0,3}$)/)
        const validated = value.toFixed(2)
        return Boolean(validated)
      }

      return false
    }),
  date: yup.string().required('Tanggal Taksasi wajib diisi').typeError('Masukkan tanggal dengan benar'),
  haRealization: yup
    .number()
    .min(0, 'Minimum Ha Realisasi adalah nol')
    .required('Ha Realisasi wajib diisi')
    .typeError('Ha Realisasi tidak valid'),
})
