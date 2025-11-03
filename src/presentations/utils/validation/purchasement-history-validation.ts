import * as yup from 'yup'

export let purchasementHistoryCreatelValidationSchema = yup.object().shape({
  rawMaterialId: yup.string().required('Raw material terkait wajib diisi'),
  id: yup.string(),
  price: yup.string().required('Harga wajib diisi').typeError('Masukkan harga dengan benar'),
  purchaseOrder: yup.string().required('No. Purchase Order wajib diisi'),
  qty: yup
    .number()
    .required('Jumlah wajib diisi')
    .typeError('Masukkan jumlah dengan benar')
    .min(0, 'Masukkan jumlah dengan benar'),
  date: yup.string().required('Tanggal pembelian wajib diisi').typeError('Masukkan tanggal dengan benar'),
})
