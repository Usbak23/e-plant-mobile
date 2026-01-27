import React from 'react'
import {Platform} from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {theme} from '@styles'
import Routes from '@navigation/Routes'

import HomeStack from '@navigation/bottom-tabs/home-stack'
import ProfileStack from './profile-stack'
import DashboardStack from './dashboard-stack'
import NotificationProvider from '@app/presentations/_shared-components/NotificationProvider'

interface TabProps {}
const Tab = createBottomTabNavigator()

const BottomTabs: React.FC<TabProps> = ({}) => {
  const {
    colors: {orange, textThinBlack, tabIconBlack},
  } = theme
  return (
    <NotificationProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: orange,
          tabBarInactiveTintColor: textThinBlack,
          tabBarStyle: {
            paddingTop: Platform.OS === 'ios' ? 8 : 4,
            paddingBottom: 4,
          },
          tabBarLabelStyle: {
            fontSize: 9,
            paddingHorizontal: 5,
          },
        }}
        initialRouteName={Routes.HOME_STACK}>

        <Tab.Screen
          name={Routes.HOME_STACK}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({focused}) => {
              return <Icon name={'home'} size={22} color={focused ? orange : tabIconBlack} />
            },
          }}
          component={HomeStack}
        />
        <Tab.Screen
          name={Routes.DASHBOARD_STACK}
          options={{
            headerShown: false,
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({focused}) => {
              return <Icon name={'dashboard'} size={22} color={focused ? orange : tabIconBlack} />
            },
          }}
          component={DashboardStack}
        />
        <Tab.Screen
          name={Routes.PROFILE_STACK}
          options={{
            headerShown: false,
            tabBarLabel: 'Profil',
            tabBarIcon: ({focused}) => {
              return <Icon name={'person'} size={22} color={focused ? orange : tabIconBlack} />
            },
          }}
          component={ProfileStack}
        />
      </Tab.Navigator>
    </NotificationProvider>
  )
}

export default BottomTabs
