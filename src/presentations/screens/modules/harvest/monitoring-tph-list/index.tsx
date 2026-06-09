import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native'
import {Header, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import {theme} from '@app/presentations/utils/styles'
import {useDispatch} from 'react-redux'
import {actions} from '@app/domain/states/store'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {useMonitoringTphList, useMonitoringTphSummary} from '@app/domain/states/monitoring-tph/hooks'
import IconBuilding from '@assets/icons/ic_small_building.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconGroupWork from '@assets/icons/ic_group_work.svg'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const ICON_SIZE = 17

const getDateColor = (dateStr: string): string | undefined => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return undefined
  if (diffDays === 1) return '#E3F2FD'
  if (diffDays === 2) return '#FFF9C4'
  if (diffDays === 3) return '#FFCDD2'
  return '#EEEEEE'
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

const MonitoringTphList = () => {
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const {divisionId, month, year, divisionName, organizationName} = route.params || {}

  const listState = useMonitoringTphList()
  const summaryState = useMonitoringTphSummary()

  const [page, setPage] = useState(1)
  const [allData, setAllData] = useState<any[]>([])

  const docs = listState?.data?.docs || listState?.data?.data || []
  const totalJanjang = summaryState?.data?.totalJanjang || summaryState?.data?.data?.totalJanjang || 0
  const hasMore = docs.length >= 20

  const fetchData = useCallback((p: number, reset = false) => {
    dispatch(actions.monitoringTph.getMonitoringTphList.request({
      loading: true,
      data: {divisionId, month, year, page: p, limit: 20},
    }))
    if (p === 1) {
      dispatch(actions.monitoringTph.getMonitoringTphSummary.request({
        loading: true,
        data: {divisionId, month, year},
      }))
    }
  }, [divisionId, month, year])

  useEffect(() => {
    fetchData(1)
  }, [])

  useEffect(() => {
    if (!listState?.loading && docs.length > 0) {
      if (page === 1) {
        setAllData(docs)
      } else {
        setAllData(prev => [...prev, ...docs])
      }
    } else if (!listState?.loading && page === 1) {
      setAllData(docs)
    }
  }, [listState?.data])

  const handleRefresh = () => {
    setPage(1)
    fetchData(1, true)
  }

  const handleLoadMore = () => {
    if (!listState?.loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchData(nextPage)
    }
  }

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

  const renderItem = ({item}: any) => {
    const bgColor = getDateColor(item.date || item.tanggal)
    return (
      <View style={[styles.card, bgColor ? {backgroundColor: bgColor} : {}]}>
        <View style={styles.cardRow}>
          <View style={styles.cardLeft}>
            <Text type="semibold" size={13} color={theme.colors.textThinBlack}>
              {formatDate(item.date || item.tanggal || '')}
            </Text>
            <Text size={12} color="#666" style={{marginTop: 4}}>
              Blok: {item.blockName || item.blok || '-'}
            </Text>
            <Text size={12} color="#666" style={{marginTop: 2}}>
              TPH: {item.tphName || item.tph || '-'}
            </Text>
            <Text size={12} color="#666" style={{marginTop: 2}}>
              Sisa Janjang: {item.sisaJanjang ?? item.remainingBunch ?? 0}
            </Text>
          </View>
          <View style={styles.cardRight}>
            {item.fotoTph || item.photo ? (
              <Image source={{uri: item.fotoTph || item.photo}} style={styles.thumbnail} />
            ) : (
              <View style={styles.placeholder}>
                <Text size={10} color="#999">No Photo</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Monitoring TPH" />
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={allData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        refreshControl={
          <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(listState?.loading && page === 1)} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={listState?.loading ? null : EmptyList}
        contentContainerStyle={allData.length === 0 && !listState?.loading ? {flex: 1} : undefined}
      />
    </SafeAreaView>
  )
}

export default MonitoringTphList

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  headerInfo: {marginHorizontal: 18, marginTop: 16, marginBottom: 6},
  infoContainer: {
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
  card: {
    marginHorizontal: 18,
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardRow: {flexDirection: 'row', justifyContent: 'space-between'},
  cardLeft: {flex: 1},
  cardRight: {marginLeft: 12, justifyContent: 'center'},
  thumbnail: {width: 56, height: 56, borderRadius: 6},
  placeholder: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
