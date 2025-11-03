import * as yup from 'yup'

export let attendanceFileFormValidationSchema = yup.object().shape({
  divisionId: yup.string().required('Divisi harus dipilih terlebih dahulu'),
  date: yup.string().required('Tanggal absensi wajib diisi'),
  file: yup
    .mixed()
    .required('File excel wajib diisi')

    .test('file', 'Belum ada file yang dipilih', v => {
      if (Object.keys(v).length == 0) {
        return false
      }
      return true
    })
    .test('fileSize', 'File absensi terlalu besar', value => {
      if (value?.size && value.size > 5000000) {
        return false
      }
      return true
    }),
})
