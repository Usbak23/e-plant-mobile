import React, {useCallback, useEffect, useState} from 'react'
import {StyleSheet, FlatList, SafeAreaView, TouchableOpacity, View, RefreshControl} from 'react-native'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import Header from '@components/Header'
import ModalInfo from '@components/ModalInfo'
import Routes from '@app/presentations/navigation/Routes'
import Entypo from 'react-native-vector-icons/Entypo'
import Card from './rkh-card'
import ListFilter from '@components/ListFilter'
import {IRSRKH} from '@domain/states/rkh/reducer'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {SortOptions} from './sort-options'
import {Loader, SortPopup, Text} from '@components/index'
import {MenuOptions} from 'react-native-popup-menu'
import ModalAsk from '@components/ModalAsk'
import {IRKHRow} from '@models/eplant/RKH'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import {useRKHAll} from '@app/domain/states/rkh/hooks'
import {useRangeMonths} from '@app/domain/states/master/hooks'
import RKHSummary from './rkh-summary'
import RNFS from 'react-native-fs'
import moment from 'moment'
import {getToken} from '@app/domain/services/utils/Axios'
import {useIsAllowedToOrganizeRKH} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

export default function RKHList() {
  const isAllowedToOrganizeRKH = useIsAllowedToOrganizeRKH()

  const navigation: any = useNavigation()
  const route: any = useRoute()
  const filterParams = route?.params
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const organizationId = route.params?.organizationId
  const divisionId = route.params?.divisionId
  const year = route.params?.year
  const month = route.params?.month
  const months = useRangeMonths()
  const currMonth = months.find(e => e.value === month)

  const limit = 10
  const [query, setQuery] = useState({
    sort: 'numberRkh:asc',
    numberRkh: '',
    organization: organizationId,
    division: divisionId,
    month: month,
    year: year,
  })

  const withSort = (datas: any) => {
    if (!datas) {
      return []
    }
    if (query.sort == 'numberRkh:asc') {
      return datas.sort((a: any, b: any) => (a.numberRkh > b.numberRkh ? 1 : -1))
    } else if (query.sort == 'numberRkh:desc') {
      return datas.sort((a: any, b: any) => (a.numberRkh < b.numberRkh ? 1 : -1))
    }
    return datas
  }

  const [isDownloading, setDownloading] = useState(false)
  const [selected, setSelected] = useState<IRKHRow>()
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const title = `RKH - ${currMonth?.label} ${year}`
  const {deleteRKHStatus, formRKHStatus, rkhListTemp, rkhAll}: IRSRKH = useSelector(
    (state: RootStateType) => state?.rkh || {},
  )
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)
  const {loading}: IEffectPayload = rkhAll || {loading: false}

  const docs = useRKHAll(filterParams.organizationId, filterParams.divisionId, filterParams.year, filterParams.month)

  const withFilter = (d: any[] = [], option = '', sortBy = '') => {
    const filtered = d.filter(i => {
      const t = `RKH - ${moment(i?.dateRkh).format('DDMMYY')}` || ''
      return t.toLocaleLowerCase().includes(option.toString().toLowerCase())
    })
    return filtered
  }
  const filteredData = withSort(withFilter(docs, query.numberRkh))

  //this is used to get summary view (green and yellow).
  //only available if online
  const getRKHSummary = useCallback(() => {
    const payload = {
      division: divisionId,
      month,
      year,
    }
    dispatch(actions.getRKHSummary.request({loading: true, data: payload}))
  }, [])

  const getData = useCallback(() => {
    dispatch(actions.getRKHAll.request({loading: true}))
  }, [])

  const handleSearch = (numberRkh: string) => {
    setQuery({...query, numberRkh})
  }

  const handleDelete = () => {
    dispatch(actions.deleteRKH.request({loading: true, data: selected}))
    setSelected(undefined)
  }

  const handleSort = (sort: string) => {
    const newState = {...query, sort}
    setQuery(newState)
    // getData({...newState, page: 1, limit})
  }

  const sortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={SortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const onAdd = () => {
    navigation.navigate(Routes.RKH_FORM, {
      ...route.params,
    })
  }

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      const dirx = RNFS.DownloadDirectoryPath
      const token = await getToken()
      if (typeof token === 'string') {
        const date = new Date()
        const num = Math.floor(date.getTime() + date.getSeconds() / 2)
        const r = RNFS.downloadFile({
          fromUrl: System.instance.rkhService.exportRKHURL({year, month, division: divisionId || ''}),
          headers: {
            Authorization: token,
          },
          toFile: `${dirx}/${num}_${year}_${month}_rkh.xls`,
        })

        r.promise
          .then(() => {
            notifications
              .onDisplayNotificationExportFile(
                c.NOTIF_TITLE,
                'Daftar RKH berhasil diekspor',
                c.EXPORT_NOTIFICATION_ID,
                {
                  path: `${dirx}/${num}_${year}_${month}_rkh.xls`,
                },
              )
              .then(res => {})
              .catch(e => {})
            showSuccessToast('Berhasil diekspor. Periksa folder download anda')
          })
          .catch(() => {
            showErrorToast('Gagal saat mengekspor file excel. Periksa internet dan akses penyimpanan')
          })
      }
    } catch (error: any) {
      showErrorToast(error?.message || 'Gagal saat mengekspor file excel')
    } finally {
      setDownloading(false)
    }
  }

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus RKH?'}
      description={'Menghapus RKH akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor RKH?'}
      description={'Data RKH akan diekspor dalam format excel'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ListHeaderComponent = () => (
    <View style={{marginHorizontal: 22, marginBottom: 6}}>
      {isConnected ? <RKHSummary /> : null}
      <Text color={theme.colors.black} size={14} type="semibold">
        {title}
      </Text>
      {rkhListTemp && rkhListTemp?.length > 0 ? (
        <TouchableOpacity
          disabled={Boolean(formRKHStatus?.loading)}
          onPress={() => {
            if (!isConnected) {
              return showErrorToast('Anda dalam mode offline')
            }
            dispatch(actions.syncRKH())
          }}
          style={styles.syncButton}>
          <Text size={10} color="#00B098">
            Beberapa data tersimpan sebagai draft
          </Text>
          <Text size={10} color="#00B098" type="semibold">
            Unggah
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )

  useEffect(() => {
    const error = deleteRKHStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteRKHStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteRKHStatus?.data?.data
    if (data?.code == '200') {
      // refreshData()
      getData({})
      getRKHSummary()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteRKHStatus?.data])

  useEffect(() => {
    const error = formRKHStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formRKHStatus?.error])

  useEffect(() => {
    if (isFocused) {
      getData({})
      getRKHSummary()
    }
  }, [isFocused])

  useEffect(() => {
    const data = formRKHStatus?.data?.data
    if (data?.status == 'success') {
      getData({})
      getRKHSummary()
    }
  }, [formRKHStatus?.data])

  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} headerRight={isAllowedToOrganizeRKH ? () => <PlusButton onPress={onAdd} /> : undefined} />

      <ListFilter
        style={styles.filter}
        searchValue={query.numberRkh}
        onChangeSearch={handleSearch}
        onPressDownload={() => setModalExport(true)}
        sortOptions={sortOptions}
      />

      <FlatList
        data={filteredData}
        style={styles.list}
        keyExtractor={item => item.id}
        // initialNumToRender={limit}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          // getData({})
          // getRKHSummary()
        }}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(filteredData.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            refreshing={Boolean(loading)}
            onRefresh={() => {
              getData({})
              getRKHSummary()
            }}
          />
        }
        renderItem={props => (
          <Card {...props} isAllowedToOrganizeRKH={isAllowedToOrganizeRKH} onDelete={item => setSelected(item)} />
        )}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus RKH ini' : 'RKH berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
      <Loader loading={isDownloading} />
    </SafeAreaView>
  )
}

const PlusButton = ({onPress}: any) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Entypo name="plus" size={20} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {marginTop: 16},
  filter: {marginTop: 8},
  syncButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 176, 152, 0.2)',
    marginBottom: 6,
    marginTop: 16,
  },
})
