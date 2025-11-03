import React from 'react'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import Routes from '../../Routes'
import ProfilePage from '@app/presentations/screens/shared-screens/profile'
import Approver from '@app/presentations/screens/approver'
import WorkingArea from '@app/presentations/screens/working-area'
import ChangeProfile from '@app/presentations/screens/change-profile'
import ProfileChangePassword from '@app/presentations/screens/change-password'
import AddEmail from '@app/presentations/screens/add-email'

const Stack = createStackNavigator()

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.PROFILE_PAGE}
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name={Routes.PROFILE_PAGE} component={ProfilePage} />
      <Stack.Screen name={Routes.APPROVER} component={Approver} />
      <Stack.Screen name={Routes.WORKING_AREA} component={WorkingArea} />
      <Stack.Screen name={Routes.CHANGE_PROFILE} component={ChangeProfile} />
      <Stack.Screen name={Routes.CHANGE_PROFILE_PASSWORD} component={ProfileChangePassword} />
      <Stack.Screen name={Routes.ADD_CHANGE_EMAIL} component={AddEmail} />
    </Stack.Navigator>
  )
}

export default ProfileStack
