import * as yup from 'yup'

export let tonnagePksFormListValidationSchema = yup.object().shape({
  organizationId: yup.string().required('Pilih organisasi terlebih dahulu'),
  spbId: yup.string().required('No. Nota PO/DO Kebun wajib diisi'),
  // poNumberPks: yup.string().required('No. Nota PO/DO PKS wajib diisi'),
  date: yup.string().required('Tanggal wajib diisi'),
  driver: yup.string().required('Supir wajib diisi'),
  itemId: yup.string().required('No. Kendaraan wajib diisi'),
  decision: yup.string().required('Keputusan wajib diisi').oneOf(['Diterima', 'Ditolak']),
  grossWeight: yup
    .number()
    .min(0, 'Berat Gross tidak boleh negatif')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Gross Gross wajib diisi'),
    })
    .typeError('Berat Gross tidak valid'),
  tareWeight: yup
    .number()
    .min(0, 'Berat Tare tidak boleh negatif')
    .max(yup.ref('grossWeight'), 'Berat Tare tak boleh melebihi Berat Gross')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Berat Tare wajib diisi'),
    })
    .typeError('Berat Tare tidak valid'),
  nettoFirst: yup
    .number()
    .min(0, 'Netto 1 tidak boleh negatif')
    // .required('Netto 1 wajib diisi')
    // .when('decision', {
    //   is: (value: string) => value == 'Diterima',
    //   then: rule => rule.required('Netto 1 wajib diisi'),
    // })
    .typeError('Netto 1 tidak valid'),
  refraksiKg: yup
    .number()
    .min(0, 'Refraksi (kg) tidak boleh negatif')
    // .required('Refraksi wajib diisi. Jika tidak ada, gunakan 0')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Refraksi (Kg) wajib diisi'),
    })
    .typeError('Refraksi (Kg) tidak valid'),
  refraksi: yup
    .number()
    .min(0, 'Refraksi tidak boleh negatif')
    .max(100, 'Refraksi maksimum adalah 100 dalam persen')
    // .required('Refraksi wajib diisi. Jika tidak ada, gunakan 0')
    // .when('decision', {
    //   is: (value: string) => value == 'Diterima',
    //   then: rule => rule.required('Refraksi wajib diisi'),
    // })
    .typeError('Refraksi tidak valid'),
  nettoSecond: yup
    .number()
    .min(0, 'Netto 2 tidak boleh negatif')
    // .required('Netto 2 wajib diisi')
    // .when('decision', {
    //   is: (value: string) => value == 'Diterima',
    //   then: rule => rule.required('Netto 2 wajib diisi'),
    // })
    .typeError('Netto 2 tidak valid'),
  tenera: yup
    .number()
    .min(0, 'Tenera tidak boleh negatif')
    // .required('Tenera wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Tenera wajib diisi'),
    })
    .typeError('Tenera tidak valid'),
  dura: yup
    .number()
    .min(0, 'Dura tidak boleh negatif')
    // .required('Olira wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Dura wajib diisi'),
    })
    .typeError('Dura tidak valid'),
  total: yup
    .number()
    .min(0, 'Total tidak boleh negatif')
    // .required('Total wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Total wajib diisi'),
    })
    .typeError('Isi Total dengan benar'),
  halfRipe: yup
    .number()
    .min(0, 'Mengkal tidak boleh negatif')
    // .required('Mengkal wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Mengkal wajib diisi'),
    })
    .typeError('Mengkal tidak valid'),
  raw: yup
    .number()
    .min(0, 'Mentah tidak boleh negatif')
    // .required('Mentah wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Mentah wajib diisi'),
    })
    .typeError('Mentah tidak valid'),
  abnormal: yup
    .number()
    .min(0, 'Abnormal tidak boleh negatif')
    // .required('Abnormal wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Abnormal wajib diisi'),
    })
    .typeError('Abnormal tidak valid'),
  peram: yup
    .number()
    .min(0, 'Peram tidak boleh negatif')
    // .required('Peram wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Peram wajib diisi'),
    })
    .typeError('Peram tidak valid'),
  jangkos: yup
    .number()
    .min(0, 'Jangkos tidak boleh negatif')
    // .required('Jangkos wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Jangkos wajib diisi'),
    })
    .typeError('Jangkos tidak valid'),
  rottenLooseFruit: yup
    .number()
    .min(0, 'Brondolan Busuk tidak boleh negatif')
    // .required('Brondolan Busuk wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Brondolan busuk wajib diisi'),
    })
    .typeError('Brondolan Busuk tidak valid'),
  rubbish: yup
    .number()
    .min(0, 'Tenera tidak boleh negatif')
    // .required('Tenera wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Tenera wajib diisi'),
    })
    .typeError('Tenera tidak valid'),
  lateRipe: yup
    .number()
    .min(0, 'Lewat Matang tidak boleh negatif')
    // .required('Lewat Matang wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Lewat Matang wajib diisi'),
    })
    .typeError('Lewat matang tidak valid'),
  longStalk: yup
    .string()
    // .required('Tangkai wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Tangkai wajib diisi'),
    })
    .nullable()
    .oneOf(['Panjang', 'Pendek', null], 'Pilih tangkai dari pilihan yang tersedia')
    .typeError('Tangkai tidak valid'),
  etc: yup
    .string()
    // .required('Lain-Lain wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Lain-Lain wajib diisi'),
    })
    .nullable()
    .oneOf(['Restan', 'Pasir', 'Basah', 'Kotor', null], 'Pilih lain-lain dengan benar')
    .typeError('Lain-Lain tidak valid'),
  fruitReturned: yup
    .number()
    .min(0, 'Buah Dipulangkan tidak boleh negatif')
    // .required('Buah Dipulangkan wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Buah Dipulangkan wajib diisi'),
    })
    .typeError('Buah Dipulangkan tidak valid'),
  janjang: yup
    .number()
    .min(0, 'Janjang tidak boleh negatif')
    // .required('Buah Dipulangkan wajib diisi')
    .when('decision', {
      is: (value: string) => value == 'Diterima',
      then: rule => rule.required('Janjang wajib diisi'),
    })
    .typeError('Isi Janjang dengan benar'),
  bjr: yup
    .string()
    .min(0, 'BJR tidak boleh negatif')
  // .required('Netto 2 wajib diisi')
  // .when('decision', {
  //   is: (value: string) => value == 'Diterima',
  //   then: rule => rule.required('Netto 2 wajib diisi'),
  // })
  // .typeError('BJR tidak valid'),
})
