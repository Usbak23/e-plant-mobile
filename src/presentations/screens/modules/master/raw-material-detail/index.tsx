import {useIsFocused, useNavigation, useRoute} from '@react-navigation/core'
import React, {useState, useEffect, useRef, useCallback} from 'react'
import {View, Dimensions, Animated, SafeAreaView} from 'react-native'
import {TabView} from 'react-native-tab-view'
import syncOffset from './scroll-behavior/sync-offset'
import RenderHeader from './render-header'
import CustomTabBar from './tabs/tab-bar'
import ContentTabWrapper from './tabs/content-wrapper'
import RawMaterialPurchasementCard from './raw-material-purchasement-card'
import RawMaterialReceptionCard from './raw-material-reception-card'
import Routes from '@app/presentations/navigation/Routes'
import {useHeaderPanResponder, useListPanResponder} from './scroll-behavior'
import {styles} from './styles'
import {actions, RootStateType} from '@domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {Header, Loader} from '@app/presentations/_shared-components'
import {IEffectPayload} from '@app/domain/states/types'
import {IRSRawMaterial} from '@app/domain/states/raw-material/reducer'
import {
  useIsAllowedToOrganizeMaterial,
  useIsAllowedToOrganizePurchasementMaterial,
  useIsAllowedToOrganizeReceivementMaterial,
} from '@app/domain/states/user/hooks'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const TabBarHeight = 48
const HeaderHeight = 364
const limit = 10

const RawMaterialDetail = () => {
  const isAllowedToOrganizePurchasement = useIsAllowedToOrganizePurchasementMaterial()
  const isAllowedToOrganizeReceivement = useIsAllowedToOrganizeReceivementMaterial()
  const isAllowedToOrganizeMaterial = useIsAllowedToOrganizeMaterial()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const rawMaterial = route?.params?.item
  const rawMaterialDetail = useSelector((state: RootStateType) => state.rawMaterial?.rawMaterialDetail)

  const [tabIndex, setIndex] = useState(0)
  const [routes] = useState([
    {key: 'tab1', title: 'Riwayat Pembelian'},
    {key: 'tab2', title: 'Riwayat Penerimaan'},
  ])
  const [canScroll, setCanScroll] = useState(true)

  const scrollY: any = useRef(new Animated.Value(0)).current
  const headerScrollY = useRef(new Animated.Value(0)).current
  const listRefArr: any = useRef([])
  const listOffset: any = useRef({})
  const isListGliding = useRef(false)
  const headerScrollStart = useRef(0)
  const _tabIndex = useRef(0)

  const {purchasementHistoryList, receptionHistoryList}: IRSRawMaterial = useSelector(
    (state: RootStateType) => state?.rawMaterial || {},
  )
  const {data: lists, loading}: IEffectPayload = purchasementHistoryList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const {data: listsReception, loading: loadingReception}: IEffectPayload = receptionHistoryList || {loading: false}
  const {
    docs: docsReception,
    hasNextPage: hasNextPageReception,
    nextPage: nextPageReception,
    page: pageReception,
  } = listsReception || {docs: [], page: 1}

  const headerPanResponder = useHeaderPanResponder({
    _tabIndex,
    headerScrollStart,
    headerScrollY,
    listRefArr,
    routes,
    scrollY,
    syncScrollOffset: () => syncScrollOffset,
  })

  const listPanResponder = useListPanResponder({
    headerScrollY,
  })

  const getData = useCallback(data => {
    dispatch(
      actions.getPurchasementHistoryLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const getDataReception = useCallback(data => {
    dispatch(
      actions.getReceptionHistoryLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const refreshData = useCallback(() => {
    getData({page: 1, limit, rawMaterialId: rawMaterial?.id})
  }, [])

  const refreshDataReception = useCallback(() => {
    getDataReception({page: 1, limit, rawMaterialId: rawMaterial?.id})
  }, [])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({page: nextPage, limit, rawMaterialId: rawMaterial?.id})
  }

  const getNextPageReception = () => {
    if (loadingReception || !hasNextPageReception) {
      return
    }
    getDataReception({page: nextPageReception, limit, rawMaterialId: rawMaterial?.id})
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getRawMaterialDetail.request({loading: true, data: rawMaterial?.id}))
      refreshData()
      refreshDataReception()
    }
  }, [isFocused])

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

  const syncScrollOffset = () => syncOffset({routes, listRefArr, scrollY, HeaderHeight, listOffset, _tabIndex})

  const onMomentumScrollBegin = () => (isListGliding.current = true)

  const onMomentumScrollEnd = () => {
    isListGliding.current = false
    syncScrollOffset()
  }

  const onScrollEndDrag = () => syncScrollOffset()

  const renderHeader = () =>
    RenderHeader({
      scrollY,
      HeaderHeight,
      headerPanResponder,
      rawMaterial: rawMaterialDetail?.data,
      isAllowedToOrganizePurchasement,
    })

  const rednerTab1Item = ({item, index}: any) => (
    <RawMaterialPurchasementCard
      isAllowedToOrganizePurchasement={Boolean(isAllowedToOrganizePurchasement && !item?.dateAccepted)}
      onPopupEdit={() => navigation.navigate(Routes.RAW_MATERIAL_PURCHASEMENT_FORM, {rawMaterial, item})}
      onPopupDelete={() => navigation.navigate(Routes.RAW_MATERIAL_PURCHASEMENT_FORM)}
      purchasement={item}
    />
  )

  const rednerTab2Item = ({item, index}: any) => (
    <RawMaterialReceptionCard
      isAllowedToOrganizeReceivement={isAllowedToOrganizeReceivement}
      onReceiveTap={() => navigation.navigate(Routes.RAW_MATERIAL_RECEPTION_FORM, {rawMaterial, item})}
      onPopupEdit={() => navigation.navigate(Routes.RAW_MATERIAL_RECEPTION_FORM, {rawMaterial, item, isEdit: true})}
      onPopupDelete={() => navigation.navigate(Routes.RAW_MATERIAL_RECEPTION_FORM)}
      reception={item}
    />
  )

  const customRenderScene = ({route}: any) => {
    let data
    let renderItem
    let onNextPage
    switch (route.key) {
      case 'tab1':
        data = docs
        renderItem = rednerTab1Item
        onNextPage = getNextPage
        break
      case 'tab2':
        data = docsReception
        renderItem = rednerTab2Item
        onNextPage = getNextPageReception
        break
      default:
        return null
    }
    return (
      <ContentTabWrapper
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
      <CustomTabBar
        {...props}
        scrollY={scrollY}
        HeaderHeight={HeaderHeight}
        TabBarHeight={TabBarHeight}
        isListGliding={isListGliding}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={Boolean(rawMaterialDetail?.loading)} />
      <Header title="Detail Material" />

      <View style={{flex: 1, overflow: 'hidden'}}>
        <TabView
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
    </SafeAreaView>
  )
}

export default RawMaterialDetail
