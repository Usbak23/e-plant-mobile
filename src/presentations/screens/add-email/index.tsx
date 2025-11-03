import {actions, RootStateType} from '@app/domain/states/store'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {theme} from '@app/presentations/utils/styles'
import {Button, Header, Text, TextInput} from '@app/presentations/_shared-components'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation} from '@react-navigation/native'
import React, {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import * as yup from 'yup'

const validation = yup.object().shape({
  email: yup.string().email('Format email tidak sesuai').required('Email wajib diisi'),
})

const AddEmail = () => {
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const formAddOrUpdateEmail = useSelector((state: RootStateType) => state?.user?.userAddOrChangeEmailForm)
  const user = useSelector((state: RootStateType) => state?.user?.currentUserInfo)
  const resolver = useYupValidationResolver(validation)
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (form: {email: string}) => {
    dispatch(actions.addOrChangeEmail.request({loading: true, data: form}))
  }

  useEffect(() => {
    const error = formAddOrUpdateEmail?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formAddOrUpdateEmail?.error])

  useEffect(() => {
    const data = formAddOrUpdateEmail?.data
    if (data?.status == 'success') {
      showSuccessToast('Perubahan disimpan. Lakukan verifikasi email')
      navigation.goBack()
    }
  }, [formAddOrUpdateEmail?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title={user?.data?.email ? 'Ubah Email' : 'Tambah Email'} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: 56}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <TextInput
          errorText={errors?.email?.message}
          label="Masukkan Email Anda"
          placeholder="Masukkan email"
          control={control}
          name="email"
          isRequired
        />

        <Button disabled={Boolean(formAddOrUpdateEmail?.loading)} onPress={handleSubmit(onSubmit)}>
          <Text color="white">{formAddOrUpdateEmail?.loading ? 'Tunggu sebentar' : 'Simpan'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddEmail

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
})
