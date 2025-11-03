import {theme} from '@app/presentations/utils/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import React from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'

const WarehouseManagementDetailDescription = () => {
  const route: any = useRoute()
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Tujuan Permintaan" />
      <ScrollView contentContainerStyle={{paddingBottom: 75}} style={styles.scrollView}>
        <Text>{route?.params?.description || '-'}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default WarehouseManagementDetailDescription

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    padding: 16,
  },
})
