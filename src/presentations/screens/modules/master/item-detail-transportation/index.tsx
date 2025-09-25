import { IRDailyActivity } from '@app/domain/states/daily-activity/reducer'
import { RootState } from '@app/domain/states/reducers'
import { actions, RootStateType } from '@app/domain/states/store'
import { IEffectPayload } from '@app/domain/states/types'
import { IDailyActivity } from '@app/models/eplant/IDailyActivity'
import { theme } from '@app/presentations/utils/styles'
import { Button, Header, Loader, ModalAsk, SelectInput, Text } from '@app/presentations/_shared-components'
import ModalFilter from '@app/presentations/_shared-components/ModalFilter'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { useDispatch, useSelector } from 'react-redux'
import ItemDailyActivityCard from './item-daily-activity-card'
import ItemRenderHeader from './render-header'

import { useItemHeaderPanResponder } from './scroll-behavior/item-header-pan-responder'
import { useItemListPanResponder } from './scroll-behavior/item-list-pan-responder'
import itemSyncOffset from './scroll-behavior/item-sync-offset'
import ItemContentTabWrapper from './tabs/item-content-wrapper'
import ItemCustomTabBar from './tabs/item-tab-bar'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useRangeMonths, useRangeYears } from '@app/domain/states/master/hooks'
import { ScrollView } from 'react-native-gesture-handler'
import { SORT_DAILY_ACTIVITY } from './sort-daily-activity'
import ItemMaintenanceCard from './maintenance-card'
import { IRSMaintenance } from '@app/domain/states/maintenance/reducer'
import Routes from '@app/presentations/navigation/Routes'
import { SORT_MAINTENANCE } from './sort-maintenance'
import { IMaintenance } from '@app/models/eplant/Maintenance'
import { IRSItem } from '@app/domain/states/item/reducer'
import { useCurrentUserInfo, useIsAllowedToOrganizeToolsAndItems } from '@app/domain/states/user/hooks'
import ItemDetailTransportationInfo from './item-detail-transportation-info'
import Feather from 'react-native-vector-icons/Feather'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const TabBarHeight = 48
const HeaderHeight = 380

