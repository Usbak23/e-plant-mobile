import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {useSelector} from 'react-redux'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import Routes from '@navigation/Routes'
import RegisterScreen from '@screens/shared-screens/auth/register'
// import SplashScreen from '@screens/shared-screens/auth/splash'
import LoginScreen from '@screens/shared-screens/auth/login'
import BottomTabs from '@navigation/bottom-tabs'
import {RootStateType} from '@domain/states/store'
// import useSyncData from './hooks/useSyncData'
// import useHeadlessTask from './hooks/useHeadlessTask'
import ForgotPassword from '@screens/shared-screens/auth/forgot-password'
import ResetPassword from '@screens/shared-screens/auth/reset-password'
// your entry point
import MapsPreview from './screens/preview-maps'
import {authNavigationRef} from '@navigation/services/auth'

import { useNotifications } from './hooks/useNotifications'
// import {useNavigateDeeplink} from './utils/deeplink/useNavigateDeeplink'
// import {Linking} from 'react-native'
import {appNavigationRef} from './navigation/services/app'
// import {Text} from './_shared-components'

const MainStack = () => {
  const Stack = createStackNavigator()
  useNotifications()
  
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
      initialRouteName={Routes.HOME_PAGE}>
      <Stack.Screen name={Routes.HOME_PAGE} component={BottomTabs} />
      <Stack.Screen name={Routes.MAPS_PREVIEW} component={MapsPreview} />
    </Stack.Navigator>
  )
}

export default function App() {
  // const [splash, setSplash] = useState(true)
  const Stack = createStackNavigator()

  const userState = useSelector((state: RootStateType) => state.user)
  const user = userState.userCredential?.data
  // useSyncData()
  // useHeadlessTask()
  // useNavigateDeeplink()

  // useEffect(() => {
  //   if (splash) {
  //     setTimeout(() => {
  //       setSplash(false)
  //     }, 1000)
  //   }
  // }, [splash])

  // if (splash) {
  //   return (
  //     <NavigationContainer>
  //       <Stack.Navigator initialRouteName={'/app/splash'} screenOptions={{headerShown: false}}>
  //         <Stack.Screen name={'/app/splash'} component={SplashScreen} />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   )
  // }

  if (!user) {
    return (
      <NavigationContainer ref={authNavigationRef}>
        <Stack.Navigator
          screenOptions={{...TransitionPresets.ScaleFromCenterAndroid, headerShown: false}}
          initialRouteName={Routes.LOGIN}>
          <Stack.Screen name={Routes.LOGIN} component={LoginScreen} />
          <Stack.Screen name={Routes.FORGOT_PASSWORD} component={ForgotPassword} />
          <Stack.Screen name={Routes.REGISTRATION} component={RegisterScreen} />
          <Stack.Screen name={Routes.RESET_PASSWORD} component={ResetPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer ref={appNavigationRef}>
      <MainStack />
    </NavigationContainer>
  )
}
