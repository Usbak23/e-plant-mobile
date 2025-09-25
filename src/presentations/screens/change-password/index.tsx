import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {theme} from '@app/presentations/utils/styles'
import {Button, Header, Text, TextInput} from '@app/presentations/_shared-components'
import React, {useEffect} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import * as schema from '@utils/validation/change-password-validation'
import {useForm} from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation} from '@react-navigation/native'
import { database } from '@root/index'

const ProfileChangePassword = () => {
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(schema.changePasswordValidation)
  const formUpdatePassword = useSelector((state: RootStateType) => state?.user?.userUpdatePasswordForm)

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      password: '',
    },
  })

  const logout = async () => {
    const db = database
    await db.write(async () => {
      const allTPHOnDatabase = await db.collections.get('tphs').query().fetch()
      const deleted = allTPHOnDatabase.map(c => c.prepareDestroyPermanently())
      await db.batch(...deleted)
    })

    dispatch(actions.clearRkhTakeCareDraft.request({loading: true, data: []}))
    dispatch(actions.clearRkhDraft.request({loading: true, data: []}))
    dispatch(actions.clearBpbksDraft.request({loading: true, data: []}))
    dispatch(actions.clearBkmTakeCareDraft.request({loading: true, data: []}))
    dispatch(actions.clearBkmDraft.request({loading: true, data: []}))
    dispatch(actions.clearAttendanceDraft.request({loading: true, data: []}))
    dispatch(actions.clearAkpDraft.request({loading: true, data: []}))
    dispatch(actions.logout.request({loading: true}))
    
  }

  const onSubmit = (form: {currentPassword: string; password: string}) => {
    dispatch(actions.updatePassword.request({loading: true, data: form}))
  }

  useEffect(() => {
    const error = formUpdatePassword?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formUpdatePassword?.error])

  useEffect(() => {
    const data = formUpdatePassword?.data
    if (data?.status == 'success') {
      logout()
      showSuccessToast('Password berhasil diperbarui. Silakan login kembali')
      // navigation.goBack()
    }
  }, [formUpdatePassword?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Ubah Kata Sandi" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: 56}}
        showsVerticalScrollIndicator={false}>
        <TextInput
          isPassword
          label="Masukkan Kata Sandi Saat Ini"
          placeholder="Masukkan kata sandi"
          control={control}
          name="currentPassword"
          isRequired
          errorText={errors?.currentPassword?.message}
        />
        <TextInput
          isPassword
          errorText={errors?.password?.message}
          label="Masukkan Kata Sandi Baru"
          placeholder="Masukkan kata sandi"
          control={control}
          name="password"
          isRequired
        />

        <Button disabled={Boolean(formUpdatePassword?.loading)} onPress={handleSubmit(onSubmit)}>
          <Text color="white">{formUpdatePassword?.loading ? 'Tunggu sebentar' : 'Simpan'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileChangePassword

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
})
