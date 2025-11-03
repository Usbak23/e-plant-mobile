import * as yup from 'yup'
export let rawMaterialValidationSchema = yup.object().shape({
  name: yup.string().required('Nama material wajib diisi'),
  code: yup.string().required('Kode material wajib diisi'),
  organizationId: yup.string().required('Organisasi wajib diisi'),
  location: yup.string().required('Lokasi wajib diisi'),
  uomId: yup.string().required('Satuan wajib diisi'),
  price: yup.string().required('Harga wajib diisi').typeError('Masukkan harga dengan benar'),
  purchaseOrder: yup.string().required('No. Purchase Order wajib diisi'),
  qty: yup
    .number()
    .required('Jumlah wajib diisi')
    .typeError('Masukkan jumlah dengan benar')
    .min(0, 'Masukkan jumlah dengan benar'),
  minStock: yup
    .number()
    .required('Stok minimum wajib diisi')
    .typeError('Masukkan stok minimum dengan benar')
    .min(0, 'Masukkan stok minimum dengan benar'),
  date: yup.string().required('Tanggal pembelian wajib diisi').typeError('Masukkan tanggal dengan benar'),
  type: yup.string().required('Isi tipe material terlebih dahulu').typeError('Mohon isi tipe material dengan benar'),
})

export let rawMaterialValidationUpdateSchema = yup.object().shape({
  name: yup.string().required('Nama material wajib diisi'),
  code: yup.string().required('Kode material wajib diisi'),
  organizationId: yup.string().required('Organisasi wajib diisi'),
  location: yup.string().required('Lokasi wajib diisi'),
  uomId: yup.string().required('Satuan wajib diisi'),
  minStock: yup
    .number()
    .required('Stok minimum wajib diisi')
    .typeError('Masukkan stok minimum dengan benar')
    .min(0, 'Masukkan stok minimum dengan benar'),
  type: yup.string().required('Isi tipe material terlebih dahulu').typeError('Mohon isi tipe material dengan benar'),
})
