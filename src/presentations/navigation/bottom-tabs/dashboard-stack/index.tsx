import React from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import Routes from '@navigation/Routes'
import Dashboard from '@app/presentations/screens/shared-screens/dashboard'
import AKPPlanTableReport from '@app/presentations/screens/modules/report/akp-plan'
import AKPRealizationTableReport from '@app/presentations/screens/modules/report/akp-realization'
import BJRBlockReport from '@app/presentations/screens/modules/report/bjr'
import DashboardProductionOrganization from '@app/presentations/screens/shared-screens/dashboard-production-organization'

const Stack = createStackNavigator()

const DashboardStack = ({ }) => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.DASHBOARD}
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name={Routes.DASHBOARD} component={Dashboard} />
      <Stack.Screen name={Routes.DASHBOARD_PRODUCTION_ORGANIZATION} component={DashboardProductionOrganization} />
      <Stack.Screen name={Routes.REPORT_AKP_PLAN_D} component={AKPPlanTableReport} />
      <Stack.Screen name={Routes.REPORT_AKP_REALIZATION_D} component={AKPRealizationTableReport} />
      <Stack.Screen name={Routes.REPORT_BJB_PER_BLOK_D} component={BJRBlockReport} />
      {/* <Stack.Screen name={Routes.REPORT_EMPLOYEE_WAGE_D} component={EmployeeWageReport}/> */}
    </Stack.Navigator>

  )
}

export default DashboardStack
