import { min } from 'moment'
import * as yup from 'yup'

const dataMonth = {
  month: yup.number().required('Bulan wajib diisi dalam bentuk integer'),
  labelMonth: yup.string().required('Data Bulan wajib diisi'),
  percentage: yup
    .number()
    .min(0, 'Minimum adalah 0')
    // .positive('Persentase tidak valid')
    .required('Persentase wajib diisi')
    .typeError('Isi Persentase dengan benar'),
  scatter: yup
    .number()
    .min(0, 'Minimum adalah 0')
    // .positive('Sebaran tidak valid')
    .required('Sebaran wajib diisi')
    .typeError('Isi Sebaran dengan benar'),
  janjangPerMonth: yup
    .number()
    .min(0, 'Minimum adalah 0')
    // .positive('Sebaran tidak valid')
    .required('Sebaran wajib diisi')
    .typeError('Isi Janjang Per Blok dengan benar'),
}

const dataMonthV2 = {
  month: yup.number().required('Bulan wajib diisi dalam bentuk integer'),
  labelMonth: yup.string().required('Data Bulan wajib diisi'),
  percentage: yup
    .number()
    .min(0, 'Minimum adalah 0')
    // .positive('Persentase tidak valid')
    .required('Persentase wajib diisi')
    .typeError('Isi Persentase dengan benar'),
  bjr: yup
    .number()
    .min(0, 'Minimum bjr adalah 0')
    // .positive('Sebaran tidak valid')
    .required('BJR wajib diisi')
    .typeError('Isi BJR dengan benar'),
  yield: yup
    .number()
    .min(0, 'Minimum yield adalah 0')
    // .positive('Sebaran tidak valid')
    .required('Yield wajib diisi')
    .typeError('Isi yield dengan benar'),
  scatter: yup
    .number()
    .min(0, 'Minimum adalah 0')
    // .positive('Sebaran tidak valid')
    .required('Sebaran wajib diisi')
    .typeError('Isi Sebaran dengan benar'),
  janjangPerMonth: yup
    .number()
    .min(0, 'Minimum adalah 0')
    // .positive('Sebaran tidak valid')
    .required('Sebaran wajib diisi')
    .typeError('Isi Janjang Per Blok dengan benar'),
}

export let censusValidationSchemaFirstPage = yup.object().shape({
  organization: yup.string().required('Organisasi wajib diisi'),
  divisionId: yup.string().required('Divisi wajib diisi'),
  blockId: yup.string().required('Blok wajib diisi'),
  yearOfCensus: yup.number().positive().required('Tahun Sensus wajib diisi').typeError('Tahun Sensus tidak valid'),
  totalTree: yup
    .number()
    .min(1, 'Minimum jumlah pokok adalah 1')
    .required('Jumlah Pokok wajib diisi')
    .typeError('Masukkan Jumlah Pokok dengan benar'),
  quarter: yup.number().min(1).max(3).required('Kuartal wajib diisi').typeError('Isi Kuartal dengan benar'),
})

export let censusValidationSchemaSecondPage = yup.object().shape({
  totalTreeChecked: yup
    .number()
    .min(0, 'Minimum Jumlah Pokok Diperiksa adalah 0')
    .required('Jumlah Pokok Diperiksa wajib diisi')
    .typeError('Masukkan Jumlah Pokok Diperiksa dengan benar'),
  totalFruit: yup
    .number()
    .min(0, 'Jumlah Janjang minimal adalah 0')
    .required('Jumlah Janjang wajib diisi')
    .typeError('Masukkan Jumlah Janjang dengan benar'),
  averageFruit: yup
    .number()
    .min(0, 'Rata-rata Janjang harus lebih dari 0')
    .required('Rata-rata Janjang wajib diisi')
    .typeError('Rata-rata Janjang tidak valid')
    .test('floatingPoint', 'Rata-rata Janjang tidak valid', value => {
      if (value) {
        // const validated = value.toString().match(/^(\d*\.{0,1}\d{0,3}$)/)
        const validated = value.toFixed(2)
        return Boolean(validated)
      }
      return false
    }),
  totalFruitOfBlock: yup
    .number()
    .min(0, 'Janjang per-blok harus lebih dari 1')
    .required('Janjang per-blok wajib diisi')
    .typeError('Janjang per-blok tidak valid')
    .test('floatingPoint', 'Janjang per-blok tidak valid', value => {
      if (value) {
        // const validated = value.toString().match(/^(\d*\.{0,1}\d{0,3}$)/)
        const validated = value.toFixed(2)

        return Boolean(validated)
      }
      return false
    }),
  bjr: yup.number().min(0, 'BJR minimum adalah 1').required('BJR wajib diisi').typeError('BJR tidak valid'),
  totalTonnage: yup
    .number()
    // .positive('Total Tonase (Kg) tidak valid')
    .min(0, 'Total Tonase (kg) harus lebih dari 0')
    .required('Total Tonase (kg) wajib diisi')
    .typeError('Total Tonase (kg) tidak valid'),
  tonnagePerHectare: yup
    .number()
    // .positive('Ton/Ha tidak valid')
    .min(0, 'Ton/Ha minimum adalah 0')
    .required('Ton/Ha wajib diisi')
    .typeError('Ton/Ha tidak valid'),
})

