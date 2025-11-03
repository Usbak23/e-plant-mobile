import React, {useState, useEffect} from 'react'
import {StyleSheet, Image, View, StatusBar, TouchableOpacity} from 'react-native'

import flux, {actions, RootStateType} from '@domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import Routes from '@navigation/Routes'
import CheckBox from '@react-native-community/checkbox'

import {theme} from '@styles'
const {colors} = theme
import {RFValue as fs} from 'react-native-responsive-fontsize'

import TextInput from '@components/TextInput'
import {showErrorToast} from '@components/Toast'
import Button from '@components/Button'
import Text from '@components/Text'
import Loader from '@components/Loader'
import {useNavigation} from '@react-navigation/core'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as yup from 'yup'
import {SafeAreaView} from 'react-native-safe-area-context'
// import analytics from '@react-native-firebase/analytics';

let validationSchema = yup.object().shape({
  nipOrEmail: yup.string().required('Email/NIP is required'),
  password: yup.string().required('Password is required'),
})
const Login = () => {
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const auth = useSelector((state: RootStateType) => state?.user)
  const loading = Boolean(auth?.userCredential?.loading)

  const [rememberMe, setRememberMe] = useState<boolean>(auth.userDataLogin?.rememberMe || false)
  const resolver = useYupValidationResolver(validationSchema)

  const {
    handleSubmit,
    control,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      nipOrEmail: auth.userDataLogin?.nipOrEmail,
      password: auth.userDataLogin?.password,
    },
  })

  const goToForgotPassword = () => {
    navigation.navigate(Routes.FORGOT_PASSWORD)
  }

  const signIn = async (data: {}) => {
    
    dispatch(
      actions.login.request({
        loading: true,
        data: {
          ...data,
          rememberMe,
        },
      }),
    )
    // analytics().logEvent('login', {
    //   nipOrEmail: data?.nipOrEmail || ''
    // })
  }

  const RememberMe = () => (
    <TouchableOpacity
      onPress={() => {
        setRememberMe(!rememberMe)
      }}
      style={{flexDirection: 'row', alignItems: 'center'}}>
      <CheckBox
        tintColor={theme.colors.inputDarkTheme}
        tintColors={{
          false: theme.colors.inputDarkTheme,
          true: theme.colors.lightYellow,
        }}
        style={{width: 18, height: 18, marginRight: 10}}
        boxType="square"
        value={rememberMe}
        onValueChange={newValue => {
          setRememberMe(newValue)
        }}
      />
      <Text style={styles.text}>Ingat saya</Text>
    </TouchableOpacity>
  )

  const ForgotPassword = () => (
    <TouchableOpacity onPress={goToForgotPassword} style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={styles.text}>Lupa kata sandi?</Text>
    </TouchableOpacity>
  )

  useEffect(() => {
    const errorCred = auth?.userCredential?.error as Error
    if (errorCred?.message) {
      showErrorToast(errorCred.message)
    }
  }, [auth?.userCredential?.error])

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Loader loading={loading} />
      <StatusBar animated={true} backgroundColor={theme.colors.backgroundDark} barStyle="light-content" />

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Image source={require('@assets/images/sag.png')} style={styles.arvisLogoImg} />
        </View>

        <Text type="regular" size={12} style={styles.helperColor}>
          Masukkan Email/NIP dan juga kata sandi Anda pada kolom di bawah ini
        </Text>

        {/* <TextInput
          useDarkTheme={true}
          control={control}
          name="baseURL"
          style={{fontSize: 12}}
          value={auth?.baseURL}
          defaultValue={auth?.baseURL}
          onChangeText={v => dispatch({type: 'SET_BASE_URL', payload: v})}
          placeholder="http://192.10.10:5051"
        /> */}

        <TextInput
          useDarkTheme={true}
          control={control}
          name="nipOrEmail"
          style={{fontSize: 12}}
          errorText={errors?.nipOrEmail?.message}
          placeholder="Email/NIP"
        />
        <TextInput
          useDarkTheme={true}
          control={control}
          name="password"
          style={{fontSize: 12}}
          errorText={errors?.password?.message}
          placeholder="Kata sandi"
          isPassword
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
          <RememberMe />
          <ForgotPassword />
        </View>

        <Button style={styles.signInButton} disabled={loading} onPress={handleSubmit(signIn)}>
          <Text type="semibold" style={styles.signInButtonText}>
            {loading ? 'Loading...' : 'Sign in'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default Login

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
})
