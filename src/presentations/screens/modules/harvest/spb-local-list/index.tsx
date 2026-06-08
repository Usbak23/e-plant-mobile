import React, {useCallback, useEffect, useState} from 'react'
import {Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Header, Loader, Text} from '@app/presentations/_shared-components'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useDispatch} from 'react-redux'
import {actions} from '@app/domain/states/store'
import {useSpbLocalList, useSpbLocalDeleteStatus} from '@app/domain/states/spb-local/hooks'
import {theme} from '@app/presentations/utils/styles'
import moment from 'moment'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialIcons'

const SPBLocalList = () => {
  const navigation: any = useNavigation()
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const isFocused = useIsFocused()
  const {divisionId, date, organizationName, divisionName} = route.params || {}

  const spbLocalList = useSpbLocalList()
  const deleteStatus = useSpbLocalDeleteStatus()
  const [page, setPage] = useState(1)

  const docs = spbLocalList?.data?.docs || spbLocalList?.data || []
  const isLoading = spbLocalList?.loading

  const totalJJG = Array.isArray(docs) ? docs.reduce((sum: number, item: any) => sum + (item.totalJanjang || 0), 0) : 0

  const fetchData = useCallback((p = 1) => {
    dispatch(actions.spbLocal.getSpbLocalList.request({loading: true, data: {divisionId, date, page: p, limit: 20}}))
  }, [divisionId, date])

  useEffect(() => {
    if (isFocused) fetchData(1)
  }, [isFocused])

  useEffect(() => {
    if (deleteStatus?.data) {
      showSuccessToast('Berhasil dihapus')
      dispatch(actions.spbLocal.clearSpbLocalDelete())
      fetchData(1)
    }
    if (deleteStatus?.error) {
      showErrorToast('Gagal menghapus')
      dispatch(actions.spbLocal.clearSpbLocalDelete())
    }
  }, [deleteStatus])

  const handleDelete = (id: string) => {
    Alert.alert('Hapus SPB Local', 'Apakah anda yakin ingin menghapus?', [
      {text: 'Batal', style: 'cancel'},
      {text: 'Hapus', style: 'destructive', onPress: () => dispatch(actions.spbLocal.deleteSpbLocal.request({loading: true, data: id}))},
    ])
  }

  const renderItem = ({item}: any) => (
    <View style={styles.card}>
      <View style={{flex: 1}}>
        <Text type="semibold" size={14}>{item.kendaraan || item.gardenTonnage?.item?.name || '-'}</Text>
        <Text size={12} color={theme.colors.grey}>Blok: {item.block?.name || item.blockName || '-'}</Text>
        <Text size={12} color={theme.colors.grey}>TPH: {item.tph?.name || item.tphName || '-'}</Text>
        <Text size={12} color={theme.colors.grey}>Janjang: {item.totalJanjang || item.janjang || 0}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <AntDesign name="delete" size={18} color={theme.colors.danger || 'red'} />
      </TouchableOpacity>
    </View>
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
      <View style={styles.infoHeader}>
        <Text size={12}>Organisasi: <Text type="semibold" size={12}>{organizationName}</Text></Text>
        <Text size={12}>Divisi: <Text type="semibold" size={12}>{divisionName}</Text></Text>
        <Text size={12}>Tanggal: <Text type="semibold" size={12}>{moment(date).format('D MMMM YYYY')}</Text></Text>
        <Text size={12}>Total JJG: <Text type="semibold" size={12}>{totalJJG}</Text></Text>
      </View>
      {isLoading && page === 1 ? (
        <Loader />
      ) : (
        <FlatList
          data={Array.isArray(docs) ? docs : []}
          keyExtractor={(item, i) => item.id || String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => {setPage(1); fetchData(1)}} />}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 40}}>Belum ada data SPB Local</Text>}
        />
      )}
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
  infoHeader: {paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f5f5f5', gap: 4},
  list: {padding: 16, paddingBottom: 80},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  deleteBtn: {padding: 8},
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
