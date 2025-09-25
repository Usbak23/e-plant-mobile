import React, {useCallback, useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import ModalInfo from '@components/ModalInfo'
import Routes from '@app/presentations/navigation/Routes'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {Loader, Text} from '@components/index'
import ModalAsk from '@components/ModalAsk'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import RKHSummary from '@screens/modules/plan/rkh-list/rkh-summary'
import {IRSRKHHarvest} from '@app/domain/states/rkh-harvest/reducer'
import RKHHarvestCard from './rkh-harvest-card'
import {styles} from './styles'
import {IRKHHarvestAllRowData} from '@app/models/eplant/RKHHarvest'
import {useRKHHarvestAll} from '@app/domain/states/rkh-harvest/hooks'
import {filterData} from '@app/presentations/utils/filterData'
import {getToken} from '@app/domain/services/utils/Axios'
import moment from 'moment'
import RNFS from 'react-native-fs'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

const getRKHDate = (rkh: string) => {
  const date = rkh.slice(-6)
  return date
}

interface Props {
  searchValue: string
  sortValue: string
}

const RKHHarvestList = forwardRef((props: Props, ref) => {
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const item = route.params?.item
  const divisionId = route.params?.divisionId

  const withSort = (datas: IRKHHarvestAllRowData[]) => {
    if (!datas) {
      return []
    }
    if (props.sortValue == 'code:asc') {
      return datas.sort((a: IRKHHarvestAllRowData, b: IRKHHarvestAllRowData) =>
        a?.akp?.block?.code > b?.akp?.block?.code ? 1 : -1,
      )
    } else if (props.sortValue == 'code:desc') {
      return datas.sort((a: IRKHHarvestAllRowData, b: IRKHHarvestAllRowData) =>
        a?.akp?.block?.code < b?.akp?.block?.code ? 1 : -1,
      )
    }
    return datas
  }

  const [isDownloading, setDownloading] = useState(false)
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {rkhHarvestAll}: IRSRKHHarvest = useSelector((state: RootStateType) => state?.rkhHarvest || {})

  const {loading}: IEffectPayload = rkhHarvestAll || {loading: false}

  const doFilter = (datas: any[], query: string) => {
    if (query != '') {
      return datas?.filter(row => {
        const name = row?.akp?.block?.harvestForeman?.name || ''
        const nip = row?.akp?.block?.harvestForeman?.name || ''
        const role = row?.akp?.block?.harvestForeman?.role?.name || ''
        const blockCode = row?.akp?.block?.code || ''
        const q = query.toLowerCase()

        return (
          name.toLowerCase().includes(q) ||
          nip.toLowerCase().includes(q) ||
          role.toLowerCase().includes(q) ||
          blockCode.toLowerCase().includes(q)
        )
      })
    }
    return datas
  }

  const docs = useRKHHarvestAll(divisionId, getRKHDate(item?.numberRkh || ''))
  const filteredData = withSort(doFilter(docs, props.searchValue))

  const getData = useCallback(data => {
    dispatch(actions.getRKHHarvestAll.request({loading: true}))
  }, [])

  const onAdd = () => {
    navigation.navigate(Routes.RKH_TAKE_CARE_FORM, {
      ...route.params,
    })
  }

  const constructNaming = () => {
    const title = `RKH - ${moment(route.params?.dateRkh).format('D MMMM YYYY')}`
    const org = route.params?.item?.division?.organization?.name || ''
    const div = route.params?.item?.division?.name || ''
    return `${title} - ${org} - ${div}`
  }

  const goToDetailRKH = (i: IRKHHarvestAllRowData) => {
    navigation.navigate(Routes.RKH_HARVEST_DETAIL, {item: i, rkh: route.params?.item, isEdit: true})
  }

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ])
      }
      const dirx = RNFS.DownloadDirectoryPath
      const token = await getToken()
      if (typeof token === 'string') {
        const date = new Date()
        const num = Math.floor(date.getTime() + date.getSeconds() / 2)
        const r = RNFS.downloadFile({
          fromUrl: System.instance.rkhHarvestService.exportRKHHarvestURL(route.params?.item?.id || ''),
          headers: {
            Authorization: token,
          },
          toFile: `${dirx}/${num}_rkh_rawat_panen.xls`,
        })

        r.promise
          .then(result => {
            notifications
              .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'RKH berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
                path: `${dirx}/${num}_rkh_rawat_panen.xls`,
              })
              .then(res => {})
              .catch(e => {})
            showSuccessToast('RKH behasil diekspor')
          })
          .catch(e => {
            showErrorToast('Gagal saat mengekspor file excel. Periksa internet dan akses penyimpanan')
          })
      }
    } catch (error) {
      console.log(error)
      showErrorToast('Gagal saat mengekspor excel file. Periksa internet dan akses penyimpanan.')
    } finally {
      setDownloading(false)
    }
  }

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor RKH Panen?'}
      description={'Data RKH akan diekspor dalam format excel'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ListHeaderComponent = () => (
    <View style={{marginHorizontal: 22, marginBottom: 6}}>
      {isConnected ? <RKHSummary /> : null}

      <Text type="semibold">{constructNaming()}</Text>
    </View>
  )

  useEffect(() => {
    if (isFocused) {
      getData({})
    }
  }, [isFocused])

  useImperativeHandle(ref, () => ({
    showModalExport: () => setModalExport(true),
    onAdd,
  }))

  const renderItem = ({item, index}: any) => {
    return <RKHHarvestCard onTap={() => goToDetailRKH(item)} item={item} key={index} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredData}
        style={styles.list}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.5}
        // onEndReached={() => getData({})}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            refreshing={Boolean(loading)}
            onRefresh={() => {
              getData({})
            }}
          />
        }
        renderItem={renderItem}
      />
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
})

export default RKHHarvestList
