import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native'
import {Header, ListFilterAlt, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import {theme} from '@app/presentations/utils/styles'
import {useDispatch} from 'react-redux'
import {actions} from '@app/domain/states/store'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {useMonitoringTphList, useMonitoringTphSummary} from '@app/domain/states/monitoring-tph/hooks'
import IconBuilding from '@assets/icons/ic_small_building.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconGroupWork from '@assets/icons/ic_group_work.svg'

import MonitoringTphCard from './monitoring-tph-card'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const ICON_SIZE = 17

const MonitoringTphList = () => {
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const {divisionId, month, year, divisionName, organizationName} = route.params || {}

  const summaryState = useMonitoringTphSummary()
  const listState = useMonitoringTphList()

  const totalJanjang = summaryState?.loading === false ? (summaryState?.data?.totalJanjang ?? summaryState?.data?.sisaJanjang ?? 0) : 0
  const allData: any[] = Array.isArray(listState?.data?.docs) ? listState.data.docs : Array.isArray(listState?.data) ? listState.data : []
  const loading = listState?.loading || false

  const [query, setQuery] = useState({ search: '' })

  const filteredData = allData.filter((item: any) =>
    (item?.tphName || item?.tphCode || '').toLowerCase().includes(query.search.toLowerCase()) ||
    (item?.blockCode || '').toLowerCase().includes(query.search.toLowerCase())
  )

  const getData = useCallback(() => {
    dispatch(actions.monitoringTph.getMonitoringTphSummary.request({
      loading: true,
      data: {divisionId, month, year},
    }))
    dispatch(actions.monitoringTph.getMonitoringTphList.request({
      loading: true,
      data: {divisionId, month, year},
    }))
  }, [divisionId, month, year])

  useEffect(() => {
    getData()
  }, [])

  const ListHeaderComponent = () => (
    <View style={styles.headerInfo}>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <View style={styles.smallIconView}>
              <IconBuilding width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={styles.leftSpacer}>
              <Text style={styles.infoLabel} size={11}>Organisasi</Text>
              <Text color={theme.colors.textThinBlack} size={12}>{organizationName || '-'}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.smallIconView}>
              <IconBuilding width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={styles.leftSpacer}>
              <Text style={styles.infoLabel} size={11}>Divisi</Text>
              <Text color={theme.colors.textThinBlack} size={12}>{divisionName || '-'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <View style={styles.smallIconView}>
              <IconCalendar width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={styles.leftSpacer}>
              <Text style={styles.infoLabel} size={11}>Bulan/Tahun</Text>
              <Text color={theme.colors.textThinBlack} size={12}>{MONTHS[parseInt(month, 10) - 1]} {year}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.smallIconView}>
              <IconGroupWork width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={styles.leftSpacer}>
              <Text style={styles.infoLabel} size={11}>Total Janjang</Text>
              <Text color={theme.colors.textThinBlack} size={12}>{totalJanjang}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  const renderItem = ({item}: any) => <MonitoringTphCard item={item} />

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Monitoring TPH" />
      <ListFilterAlt
        searchValue={query.search}
        onChangeSearch={(search: string) => setQuery({search})}
      />
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        refreshControl={
          <RefreshControl colors={[theme.colors.primary]} refreshing={loading && !allData.length} onRefresh={getData} />
        }
        ListEmptyComponent={loading ? null : EmptyList}
      />
    </SafeAreaView>
  )
}

export default MonitoringTphList

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  headerInfo: {marginTop: 16, marginBottom: 6},
  infoContainer: {
    marginHorizontal: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  infoRow: {marginVertical: 8, flexDirection: 'row'},
  infoItem: {flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8},
  infoLabel: {color: '#9C9C9C'},
  leftSpacer: {marginStart: 8, flex: 1},
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
})
