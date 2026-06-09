import React, {useCallback, useEffect, useState} from 'react'
import {Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Header, ListFilterAlt, Loader, Text} from '@app/presentations/_shared-components'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useDispatch} from 'react-redux'
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
  const {divisionId, date, organizationName, divisionName} = route.params || {}

  const [page, setPage] = useState(1)
  const [allDocs, setAllDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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
        if (p === 1) setAllDocs(newDocs)
        else setAllDocs(prev => [...prev, ...newDocs])
      })
      .catch(() => { if (p === 1) setAllDocs([]) })
      .finally(() => setLoading(false))
  }, [divisionId, date])

  useEffect(() => {
    if (isFocused) fetchData(1)
  }, [isFocused])

  const handleDelete = (id: string) => {
    Alert.alert('Hapus SPB Local', 'Apakah anda yakin ingin menghapus?', [
      {text: 'Batal', style: 'cancel'},
      {text: 'Hapus', style: 'destructive', onPress: () => {
        System.instance.spbLocalService.delete(id)
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

  const renderItem = ({item}: any) => (
    <TouchableOpacity style={styles.card} onPress={() => {}}>
      <View style={styles.cardHeader}>
        <Text size={13} color={theme.colors.accent} type="semibold">
          {item.items?.map((i: any) => i.tph?.name).filter(Boolean).join(', ') || '-'}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate(Routes.SPB_LOCAL_FORM, {divisionId, date, organizationName, divisionName, editItem: item})} style={styles.deleteBtn}>
            <AntDesign name="edit" size={18} color={theme.colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
            <AntDesign name="delete" size={18} color={theme.colors.danger || 'red'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 8}}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>Blok</Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item.items?.map((i: any) => i.block?.code).filter(Boolean).join(', ') || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>Kendaraan</Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item.gardenTonnage?.item?.name || item.kendaraan || '-'}
            {item.gardenTonnage?.item?.serialNumber ? ` - ${item.gardenTonnage.item.serialNumber}` : ''}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 8}}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>Total JJG</Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item.items?.reduce((s: number, i: any) => s + (i.janjang || 0), 0) || 0}
          </Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    </TouchableOpacity>
  )

  const onEndReached = () => {
    if (!isLoading && Array.isArray(docs) && docs.length >= page * 20) {
      setPage(p => p + 1)
      fetchData(page + 1)
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="SPB Local" />
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
        onPress={() => navigation.navigate(Routes.SPB_LOCAL_FORM, {divisionId, date, organizationName, divisionName})}>
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
