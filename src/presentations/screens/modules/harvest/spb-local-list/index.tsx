import React, {useCallback, useEffect, useState} from 'react'
import {Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Header, ListFilterAlt, Loader, Text} from '@app/presentations/_shared-components'
import {showErrorToast, showSuccessToast, showInfoToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useDispatch, useSelector} from 'react-redux'
import {actions} from '@app/domain/states/store'
// spb-local list hooks removed - using direct fetch
import {theme} from '@app/presentations/utils/styles'
import moment from 'moment'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EmptyList from '@app/presentations/_shared-components/Empty'
import IconBuilding from '@assets/icons/ic_small_building.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import System from '@app/domain/services/System'
import IconGroupWork from '@assets/icons/ic_group_work.svg'

const ICON_SIZE = 17 // v2

const SPBLocalList = () => {
  const navigation: any = useNavigation()
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const isFocused = useIsFocused()
  const {divisionId, date, organizationId, organizationName, divisionName} = route.params || {}

  const [page, setPage] = useState(1)
  const [allDocs, setAllDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const spbLocalListTemp = useSelector((s: any) => s.spbLocal?.spbLocalListTemp || [])
  const isConnected = useSelector((s: any) => s.network?.isConnected)

  const docs = allDocs
  const isLoading = loading

  const [search, setSearch] = useState('')

  const filteredDocs = docs.filter((item: any) => {
    const kendaraan = item.gardenTonnage?.item?.name || item.gardenTonnage?.item?.serialNumber || ''
    const blok = item.items?.map((i: any) => i.block?.code).join(' ') || ''
    const tph = item.items?.map((i: any) => i.tph?.name).join(' ') || ''
    const q = search.toLowerCase()
    return kendaraan.toLowerCase().includes(q) || blok.toLowerCase().includes(q) || tph.toLowerCase().includes(q)
  })

  const totalJJG = docs.reduce((sum: number, item: any) => {
    const itemTotal = item.items?.reduce((s: number, i: any) => s + (i.janjang || 0), 0) || 0
    return sum + itemTotal
  }, 0)

  const fetchData = useCallback((p = 1) => {
    setLoading(true)
    System.instance.spbLocalService.list({divisionId, date, page: p, limit: 20})
      .then((res: any) => {
        const responseData = res?.data?.response
        const newDocs = Array.isArray(responseData?.docs) ? responseData.docs : Array.isArray(responseData) ? responseData : []
        const tempItems = spbLocalListTemp.filter((t: any) => t.divisionId === divisionId && t.tempId)
        if (p === 1) setAllDocs([...tempItems, ...newDocs])
        else setAllDocs(prev => [...prev, ...newDocs])
      })
      .catch(() => {
        if (p === 1) {
          const tempItems = spbLocalListTemp.filter((t: any) => t.divisionId === divisionId && t.tempId)
          setAllDocs(tempItems)
        }
      })
      .finally(() => setLoading(false))
  }, [divisionId, date, spbLocalListTemp])

  useEffect(() => {
    if (isFocused) {
      fetchData(1)
      // Prefetch data for offline use saat online
      dispatch(actions.getDraftOptions.request({loading: true, data: {organizationId, date}}))
      dispatch(actions.monitoringTph.getMonitoringTphList.request({
        loading: true,
        data: {divisionId, month: moment(date).format('M'), year: moment(date).format('YYYY'), limit: 9999, page: 0},
      }))
    }
  }, [isFocused])
  
  // Detect saat syncing berubah
  useEffect(() => {
    const isSyncing = spbLocalListTemp.some((item: any) => item.syncStatus === 'syncing')
    setSyncing(isSyncing)
    
    // Jika ada yang syncing, refresh list setelah selesai
    if (!isSyncing && spbLocalListTemp.length === 0) {
      fetchData(1)
    }
  }, [spbLocalListTemp])
  
  const handleManualSync = () => {
    if (!isConnected) {
      showErrorToast('Tidak ada koneksi internet')
      return
    }
    
    const pendingItems = spbLocalListTemp.filter((item: any) => 
      item.syncStatus === 'pending' || item.syncStatus === 'failed'
    )
    
    if (pendingItems.length === 0) {
      showInfoToast('Tidak ada data yang perlu di-sync')
      return
    }
    
    showSuccessToast(`Memulai sinkronisasi ${pendingItems.length} data...`)
    dispatch(actions.spbLocal.syncSpbLocal())
  }

  const handleDelete = (id: string) => {
    Alert.alert('Hapus SPB Local', 'Apakah anda yakin ingin menghapus?', [
      {text: 'Batal', style: 'cancel'},
      {text: 'Hapus', style: 'destructive', onPress: () => {
        System.instance.spbLocalService.deleteSpbLocal(id)
          .then(() => { showSuccessToast('Berhasil dihapus'); fetchData(1) })
          .catch(() => showErrorToast('Gagal menghapus'))
      }},
    ])
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
              <Text style={styles.infoLabel} size={11}>Tanggal</Text>
              <Text color={theme.colors.textThinBlack} size={12}>{moment(date).format('D MMMM YYYY')}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.smallIconView}>
              <IconGroupWork width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={styles.leftSpacer}>
              <Text style={styles.infoLabel} size={11}>Total JJG</Text>
              <Text color={theme.colors.textThinBlack} size={12}>{totalJJG}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  const renderItem = ({item}: any) => {
    const kendaraan = item.gardenTonnage?.item?.name
      ? `${item.gardenTonnage.item.name}${item.gardenTonnage.item.serialNumber ? ` - ${item.gardenTonnage.item.serialNumber}` : ''}`
      : item.kendaraan || '-'
    const totalJJG = item.items?.reduce((s: number, i: any) => s + (i.janjang || 0), 0) || 0
    const tphCount = item.items?.length || 0
    const isTemp = Boolean(item.tempId)
    const syncStatus = item.syncStatus

    const getSyncBadge = () => {
      if (!isTemp) return null
      
      let bgColor = '#FFF3CD'
      let textColor = '#856404'
      let text = 'Menunggu Sync'
      let icon = 'clockcircleo'
      
      if (syncStatus === 'syncing') {
        bgColor = '#D1ECF1'
        textColor = '#0C5460'
        text = 'Syncing...'
        icon = 'sync'
      } else if (syncStatus === 'failed') {
        bgColor = '#F8D7DA'
        textColor = '#721C24'
        text = 'Gagal Sync'
        icon = 'closecircleo'
      }
      
      return (
        <View style={[styles.syncBadge, {backgroundColor: bgColor}]}>
          <AntDesign name={icon} size={10} color={textColor} />
          <Text size={10} color={textColor} style={{marginLeft: 4}}>{text}</Text>
        </View>
      )
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => !isTemp && navigation.navigate(Routes.SPB_LOCAL_DETAIL, {item, divisionId, date, organizationName, divisionName})}>
        <View style={styles.cardHeader}>
          <Text size={13} color={theme.colors.accent} type="semibold">{kendaraan}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {getSyncBadge()}
            {!isTemp && item.gardenTonnage?.status !== 'submitted' && <>
              <TouchableOpacity onPress={() => navigation.navigate(Routes.SPB_LOCAL_FORM, {divisionId, date, organizationId, organizationName, divisionName, editItem: item})} style={styles.deleteBtn}>
                <AntDesign name="edit" size={18} color={theme.colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <AntDesign name="delete" size={18} color={theme.colors.danger || 'red'} />
              </TouchableOpacity>
            </>
            }
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>Jumlah TPH</Text>
            <Text color={theme.colors.textThinBlack} size={12}>{tphCount} TPH</Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>Total JJG</Text>
            <Text color={theme.colors.textThinBlack} size={12}>{totalJJG}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const onEndReached = () => {
    if (!isLoading && Array.isArray(docs) && docs.length >= page * 20) {
      setPage(p => p + 1)
      fetchData(page + 1)
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="SPB Local" />
      {spbLocalListTemp.length > 0 && (
        <View style={styles.syncBanner}>
          <View style={{flex: 1}}>
            <Text size={12} color='#856404'>
              {spbLocalListTemp.length} data menunggu sinkronisasi
            </Text>
          </View>
          {isConnected && (
            <TouchableOpacity 
              onPress={handleManualSync}
              disabled={syncing}
              style={styles.syncButton}>
              <Icon name={syncing ? 'sync' : 'cloud-upload'} size={16} color="#856404" />
              <Text size={11} color='#856404' style={{marginLeft: 4}}>
                {syncing ? 'Syncing...' : 'Sync Sekarang'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <ListFilterAlt
        searchValue={search}
        onChangeSearch={(v: string) => setSearch(v)}
      />
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={filteredDocs}
          keyExtractor={(item, i) => item.id || String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={!!isLoading} onRefresh={() => {setPage(1); fetchData(1)}} />
          }
          ListEmptyComponent={isLoading ? null : EmptyList}
        />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(Routes.SPB_LOCAL_FORM, {divisionId, date, organizationId, organizationName, divisionName})}>
        <Icon name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default SPBLocalList

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
  list: {paddingBottom: 80},
  card: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 18,
    marginVertical: 7.5,
    backgroundColor: theme.colors.pureWhite,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteBtn: {padding: 4},
  syncBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  syncBanner: {
    backgroundColor: '#FFF3CD',
    padding: 8,
    marginHorizontal: 18,
    borderRadius: 8,
    marginBottom: 4,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#856404',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})