export let censusValidationSchemaSecondPageV2 = yup.object().shape({
  totalTreeChecked: yup
    .number()
    .min(0, 'Minimum Jumlah Pokok Diperiksa adalah 0')
    .required('Jumlah Pokok Diperiksa wajib diisi')
    .typeError('Masukkan Jumlah Pokok Diperiksa dengan benar'),
  totalFruit: yup
    .number()
    .min(0, 'Jumlah Janjang minimal adalah 0')
    .required('Jumlah Janjang wajib diisi')
    .typeError('Masukkan Jumlah Janjang dengan benar'),
  averageFruit: yup
    .number()
    .min(0, 'Rata-rata Janjang harus lebih dari 0')
    .required('Rata-rata Janjang wajib diisi')
    .typeError('Rata-rata Janjang tidak valid')
    .test('floatingPoint', 'Rata-rata Janjang tidak valid', value => {
      if (value) {
        // const validated = value.toString().match(/^(\d*\.{0,1}\d{0,3}$)/)
        const validated = value.toFixed(2)
        return Boolean(validated)
      }
      return false
    }),
  totalFruitOfBlock: yup
    .number()
    .min(0, 'Janjang per-blok harus lebih dari 1')
    .required('Janjang per-blok wajib diisi')
    .typeError('Janjang per-blok tidak valid')
    .test('floatingPoint', 'Janjang per-blok tidak valid', value => {
      if (value) {
        // const validated = value.toString().match(/^(\d*\.{0,1}\d{0,3}$)/)
        const validated = value.toFixed(2)

        return Boolean(validated)
      }
      return false
    }),
  bjr: yup.string()
    .min(0, 'BJR minimum adalah 1')
    .nullable()
    .notRequired()
    .typeError('BJR tidak valid'),
  totalTonnage: yup
    .string()
    .nullable()
    .notRequired()
    .min(0, 'Total Tonase (kg) harus lebih dari 0')
    .typeError('Total Tonase (kg) tidak valid'),
  tonnagePerHectare: yup
    .string()
    .nullable()
    .notRequired()
    .min(0, 'Ton/Ha minimum adalah 0')
    .typeError('Ton/Ha tidak valid'),
  censusMonths: yup
    .array()
    .of(yup.object().shape(dataMonthV2))
    .required('Data sensus caturwulan wajib diisi')
    .min(4, 'Setidaknya empat bulan data wajib diisi')
    .max(4, 'Maksimum pengisian adalah empat bulan (1 caturwulan)')
    .typeError('Data sensus tidak valid')
    .test('sum', 'Total kumulatif persentase harus seratus persen', (rows = []) => {
      const total = rows.reduce((total, row) => {
        return total + (row.percentage || 0)
      }, 0)

      return total == 100
    }),
})

export let censusValidationSchemaThirdPage = yup.object().shape({
  quarter: yup.number().min(1).max(4).required('Kuartal wajib diisi').typeError('Isi Kuartal dengan benar'),

  censusMonths: yup
    .array()
    .of(yup.object().shape(dataMonth))
    .required('Data sensus caturwulan wajib diisi')
    .min(4, 'Setidaknya empat bulan data wajib diisi')
    .max(4, 'Maksimum pengisian adalah empat bulan (1 caturwulan)')
    .typeError('Data sensus tidak valid')
    .test('sum', 'Total kumulatif persentase harus seratus persen', (rows = []) => {
      const total = rows.reduce((total, row) => {
        return total + (row.percentage || 0)
      }, 0)

      return total == 100
    }),
})
