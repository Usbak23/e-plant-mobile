import React, {useCallback, useEffect, useRef, useState} from 'react'
import {ActivityIndicator, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Header, ListFilterAlt, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import {theme} from '@app/presentations/utils/styles'
import {useDispatch, useSelector} from 'react-redux'
import {actions} from '@app/domain/states/store'
import {useNetInfo} from '@react-native-community/netinfo'
import moment from 'moment'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {useMonitoringTphList, useMonitoringTphSummary} from '@app/domain/states/monitoring-tph/hooks'
import IconBuilding from '@assets/icons/ic_small_building.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconGroupWork from '@assets/icons/ic_group_work.svg'

import MonitoringTphCard from './monitoring-tph-card'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const ICON_SIZE = 17

const STATUS_TABS = [
  {key: 'all', label: 'Semua'},
  {key: '0', label: 'Hari Ini'},
  {key: '1', label: '1 Hari'},
  {key: '2', label: '2 Hari'},
  {key: '3', label: '3+ Hari'},
]

const getDiffDays = (dateStr: string): number => {
  const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  return diff < 0 ? 0 : diff
}

const PAGE_LIMIT = 10

const MonitoringTphList = () => {
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const {divisionId, month, year, divisionName, organizationName} = route.params || {}

  const lastUpdated = useSelector((s: any) => s.monitoringTph?.lastUpdated)
  const netInfo = useNetInfo()
  const isOffline = netInfo.isConnected === false

  const summaryState = useMonitoringTphSummary()
  const listState = useMonitoringTphList()

  const totalJanjang = summaryState?.loading === false ? (summaryState?.data?.totalJanjang ?? summaryState?.data?.sisaJanjang ?? 0) : 0
  const loading = listState?.loading || false

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [accumulatedData, setAccumulatedData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const isLoadingMore = useRef(false)

  const filteredData = accumulatedData.filter((item: any) => {
    const matchSearch =
      (item?.tphName || item?.tphCode || '').toLowerCase().includes(search.toLowerCase()) ||
      (item?.blockCode || '').toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (statusFilter === 'all') return true
    const diff = getDiffDays(item.date)
    if (statusFilter === '3') return diff >= 3
    return diff === parseInt(statusFilter, 10)
  })

  const fetchPage = useCallback((page: number) => {
    dispatch(actions.monitoringTph.getMonitoringTphList.request({
      loading: true,
      data: {divisionId, month, year, page, limit: PAGE_LIMIT},
    }))
  }, [divisionId, month, year])

  const getData = useCallback(() => {
    setAccumulatedData([])
    setCurrentPage(0)
    setHasMore(true)
    isLoadingMore.current = false
    dispatch(actions.monitoringTph.getMonitoringTphSummary.request({
      loading: true,
      data: {divisionId, month, year},
    }))
    fetchPage(0)
  }, [divisionId, month, year, fetchPage])

  // Append new page data when listState updates
  useEffect(() => {
    if (listState?.loading === false && listState?.data?.docs) {
      const {docs, totalPages, page} = listState.data
      setAccumulatedData(prev => page === 0 ? docs : [...prev, ...docs])
      setHasMore(page < totalPages - 1)
      isLoadingMore.current = false
    }
  }, [listState])

  useEffect(() => {
    getData()
  }, [])

  const loadMore = useCallback(() => {
    if (loading || !hasMore || isLoadingMore.current) return
    isLoadingMore.current = true
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchPage(nextPage)
  }, [loading, hasMore, currentPage, fetchPage])

  const renderItem = ({item}: any) => <MonitoringTphCard item={item} />

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Monitoring TPH" />
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text size={12} color='#856404'>Anda sedang offline. Menampilkan data terakhir.</Text>
        </View>
      )}
      {!isOffline && lastUpdated && (
        <View style={styles.lastUpdatedBar}>
          <Text size={11} color={theme.colors.label}>
            Diperbarui: {moment(lastUpdated).format('D MMM YYYY, HH:mm')}
          </Text>
        </View>
      )}
      <View style={styles.fixedHeader}>
        <ListFilterAlt
          searchValue={search}
          onChangeSearch={(v: string) => setSearch(v)}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
          {STATUS_TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, statusFilter === tab.key && styles.tabActive]}
              onPress={() => setStatusFilter(tab.key)}>
              <Text size={12} color={statusFilter === tab.key ? 'white' : theme.colors.label}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.headerInfo}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.smallIconView}><IconBuilding width={ICON_SIZE} height={ICON_SIZE} /></View>
              <View style={styles.leftSpacer}>
                <Text style={styles.infoLabel} size={11}>Organisasi</Text>
                <Text color={theme.colors.textThinBlack} size={12}>{organizationName || '-'}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.smallIconView}><IconBuilding width={ICON_SIZE} height={ICON_SIZE} /></View>
              <View style={styles.leftSpacer}>
                <Text style={styles.infoLabel} size={11}>Divisi</Text>
                <Text color={theme.colors.textThinBlack} size={12}>{divisionName || '-'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.smallIconView}><IconCalendar width={ICON_SIZE} height={ICON_SIZE} /></View>
              <View style={styles.leftSpacer}>
                <Text style={styles.infoLabel} size={11}>Bulan/Tahun</Text>
                <Text color={theme.colors.textThinBlack} size={12}>{MONTHS[parseInt(month, 10) - 1]} {year}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.smallIconView}><IconGroupWork width={ICON_SIZE} height={ICON_SIZE} /></View>
              <View style={styles.leftSpacer}>
                <Text style={styles.infoLabel} size={11}>Total Janjang</Text>
                <Text color={theme.colors.textThinBlack} size={12}>{totalJanjang}</Text>
              </View>
            </View>
          </View>
        </View>
        </View>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{paddingBottom: 24}}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl colors={[theme.colors.primary]} refreshing={loading && accumulatedData.length === 0} onRefresh={getData} />
        }
        ListFooterComponent={loading && accumulatedData.length > 0 ? <ActivityIndicator style={{marginVertical: 16}} color={theme.colors.primary} /> : null}
        ListEmptyComponent={loading ? null : <EmptyList />}
      />
    </SafeAreaView>
  )
}

export default MonitoringTphList

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  fixedHeader: {backgroundColor: 'white'},
  headerInfo: {marginTop: 8, marginBottom: 12},
  infoContainer: {
    marginHorizontal: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  infoRow: {marginVertical: 6, flexDirection: 'row'},
  infoItem: {flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8},
  infoLabel: {color: '#9C9C9C'},
  leftSpacer: {marginStart: 8, flex: 1},
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
  tabsContainer: {marginTop: 8, marginBottom: 8},
  tabsContent: {paddingHorizontal: 18, alignItems: 'center'},
  tab: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: theme.colors.accent,
  },
  offlineBanner: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 0,
  },
  lastUpdatedBar: {
    paddingHorizontal: 22,
    paddingBottom: 2,
  },
})