const ItemDetailTransportation = () => {
  const isAllowedToOrganize = useIsAllowedToOrganizeToolsAndItems()
  const userInfo = useCurrentUserInfo()
  const navigation = useNavigation()
  const years = useRangeYears()
  const months = useRangeMonths()
  const isFocused = useIsFocused()
  const limit = 10
  const dispatch = useDispatch()
  const route: any = useRoute()
  const item = route?.params?.item
  const [tabIndex, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'tab1', title: 'Aktivitas Harian' },
    { key: 'tab2', title: 'Maintenance' },
  ])
  const [canScroll, setCanScroll] = useState(true)
  const scrollY: any = useRef(new Animated.Value(0)).current
  const headerScrollY = useRef(new Animated.Value(0)).current
  const listRefArr: any = useRef([])
  const listOffset: any = useRef({})
  const isListGliding = useRef(false)
  const headerScrollStart = useRef(0)
  const _tabIndex = useRef(0)

  const [itemToRender, setItemToRender] = useState(item)
  const [selectedDailyActivity, setSelectedDailyActivity] = useState<IDailyActivity | undefined>()
  const [selectedMaintenance, setSelectedMaintenance] = useState<IMaintenance | undefined>()
  const [isDeleteModalOpen, setModalDeleteOpen] = useState(false)

  const { deleteItemStatus }: IRSItem = useSelector((state: RootStateType) => state.item)

  const { dailyActivityList, deleteDailyActivityStatus }: IRDailyActivity = useSelector(
    (state: RootStateType) => state?.dailyActivityReducer || {},
  )
  const { data: lists, loading: loadingDailyActivity }: IEffectPayload = dailyActivityList || { loading: false }

  const { itemDetail }: IRSItem = useSelector((state: RootStateType) => state.item)
  const { maintenanceList, deleteMaintenanceStatus }: IRSMaintenance = useSelector(
    (state: RootStateType) => state?.maintenanceReducer || {},
  )
  const { data: listMaintenance, loading: loadingMaintenance }: IEffectPayload = maintenanceList || { loading: false }

  const [modalFilterDailyActivity, setModalFilterDailyActivity] = useState(false)
  const [modalFilterMaintenance, setModalFilterMaintenance] = useState(false)
  const [modalSortDailyActivity, setModalSortDailyActivity] = useState(false)
  const [modalSortMaintenance, setModalSortMaintenance] = useState(false)

  const [modalFilterDailyActivityQuery, setModalFilterDailyActivityQuery] = useState({
    year: '',
    month: '',
  })

  const [modalFilterMaintenanceQuery, setModalFilterMaintenanceQuery] = useState({
    year: '',
    month: '',
  })

  const [modalSortDailyActivityQuery, setModalSortDailyActivityQuery] = useState({
    sort: 'itemCheckups_createdAt:desc',
  })

  const [modalSortMaintenanceQuery, setModalSortMaintenanceQuery] = useState({
    sort: 'itemMaintenances_createdAt:desc',
  })

  const {
    docs: docsDailyActvity,
    hasNextPage: hasNextPageDailyActivity,
    nextPage: nextPageDailyActivity,
    page: pageDailyActivity,
    totalPages: totalPagesDailyActivity,
  } = lists || { docs: [], page: 1 }

  const {
    docs: docsMaintenance,
    hasNextPage: hasNextPageMaintenance,
    nextPage: nextPageMaintenance,
    page: pageMaintenance,
    totalPages: totalPagesMaintenance,
  } = listMaintenance || { docs: [], page: 1 }

  const [queryDailyActivity, setQueryDailyActivity] = useState({
    itemId: item?.id,
    search: '',
    sort: 'itemCheckups_createdAt:desc',
    year: '',
    month: '',
  })

  const [queryMaintenance, setQueryMaintenance] = useState({
    itemId: item?.id,
    search: '',
    sort: 'itemMaintenances_createdAt:desc',
    year: '',
    month: '',
  })

  const headerPanResponder = useItemHeaderPanResponder({
    _tabIndex,
    headerScrollStart,
    headerScrollY,
    listRefArr,
    routes,
    scrollY,
    syncScrollOffset: () => syncScrollOffset,
  })

  const listPanResponder = useItemListPanResponder({
    headerScrollY,
  })

  useEffect(() => {
    scrollY.addListener(({ value }: any) => {
      const curRoute = routes[tabIndex].key
      listOffset.current[curRoute] = value
    })

    headerScrollY.addListener(({ value }) => {
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

  const syncScrollOffset = () => itemSyncOffset({ routes, listRefArr, scrollY, HeaderHeight, listOffset, _tabIndex })

  const onMomentumScrollBegin = () => (isListGliding.current = true)

  const onMomentumScrollEnd = () => {
    isListGliding.current = false
    syncScrollOffset()
  }

  const onScrollEndDrag = () => syncScrollOffset()

  const renderHeader = () =>
    ItemRenderHeader({
      scrollY,
      HeaderHeight,
      headerPanResponder,
      item: itemToRender,
      onDelete: () => setModalDeleteOpen(true),
    })

  const onDeleteDailyActivity = (i: IDailyActivity) => {
    setSelectedDailyActivity(i)
  }

  const onDeleteMaintenance = (i: IMaintenance) => {
    setSelectedMaintenance(i)
  }

  const renderTab1Item = ({ item: dailyAct, index }: any) => (
    <ItemDailyActivityCard
      item={item}
      onDelete={() => onDeleteDailyActivity(dailyAct)}
      dailyActivity={dailyAct}
      key={index}
      userInfo={userInfo}
      isAllowedToOrganize={isAllowedToOrganize}
    />
  )

  const renderTab2Item = ({ item: maintenance, index }: any) => (
    <ItemMaintenanceCard
      item={item}
      maintenance={maintenance}
      onDelete={() => onDeleteMaintenance(maintenance)}
      key={index}
      userInfo={userInfo}
      isAllowedToOrganize={isAllowedToOrganize}
    />
  )

  const getData = useCallback(data => {
    dispatch(
      actions.getDailyActivityList.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const getDataMaintenance = useCallback(data => {
    dispatch(
      actions.getMaintenanceList.request({
        loading: true,
        data,
      }),
    )
  }, [])

  useEffect(() => {
    getData({ ...queryDailyActivity, page: 1, limit })
  }, [queryDailyActivity])

  useEffect(() => {
    getDataMaintenance({ ...queryMaintenance, page: 1, limit })
  }, [queryMaintenance])

  const getNextPageMaintenance = () => {
    if (loadingMaintenance || !hasNextPageMaintenance || pageMaintenance > totalPagesMaintenance) {
      return
    }
    getDataMaintenance({ ...queryMaintenance, page: nextPageMaintenance, limit })
  }

  const getNextPageDailyActivity = () => {
    if (loadingDailyActivity || !hasNextPageDailyActivity || pageDailyActivity > totalPagesDailyActivity) {
      return
    }
    getData({ ...queryDailyActivity, page: nextPageDailyActivity, limit })
  }

  const customRenderScene = ({ route }: any) => {
    let data
    let renderItem
    let onNextPage
    let loading
    let p
    let onRefresh
    let onOpenFilter
    let handleSearch
    let searchValue
    let onOpenSort
    let openNew
    let isCheckup = true
    switch (route.key) {
      case 'tab1':
        data = docsDailyActvity
        renderItem = renderTab1Item
        onNextPage = getNextPageDailyActivity
        loading = Boolean(loadingDailyActivity)
        p = pageDailyActivity
        onRefresh = () => { }
        onOpenFilter = () => {
          setModalFilterDailyActivity(true)
        }
        handleSearch = (q: string) => {
          setQueryDailyActivity({ ...queryDailyActivity, search: q, limit, page: 1 })
        }
        searchValue = queryDailyActivity.search
        onOpenSort = () => {
          setModalSortDailyActivity(true)
        }
        openNew = () => {
          //@ts-ignore
          navigation.navigate(Routes.DAILY_ACTIVITY_FORM, { item })
        }
        isCheckup = true
        break
      case 'tab2':
        data = docsMaintenance
        renderItem = renderTab2Item
        onNextPage = getNextPageMaintenance
        loading = Boolean(loadingMaintenance)
        p = pageMaintenance
        onRefresh = () => { }
        onOpenFilter = () => {
          setModalFilterMaintenance(true)
        }
        handleSearch = (q: string) => {
          setQueryMaintenance({ ...queryMaintenance, search: q, limit, page: 1 })
        }
        onOpenSort = () => {
          setModalSortMaintenance(true)
        }
        searchValue = queryMaintenance.search
        openNew = () => {
          //@ts-ignore
          navigation.navigate(Routes.MAINTENANCE_FORM, { item })
        }
        isCheckup = false
        break
      default:
        return null
    }
    return (
      <ItemContentTabWrapper
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
        item={item}
        loading={loading}
        page={p}
        onRefresh={onRefresh}
        onOpenFilter={onOpenFilter}
        onHandleSearch={handleSearch}
        searchValue={searchValue}
        onOpenSort={onOpenSort}
        onOpenNew={openNew}
        isCheckup={isCheckup}
        isAllowedToOrganize={isAllowedToOrganize}
      />
    )
  }

  const renderTabBar = (props: any) => {
    return (
      <ItemCustomTabBar
        {...props}
        scrollY={scrollY}
        HeaderHeight={HeaderHeight}
        TabBarHeight={TabBarHeight}
        isListGliding={isListGliding}
      />
    )
  }

  useEffect(() => {
    const error = deleteItemStatus?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menghapus item harian')
    }
    setModalDeleteOpen(false)
  }, [deleteItemStatus?.error])

  useEffect(() => {
    setModalDeleteOpen(false)
    const data = deleteItemStatus?.data?.data
    if (data?.code == 200) {
      showSuccessToast('Item berhasil berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteItemStatus?.data])

  useEffect(() => {
    const i = itemDetail?.data
    if (i) {
      setItemToRender(i)
    }
  }, [itemDetail?.data])

  useEffect(() => {
    getData({ ...queryDailyActivity, page: 1, limit })
    getDataMaintenance({ ...queryMaintenance, page: 1, limit })
    dispatch(actions.getItemDetail.request({ loading: true, data: item?.id }))
    // dispatch(actions.getDailyActivityList.request({loading: true, data: {...queryDailyActivity}}))
  }, [isFocused])

  useEffect(() => {
    const error = deleteDailyActivityStatus?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menghapus aktivitas harian')
    }
    setSelectedDailyActivity(undefined)
  }, [deleteDailyActivityStatus?.error])

  useEffect(() => {
    setSelectedDailyActivity(undefined)
    const data = deleteDailyActivityStatus?.data?.data
    if (data?.code == 200) {
      getData({ ...queryDailyActivity, page: 1, limit })
      showSuccessToast('Aktivitas harian berhasil dihapus')
    }
  }, [deleteDailyActivityStatus?.data])

  useEffect(() => {
    const error = deleteMaintenanceStatus?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menghapus maintenance')
    }
    setSelectedMaintenance(undefined)
  }, [deleteMaintenanceStatus?.error])

  useEffect(() => {
    setSelectedMaintenance(undefined)
    const data = deleteMaintenanceStatus?.data?.data
    if (data?.code == 200) {
      getDataMaintenance({ ...queryMaintenance, page: 1, limit })
      showSuccessToast('Maintenance berhasil dihapus')
    }
  }, [deleteMaintenanceStatus?.data])

  const ModalDeleteDailyActivity = () => (
    <ModalAsk
      onPositiveButtonTap={() => {
        dispatch(actions.deleteDailyActivity.request({ loading: true, data: selectedDailyActivity?.id }))
        setSelectedDailyActivity(undefined)
      }}
      isDanger
      isOpen={selectedDailyActivity != undefined}
      onTouchOutside={() => setSelectedDailyActivity(undefined)}
      title={'Anda yakin ingin menghapus Aktivitas Harian ini?'}
      description={'Menghapus Aktivitas Harian ini akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalDeleteMaintenance = () => (
    <ModalAsk
      onPositiveButtonTap={() => {
        dispatch(actions.deleteMaintenance.request({ loading: true, data: selectedMaintenance?.id }))
        setSelectedMaintenance(undefined)
      }}
      isDanger
      isOpen={selectedMaintenance != undefined}
      onTouchOutside={() => setSelectedMaintenance(undefined)}
      title={'Anda yakin ingin menghapus Maintenance ini?'}
      description={'Menghapus Maintenance ini akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Item" />
      <ScrollView>
        <ItemDetailTransportationInfo i={item} onDelete={() => setModalDeleteOpen(true)} />
        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center', paddingVertical: 16 }}>
          <Feather color={theme.colors.grey} name={'info'} size={20} />
          <Text style={{ textAlign: 'center' }}>Maintenance dan Aktivitas Harian tidak lagi tersedia di aplikasi mobile. Buka versi web untuk melanjutkan</Text>
        </View>

      </ScrollView>

      {/* <View style={{ flex: 1, overflow: 'hidden' }}>
        <TabView
          style={{ marginHorizontal: 16 }}
          onSwipeStart={() => setCanScroll(false)}
          onSwipeEnd={() => setCanScroll(true)}
          onIndexChange={id => {
            _tabIndex.current = id
            setIndex(id)
          }}
          navigationState={{ index: tabIndex, routes }}
          renderScene={customRenderScene}
          renderTabBar={renderTabBar}
          initialLayout={{
            height: 0,
            width: windowWidth,
          }}
        />
        {renderHeader()}
      </View> */}

      <ModalDeleteDailyActivity />
      <ModalDeleteMaintenance />
      <ModalFilter
        isOpen={modalFilterDailyActivity}
        onTouchOutside={() => {
          setModalFilterDailyActivity(false)
          setModalFilterDailyActivityQuery({
            year: queryDailyActivity?.year || '',
            month: queryDailyActivity?.month || '',
          })
        }}>
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => {
              setModalFilterDailyActivity(false)
              setModalFilterDailyActivityQuery({
                year: queryDailyActivity?.year || '',
                month: queryDailyActivity?.month || '',
              })
            }}>
            <Icon name="close" size={20} color={theme.colors.textThinBlack} />
          </TouchableOpacity>

          <View style={{ width: '100%', marginVertical: 8, flexDirection: 'column' }}>
            <Text style={{ alignSelf: 'flex-start' }} type="semibold" size={13} color={theme.colors.textThinBlack}>
              Filter Berdasarkan
            </Text>
            <ScrollView style={{ marginTop: 16 }}>
              <SelectInput
                label="Tahun"
                style={{ alignSelf: 'stretch' }}
                // containerStyle={styles.filterInput}
                items={years}
                value={modalFilterDailyActivityQuery.year}
                placeholder="Pilih Tahun"
                onChange={v => setModalFilterDailyActivityQuery({ ...modalFilterDailyActivityQuery, year: v })}
              />
              <SelectInput
                label="Bulan"
                style={{ alignSelf: 'stretch' }}
                // containerStyle={styles.filterInput}
                items={months}
                value={modalFilterDailyActivityQuery.month}
                placeholder="Pilih Bulan"
                onChange={v => setModalFilterDailyActivityQuery({ ...modalFilterDailyActivityQuery, month: v })}
              />
              <Button
                style={{ width: '100%' }}
                onPress={() => {
                  setQueryDailyActivity({
                    ...queryDailyActivity,
                    month: modalFilterDailyActivityQuery.month,
                    year: modalFilterDailyActivityQuery.year,
                  })
                  setModalFilterDailyActivity(false)
                }}>
                <Text color="white">Filter</Text>
              </Button>
            </ScrollView>
          </View>
        </View>
      </ModalFilter>

      {/* Below is sort for daily activity */}
      <ModalFilter
        isOpen={modalSortDailyActivity}
        onTouchOutside={() => {
          setModalSortDailyActivity(false)
          setModalSortDailyActivityQuery({
            sort: queryDailyActivity?.sort || '',
          })
        }}>
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => {
              setModalSortDailyActivity(false)
              setModalSortDailyActivityQuery({
                sort: queryDailyActivity?.sort || '',
              })
            }}>
            <Icon name="close" size={20} color={theme.colors.textThinBlack} />
          </TouchableOpacity>

          <View style={{ width: '100%', marginVertical: 8, flexDirection: 'column' }}>
            <Text style={{ alignSelf: 'flex-start' }} type="semibold" size={13} color={theme.colors.textThinBlack}>
              Urut Berdasarkan
            </Text>
            <ScrollView style={{ marginTop: 16 }}>
              <SelectInput
                label="Urut"
                style={{ alignSelf: 'stretch' }}
                items={SORT_DAILY_ACTIVITY}
                value={modalSortDailyActivityQuery.sort}
                placeholder="Urut berdasarkan"
                onChange={v => setModalSortDailyActivityQuery({ ...modalSortDailyActivityQuery, sort: v })}
              />
              <Button
                style={{ width: '100%' }}
                onPress={() => {
                  setQueryDailyActivity({
                    ...queryDailyActivity,
                    sort: modalSortDailyActivityQuery.sort,
                  })
                  setModalSortDailyActivity(false)
                }}>
                <Text color="white">Urut</Text>
              </Button>
            </ScrollView>
          </View>
        </View>
      </ModalFilter>

      {/* Filter maintenance */}
      <ModalFilter
        isOpen={modalFilterMaintenance}
        onTouchOutside={() => {
          setModalFilterMaintenance(false)
          setModalFilterMaintenanceQuery({
            year: queryMaintenance?.year || '',
            month: queryMaintenance?.month || '',
          })
        }}>
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => {
              setModalFilterMaintenance(false)
              setModalFilterMaintenanceQuery({
                year: queryMaintenance?.year || '',
                month: queryMaintenance?.month || '',
              })
            }}>
            <Icon name="close" size={20} color={theme.colors.textThinBlack} />
          </TouchableOpacity>

          <View style={{ width: '100%', marginVertical: 8, flexDirection: 'column' }}>
            <Text style={{ alignSelf: 'flex-start' }} type="semibold" size={13} color={theme.colors.textThinBlack}>
              Filter Berdasarkan
            </Text>
            <ScrollView style={{ marginTop: 16 }}>
              <SelectInput
                label="Tahun"
                style={{ alignSelf: 'stretch' }}
                items={years}
                value={modalFilterMaintenanceQuery.year}
                placeholder="Pilih Tahun"
                onChange={v => setModalFilterMaintenanceQuery({ ...modalFilterMaintenanceQuery, year: v })}
              />
              <SelectInput
                label="Bulan"
                style={{ alignSelf: 'stretch' }}
                items={months}
                value={modalFilterMaintenanceQuery.month}
                placeholder="Pilih Bulan"
                onChange={v => setModalFilterMaintenanceQuery({ ...modalFilterMaintenanceQuery, month: v })}
              />
              <Button
                style={{ width: '100%' }}
                onPress={() => {
                  setModalFilterMaintenance(false)
                  setQueryMaintenance({
                    ...queryMaintenance,
                    year: modalFilterMaintenanceQuery?.year || '',
                    month: modalFilterMaintenanceQuery?.month || '',
                  })
                }}>
                <Text color="white">Filter</Text>
              </Button>
            </ScrollView>
          </View>
        </View>
      </ModalFilter>

      {/* Below is sort for maintenance*/}
      <ModalFilter
        isOpen={modalSortMaintenance}
        onTouchOutside={() => {
          setModalSortMaintenance(false)
          setModalSortMaintenanceQuery({
            sort: queryMaintenance?.sort || '',
          })
        }}>
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => {
              setModalSortMaintenance(false)
              setModalSortMaintenanceQuery({
                sort: queryMaintenance?.sort || '',
              })
            }}>
            <Icon name="close" size={20} color={theme.colors.textThinBlack} />
          </TouchableOpacity>

          <View style={{ width: '100%', marginVertical: 8, flexDirection: 'column' }}>
            <Text style={{ alignSelf: 'flex-start' }} type="semibold" size={13} color={theme.colors.textThinBlack}>
              Urut Berdasarkan
            </Text>
            <ScrollView style={{ marginTop: 16 }}>
              <SelectInput
                label="Urut"
                style={{ alignSelf: 'stretch' }}
                items={SORT_MAINTENANCE}
                value={modalSortMaintenanceQuery.sort}
                placeholder="Urut berdasarkan"
                onChange={v => setModalSortMaintenanceQuery({ ...modalSortMaintenanceQuery, sort: v })}
              />
              <Button
                style={{ width: '100%' }}
                onPress={() => {
                  setQueryMaintenance({
                    ...queryMaintenance,
                    sort: modalSortMaintenanceQuery.sort,
                  })
                  setModalSortMaintenance(false)
                }}>
                <Text color="white">Urut</Text>
              </Button>
            </ScrollView>
          </View>
        </View>
      </ModalFilter>
      <ModalAsk
        onPositiveButtonTap={() => {
          setModalDeleteOpen(false)
          dispatch(actions.deleteItem.request({ loading: true, data: item?.id }))
        }}
        isDanger={true}
        isOpen={isDeleteModalOpen}
        onTouchOutside={() => {
          setModalDeleteOpen(false)
        }}
        title={'Anda yakin ingin menghapus item ini dari daftar absensi?'}
        description={'Item akan dihapus dan tidak dapat dikembalikan lagi'}
        positiveButtonText={'Hapus'}
      />
    </SafeAreaView>
  )
}

export default ItemDetailTransportation

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
