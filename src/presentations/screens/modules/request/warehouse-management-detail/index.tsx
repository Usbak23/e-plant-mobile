import {actions, RootStateType} from '@app/domain/states/store'
import {IRSWarehouseManagement} from '@app/domain/states/warehouse-management/reducer'
import {
  IManagementWarehouse,
  IManagementWarehouseApproveForm,
  IManagementWarehouseDetail,
} from '@app/models/eplant/WarehouseManagement'
import Routes from '@app/presentations/navigation/Routes'
import {theme} from '@app/presentations/utils/styles'
import {Header, ModalAsk, Text} from '@app/presentations/_shared-components'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useRef, useState} from 'react'
import {Animated, Dimensions, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {TabView} from 'react-native-tab-view'
import {useDispatch, useSelector} from 'react-redux'
import WarehouseRenderHeader from './render-header'
import {useWarehouseListPanResponder} from './scroll-behavior/warehouse-list-pan-responder'
import {useWarehouseHeaderPanResponder} from './scroll-behavior/warehouse-pan-responder'
import warehouseSyncOffset from './scroll-behavior/warehouse-sync-offset'
import WarehouseContentTabWrapper from './tabs/warehouse-content-wrapper'
import WarehouseCustomTabBar from './tabs/warehouse-tab-bar'
import WarehouseBPU from './warehouse-detail-bpu'
import WarehouseDetailHistoryCard from './warehouse-detail-history-card'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import {constructNPBHtml} from '@app/presentations/utils/html/npbHtml'
import {writeFile} from '@app/presentations/utils/writeFile'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import {useIsAllowedToOrganizeWarehouseManagement} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'
import moment from 'moment'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const TabBarHeight = 48
const HeaderHeight = 580

const limit = 10

const WarehouseManagementDetail = () => {
  const isAllowedToOrganize = useIsAllowedToOrganizeWarehouseManagement()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const route: any = useRoute()
  const parent = route.params?.parent
  const item: IManagementWarehouse | undefined = route?.params?.item
  const navigation = useNavigation()
  const [tabIndex, setIndex] = useState(0)
  const [routes] = useState(
    item?.requestType == 'Material' && item?.materialType == 'Pupuk'
      ? [
          {key: 'tab1', title: 'Riwayat Permintaan'},
          {key: 'tab2', title: 'BPU'},
        ]
      : [{key: 'tab1', title: 'Riwayat Permintaan'}],
  )

  const [canScroll, setCanScroll] = useState(true)
  const scrollY: any = useRef(new Animated.Value(0)).current
  const headerScrollY = useRef(new Animated.Value(0)).current
  const listRefArr: any = useRef([])
  const listOffset: any = useRef({})
  const isListGliding = useRef(false)
  const headerScrollStart = useRef(0)
  const _tabIndex = useRef(0)

  const {warehouseDetail, formWarehouseManagementApproveStatus}: IRSWarehouseManagement = useSelector(
    (state: RootStateType) => state?.warehouseReducer,
  )
  const [isShouldShowModal, setIsShouldShowModal] = useState(false)
  const [itemDetail, setItemDetail] = useState<IManagementWarehouseDetail | undefined>(
    warehouseDetail?.data || undefined,
  )
  const [itemToRender, setItemToRender] = useState(undefined)

  const onMoreTap = () => {
    if (!itemDetail) {
      showInfoToast('Sedang memuat data. Tunggu sebentar...')
      return
    }
    //@ts-ignore
    navigation.navigate(Routes.WAREHOUSE_MANAGEMENT_DETAIL_DESCRIPTION, {
      description: itemDetail?.request?.purpose || '-',
    })
  }

  const headerPanResponder = useWarehouseHeaderPanResponder({
    _tabIndex,
    headerScrollStart,
    headerScrollY,
    listRefArr,
    routes,
    scrollY,
    syncScrollOffset: () => syncScrollOffset,
  })

  const listPanResponder = useWarehouseListPanResponder({
    headerScrollY,
  })

  useEffect(() => {
    scrollY.addListener(({value}: any) => {
      const curRoute = routes[tabIndex].key
      listOffset.current[curRoute] = value
    })

    headerScrollY.addListener(({value}) => {
      listRefArr.current.forEach((item: any) => {
        if (item.key !== routes[tabIndex].key) {
          return
        }
        if (value > HeaderHeight || value < 0) {
          headerScrollY.stopAnimation()
          syncScrollOffset()
        }
        if (item.value && value <= HeaderHeight) {
          item.value.scrollToOffset({
            offset: value,
            animated: false,
          })
        }
      })
    })
    return () => {
      scrollY.removeAllListeners()
      headerScrollY.removeAllListeners()
    }
  }, [routes, tabIndex])

  const syncScrollOffset = () => warehouseSyncOffset({routes, listRefArr, scrollY, HeaderHeight, listOffset, _tabIndex})

  const onMomentumScrollBegin = () => (isListGliding.current = true)

  const onAccept = () => {
    const obj: IManagementWarehouseApproveForm = {
      managementWarehouseId: item?.id as string,
      status: 'Dikeluarkan',
      notes: '',
    }
    dispatch(actions.approveWarehouse.request({loading: true, data: obj}))
    setIsShouldShowModal(false)
  }

  const onMomentumScrollEnd = () => {
    isListGliding.current = false
    syncScrollOffset()
  }

  const onScrollEndDrag = () => syncScrollOffset()

  const renderHeader = () =>
    WarehouseRenderHeader({
      scrollY,
      HeaderHeight,
      headerPanResponder,
      onMoreTap: onMoreTap,
      item: item,
      itemDetail: itemDetail,
      parent,
      onAccept: () => {
        setIsShouldShowModal(true)
      },
      onDownload: createPDF,
      isAllowedToOrganize: isAllowedToOrganize,
    })

  const renderTab1Item = ({item: history, index}: any) => (
    <WarehouseDetailHistoryCard userName={item?.user?.name} key={index} history={history} />
  )

  const renderTab2Item = ({item: bpu, index}: any) => <WarehouseBPU bpus={bpu} key={index} materialName={item?.name} />

  const customRenderScene = ({route}: any) => {
    let data
    let renderItem
    let onNextPage

    switch (route.key) {
      case 'tab1':
        data = itemDetail?.request?.requestHistories || []
        renderItem = renderTab1Item
        onNextPage = () => {}
        break
      case 'tab2':
        data = [itemDetail?.bpus || []]
        renderItem = renderTab2Item
        onNextPage = () => {}
        break

      default:
        return null
    }
    return (
      <WarehouseContentTabWrapper
        limit={limit}
        onNextPage={onNextPage}
        listPanResponder={listPanResponder}
        listRefArr={listRefArr}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        data={data}
        renderItem={renderItem}
        route={route}
        scrollY={scrollY}
        focused={route.key == routes[tabIndex].key}
        HeaderHeight={HeaderHeight}
        TabBarHeight={TabBarHeight}
        windowHeight={windowHeight}
      />
    )
  }

  const renderTabBar = (props: any) => {
    return (
      <WarehouseCustomTabBar
        {...props}
        scrollY={scrollY}
        HeaderHeight={HeaderHeight}
        TabBarHeight={TabBarHeight}
        isListGliding={isListGliding}
      />
    )
  }

  const createPDF = async () => {
    if (!itemDetail) {
      showInfoToast('Sedang memuat data. Tunggu sebentar...')
      return
    }

    const html = constructNPBHtml(
      item?.requestNumber,
      item?.user?.name,
      moment(item?.date).format('DD MMMM YYYY'),
      itemDetail?.request?.name,
      item?.materialType == 'Uang Tunai' ? numberWithDot(itemDetail?.request?.qty) || '-' : itemDetail?.request?.qty,
      itemDetail?.request?.purpose,
      itemDetail?.bpus,
      item?.name,
      item?.requestType,
    )
    if (Platform.OS == 'ios') {
      const options = {
        html: html,
        fileName: 'user',
        base64: true,
        directory: 'Documents',
      }

      await RNHTMLtoPDF.convert(options)
      showInfoToast('Data telah disimpan. Periksa folder dokumen anda')
    } else {
      const options = {
        html: html,
        fileName: 'test',
        directory: 'Documents',
        base64: true,
      }

      const file = await RNHTMLtoPDF.convert(options)
      const res = await writeFile(file.base64, '_NPB.pdf', 'base64')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'NPB berhasil diunduh', c.EXPORT_NOTIFICATION_ID, {
          path: res,
        })
        .then(res => {})
        .catch(e => {})
      showSuccessToast('Data telah disimpan. Periksa ' + res)
    }
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getWarehouseDetail.request({loading: true, data: item?.id}))
    }
  }, [isFocused])

  useEffect(() => {
    if (warehouseDetail?.data) {
      setItemDetail(warehouseDetail?.data)
    }
  }, [warehouseDetail])

  useEffect(() => {
    const error = formWarehouseManagementApproveStatus?.error
    if (error) {
      const msg = error?.message || 'Gagal mengeluarkan barang'
      showErrorToast(msg)
    }
  }, [formWarehouseManagementApproveStatus?.error])

  useEffect(() => {
    const data = formWarehouseManagementApproveStatus?.data
    if (data?.data?.status == 'success') {
      showSuccessToast('Berhasil dikeluarkan')
      navigation.goBack()
    }
  }, [formWarehouseManagementApproveStatus?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Manajemen Gudang" />
      <View style={{flex: 1, overflow: 'hidden'}}>
        <TabView
          swipeEnabled={false}
          style={{marginHorizontal: 16}}
          onSwipeStart={() => setCanScroll(false)}
          onSwipeEnd={() => setCanScroll(true)}
          onIndexChange={id => {
            _tabIndex.current = id
            setIndex(id)
          }}
          navigationState={{index: tabIndex, routes}}
          renderScene={customRenderScene}
          renderTabBar={renderTabBar}
          initialLayout={{
            height: 0,
            width: windowWidth,
          }}
        />
        {renderHeader()}
      </View>
      <ModalAsk
        onPositiveButtonTap={onAccept}
        isDanger={true}
        isOpen={isShouldShowModal}
        onTouchOutside={() => {
          setIsShouldShowModal(false)
        }}
        title={'Anda yakin ingin mengeluarkan barang?'}
        description={'Mengubah barang akan mengubah stok barang pada material dan tidak dapat dikembalikan'}
        positiveButtonText={'Keluarkan'}
      />
    </SafeAreaView>
  )
}

export default WarehouseManagementDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterModalContainer: {
    // flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
  },
})
