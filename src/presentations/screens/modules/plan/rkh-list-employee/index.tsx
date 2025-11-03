import {useUsers, useUsersByRole, useUsersCostByRoleId} from '@app/domain/states/user/hooks'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import {Header, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import React from 'react'
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native'
import RKHListEmployeeCard from './rkh-list-employee-card'

const RKHListEmployee = () => {
  const route: any = useRoute()

  const title = route?.params?.title || 'Daftar Karyawan'
  const roleId = route?.params?.roleId
  const typeEmployee = route?.params.typeEmployee

  const users = useUsersCostByRoleId(roleId)

  const constructUsers = () => {
    if (typeEmployee) {
      const usersByTypeEmployee = users.filter(user => user.typeEmployee.id == typeEmployee)
      return usersByTypeEmployee
    }
    return users
  }

  const calculateTotalCost = () => {
    if (Array.isArray(users)) {
      let cost = 0
      for (let i = 0; i < users.length; i++) {
        cost += users[i].costEmployee?.wages || 0
      }
      return `Rp.${numberWithDot(cost)}`
    }
    return 'Rp.0'
  }

  const calculateAverageCost = () => {
    if (Array.isArray(users)) {
      let cost = 0
      for (let i = 0; i < users.length; i++) {
        cost += users[i].costEmployee?.wages || 0
      }
      if (users.length == 0) {
        return `Rp.${numberWithDot(cost)}`
      }
      const avg = cost / users.length
      return `Rp.${numberWithDot(+avg.toFixed(0))}`
    }
    return 'Rp.0'
  }
  const renderItem = ({item, index}: any) => <RKHListEmployeeCard item={item} key={index} />

  return (
    <SafeAreaView style={styles.root}>
      <Header title={title} />
      <View style={styles.overViewContainer}>
        <View style={{flex: 1}}>
          <Text size={12}>Total Karyawan</Text>
          <Text type="semibold">{Array.isArray(users) ? users.length : '-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={12}>Total Biaya</Text>
          <Text type="semibold">{calculateTotalCost()}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={12}>Rata-rata Biaya</Text>
          <Text type="semibold">{calculateAverageCost()}</Text>
        </View>
      </View>
      <FlatList
        style={styles.list}
        data={constructUsers()}
        contentContainerStyle={{paddingBottom: 100}}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default RKHListEmployee

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    marginHorizontal: 16,
  },
  overViewContainer: {
    borderRadius: 10,
    margin: 16,
    padding: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
})
