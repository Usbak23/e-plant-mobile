import * as yup from 'yup'

const blockYearSchema = {
  year: yup.number().required('Tahun wajib diisi'),
}

const blockVarietySchema = {
  variety: yup.string().required('Varietas wajib diisi'),
}

const plantingYearHistorySchema = yup.object().shape({
  plantingYear: yup
    .number()
    .required('Tahun Tanam wajib diisi')
    .min(1900, 'Tahun Tanam Tidak di dalam range')
    .typeError('Masukkan tahun tanam dengan benar')
    .transform((value) => !!value ? value : null),
  totalTreeEachYear: yup
    .number()
    .required('Total pokok wajib diisi')
    .min(0, 'Isi total pokok dengan benar')
    .typeError('Total pokok wajib diisi'),
  blockAreaEachYear: yup.number()
    .required('Luas wajib diisi')
    .min(0, 'Isi luas dengan benar')
    .typeError('Luas wajib diisi'),
})

export let blockValidationSchema = yup.object().shape({
  organization: yup.string().required('Organisasi wajib diisi'),
  divisionId: yup.string().required('Divisi wajib diisi'),
  code: yup.string().required('Kode blok wajib diisi'),
  blockArea: yup
    .number()
    .positive('Luas area tidak valid')
    .required('Luas area wajib diisi')
    // .min(0, 'Isi luas area dengan benar')
    .typeError('Luas area wajib diisi'),
  //disabled on phase-3
  // totalTree: yup
  //   .number()
  //   .required('Total pokok wajib diisi')
  //   .min(0, 'Isi total pokok dengan benar')
  //   .typeError('Total pokok wajib diisi'),

  // plantingYear: yup
  //   .array()
  //   .of(yup.object().shape(blockYearSchema))
  //   .required('Tahun tanam tidak boleh kosong')
  //   .min(1, 'Tahun tanam wajib diisi'),
  harvestChapel: yup
    .string()
    .required('Kapel panen wajib diisi')
    // .min(0, 'Kapel panen wajib diisi dengan benar')
    .typeError('Kapel panen wajib diisi dengan benar'),
  numberOfLine: yup
    .number()
    .required('Jumlah baris wajib diisi')
    .min(0, 'Jumlah baris wajib diiisi')
    .typeError('Jumlah baris wajib diisi'),
  varieties: yup
    .array()
    .of(yup.object().shape(blockVarietySchema))
    .required('Varietas tidak boloh kosong')
    .min(1, 'Varietas wajib diisi'),
  careForeman: yup.string().typeError('Mandor Rawat wajib diisi').nullable(),
  harvestForeman: yup.string().typeError('Mandor Panen wajib diisi').nullable(),
  harvestClerk: yup.string().typeError('Kerani Panen wajib diisi').nullable(),
  geoJson: yup.object().nullable(),
  fileGeoJson: yup.string().nullable(),
  //phase-3
  usedArea: yup.number().nullable().min(0, 'Luas tidak boleh negatif').typeError('Masukkan luas terpakai dengan benar').transform((value) => !!value ? value : null),
  unusedArea: yup.number().nullable().min(0, 'Luas tidak boleh negatif').typeError('Masukkan luas tidak terpakai dengan benar').transform((value) => !!value ? value : null),
  plantingYearHistory: yup.array().of(plantingYearHistorySchema).typeError('Isi tahun tanam dengan benar').min(1, 'Tahun tanam wajib diisi'),
  bjr: yup.number().required('BJR wajib diisi').min(0, 'BJR tidak boleh negatif').typeError('Masukkan BJR dengan benar'),

})
