import * as yup from 'yup'
export let receptionHistoryValidationSchema = yup.object().shape({
  qtyAccepted: yup
    .number()
    .required('Jumlah wajib diisi')
    .typeError('Masukkan jumlah dengan benar')
    .min(0, 'Masukkan jumlah dengan benar'),

  dateAccepted: yup.string().required('Tanggal pembelian wajib diisi').typeError('Masukkan tanggal dengan benar'),
})
