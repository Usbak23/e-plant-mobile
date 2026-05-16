import * as yup from 'yup'

const tonnage = yup.object().shape({
  blockId: yup.string().required('Blok wajib dipilih').typeError('Pilih blok terlebih dahulu'),
  totalJanjang: yup
    .number()
    .min(0, 'Janjang tak boleh negatif')
    .required('Janjang Wajib diisi')
    .typeError('Janjang wajib diisi'),
})

const baseSchema = {
  poNumber: yup.string().required('Organisasi wajib diisi'),
  date: yup.string().required('Tanggal wajib diisi'),
  organizationId: yup.string().required('Pilih organisasi terlebih dahulu'),
  driver: yup.string().required('Sopir wajib diisi'),
  itemId: yup.string().required('Nomor kendaraan wajib diisi'),
  grossWeight: yup
    .number()
    .min(0, 'Berat Gross minimum adalah 0')
    .required('Berat Gross wajib diisi')
    .typeError('Masukkan Berat Gross dengan benar'),
  tareWeight: yup
    .number()
    .min(0, 'Berat Tare minimum adalah 0')
    .max(yup.ref('grossWeight'), 'Berat Tare tak boleh melebihi Berat Gross')
    .required('Berat Tare wajib diisi')
    .typeError('Masukkan Berat Tare dengan benar'),
  netto: yup.number().min(0, 'Netto tidak boleh negatif').typeError('Netto tidak valid'),
}

export const tonnageGardenFormValidationSchema = yup.object().shape({
  ...baseSchema,
  gardenTonnageBlocks: yup
    .array()
    .of(tonnage)
    .required('Data Blok wajib diisi')
    .min(1, 'Setidaknya ada perlu satu data'),
})

export const tonnageGardenDraftValidationSchema = yup.object().shape({
  poNumber: yup.string().required('Organisasi wajib diisi'),
  date: yup.string().required('Tanggal wajib diisi'),
  organizationId: yup.string().required('Pilih organisasi terlebih dahulu'),
  driver: yup.string().required('Sopir wajib diisi'),
  itemId: yup.string().required('Nomor kendaraan wajib diisi'),
  grossWeight: yup.mixed().nullable(),
  tareWeight: yup.mixed().nullable(),
  netto: yup.mixed().nullable(),
  gardenTonnageBlocks: yup.array(),
})
