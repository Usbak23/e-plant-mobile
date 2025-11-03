import React, {useState, useEffect} from 'react'
import {StyleSheet, Image, View, StatusBar, TouchableOpacity} from 'react-native'

import {theme} from '@styles'
const {colors} = theme
import {RFValue as fs} from 'react-native-responsive-fontsize'

import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Text from '@components/Text'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useNavigation, useRoute} from '@react-navigation/core'
import Routes from '@app/presentations/navigation/Routes'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'

let validationSchema = yup.object().shape({
  password: yup.string().required('Password is required').min(8),
  passwordConfirmation: yup
    .string()
    .required('Confirmation password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
})

const ResetPassword = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const params = route?.params
  const dispatch = useDispatch()

  const resolver = useYupValidationResolver(validationSchema)
  const {loading, data, error} = useSelector(
    (state: RootStateType) => state.user?.changePasswordStatus || {loading: false, data: null, error: null},
  )

  const {
    handleSubmit,
    control,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onSubmit',
    defaultValues: {
      email: params?.email,
      token: params?.token,
      password: '',
      passwordConfirmation: '',
    },
  })
  useEffect(() => {
    if (data?.status == 'success') {
      showSuccessToast('Sukses mereset kata sandi, silahkan login kembali!')
      navigation.navigate(Routes.LOGIN)
    }
  }, [data])

  useEffect(() => {
    if (error?.message) {
      showErrorToast(error?.message || 'Gagal mereset kata sandi, silahkan coba lagi!')
    }
  }, [error])

  const doForgotPassword = (data: any) => {
    if (data?.password != data?.passwordConfirmation) {
      showErrorToast('Kata sandi dan konfirmasi kata sandi tidak sama')
      return
    }
    dispatch(
      actions.changePassword.request({
        loading: true,
        data,
      }),
    )
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar animated={true} backgroundColor={theme.colors.backgroundDark} barStyle="light-content" />

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Image source={require('@assets/images/sag.png')} style={styles.arvisLogoImg} />
        </View>

        <Text type="regular" size={12} style={styles.helperColor}>
          Masukkan Kata Sandi baru Anda pada kolom di bawah ini!
        </Text>

        <TextInput
          isPassword={true}
          control={control}
          errorText={errors?.password?.message}
          useDarkTheme={true}
          name="password"
          style={{fontSize: 12}}
          placeholder="Kata Sandi Baru"
        />

        <TextInput
          isPassword={true}
          control={control}
          errorText={errors?.passwordConfirmation?.message}
          useDarkTheme={true}
          name="passwordConfirmation"
          style={{fontSize: 12}}
          placeholder="Konfirmasi Kata Sandi baru"
        />

        <Button style={styles.signInButton} disabled={Boolean(loading)} onPress={handleSubmit(doForgotPassword)}>
          <Text type="semibold" style={styles.signInButtonText}>
            {loading ? 'Loading...' : 'Atur ulang kata sandi'}
          </Text>
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.LOGIN)} style={styles.textButton}>
          <Text type="semibold" color={theme.colors.accent} size={12}>
            Kembali ke Login.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ResetPassword

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: theme.colors.backgroundDark,
    justifyContent: 'space-between',
  },
  headerContainer: {
    backgroundColor: theme.colors.backgroundDark,
    borderBottomLeftRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerWrapper: {
    height: '75%',
    backgroundColor: theme.colors.backgroundDark,
  },
  contentContainer: {
    paddingHorizontal: 23,
    backgroundColor: theme.colors.backgroundDark,
    justifyContent: 'center',
    borderTopRightRadius: 50,
    height: '100%',
    paddingTop: 24,
  },
  iconButton: {
    resizeMode: 'contain',
    width: 16,
    height: 16,
  },
  title: {
    fontSize: fs(18),
    lineHeight: 25,
    marginBottom: 18,
  },
  signInButton: {
    backgroundColor: '#F0B10D',
    marginTop: 23,
  },
  signInButtonText: {
    fontSize: fs(13),
    color: colors.white,
    fontWeight: 'normal',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  dontHaveAccountText: {
    marginVertical: 18,
    textAlign: 'center',
    fontSize: fs(11),
    color: '#515151',
  },
  signUpNowText: {
    fontSize: fs(11),
    color: '#F0B10D',
  },
  googleButtonText: {
    fontWeight: 'normal',
    fontSize: fs(13),
    color: '#515151',
  },
  arvisLogoImg: {
    alignSelf: 'center',
    height: 78,
    width: 72,
    resizeMode: 'contain',
  },
  helperColor: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 28,
  },
  text: {
    color: 'white',
    fontSize: 13,
  },
  textButton: {alignSelf: 'center', marginTop: 20},
})
