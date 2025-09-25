import * as yup from 'yup'

export let changePasswordValidation = yup.object().shape({
  currentPassword: yup.string().required('Masukkan kata sandi sekarang'),
  password: yup.string().required('Masukkan kata sandi baru').min(8, 'Kata sandi minimal berisi 8 karakter'),
})
