import {Header} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/core'
import React from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import RKHHarvestDetailInfo from './rkh-harvest-detail-info'

const RKHHarvestDetail = () => {
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const rkh = route.params?.rkh

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail" />

      <ScrollView>
        <RKHHarvestDetailInfo item={item} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default RKHHarvestDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {},
})
