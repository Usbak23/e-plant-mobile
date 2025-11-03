import {Header, ListFilter, ModalAsk, ModalInfo, SortPopup, Text} from '@app/presentations/_shared-components'
import EmptyList from '@app/presentations/_shared-components/Empty'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, Keyboard, RefreshControl, SafeAreaView, TouchableOpacity, View} from 'react-native'
import {MenuOptions} from 'react-native-popup-menu'
import CensusCard from './census-card'
import {CensusSortOptions} from './sort-options'
import {styles} from './style'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {theme} from '@app/presentations/utils/styles'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/core'
import Routes from '@app/presentations/navigation/Routes'
import {useDispatch, useSelector} from 'react-redux'
import flux, {actions, RootStateType} from '@domain/states/store'
import {IRSCensus} from '@app/domain/states/census/reducer'
import {IEffectPayload} from '@app/domain/states/types'
import {ICensusRow} from '@app/models/eplant/Census'
import System from '@app/domain/services/System'
import {writeFile} from '@app/presentations/utils/writeFile'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {deleteCensus} from '@app/domain/states/census/actions'
import {useIsAllowedToOrganizeCensus} from '@app/domain/states/user/hooks'
import CensusListHeader from './census-list-header'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const limit = 10

const CensusList = () => {
  const routes: any = useRoute()
  const ORGANIZATION = routes?.params?.organization
  const DIVISION = routes?.params?.division
  const YEAR = routes?.params?.year || ''

  const isAllowedToOrganizeCensus = useIsAllowedToOrganizeCensus()
  const isFocused = useIsFocused()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    search: '',
    numberCensus: '',
    divisionId: DIVISION?.value || '',
    year: YEAR,
  })

  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const [selectedCensus, setSelectedCensus] = useState<ICensusRow | undefined>(undefined)
  const [modalExport, setModalExport] = useState(false)
  const {censusList, deleteCensusStatus}: IRSCensus = useSelector((state: RootStateType) => state?.census || {})
  const {data: lists, loading}: IEffectPayload = censusList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const getData = useCallback(data => {
    dispatch(
      actions.getCensusLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const refreshData = useCallback(() => {
    getData({...query, page: 1, limit})
  }, [query])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({...query, page: nextPage})
  }

  const handleSearch = (search: string) => {
    setQuery({...query, numberCensus: search})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, numberCensus: search, page: 1, limit})
    }, 400)
  }

  const handleSort = (value: string) => {
    setQuery({...query, sort: value})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, sort: value, page: 1, limit})
    }, 400)
  }

  //@ts-ignore
  const goToCensusForm = () => navigation.navigate(Routes.CENSUS_FORM, {parent: {ORGANIZATION, DIVISION, YEAR}})

  const onPopupEdit = (item: ICensusRow) => {
    //@ts-ignore
    navigation.navigate(Routes.CENSUS_FORM, {item, parent: {ORGANIZATION, DIVISION, YEAR}})
  }

  const handleExport = async () => {
    try {
      setModalExport(false)
      const response = await System.instance.censusService.exportCensus()
      const res = await writeFile(response.data.toString(), '_census.csv')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Sensus berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
          path: res,
        })
        .then(res => {})
        .catch(e => {})
      showSuccessToast('Success exported at ' + res)
    } catch (error: any) {
      showErrorToast(error?.message || 'Gagal saat mengekspor csv')
    }
  }

  useEffect(() => {
    if (isFocused) {
      refreshData()
    }
  }, [isFocused])

  useEffect(() => {
    setSelectedCensus(undefined)
    const error = deleteCensusStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
  }, [deleteCensusStatus?.error])

  useEffect(() => {
    setSelectedCensus(undefined)
    const data = deleteCensusStatus?.data?.data
    if (data?.code == '200') {
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
      refreshData()
    }
  }, [deleteCensusStatus?.data])

  const handleDelete = async () => {
    if (selectedCensus) {
      dispatch(actions.deleteCensus.request({loading: true, data: selectedCensus.id}))
    }
  }

  const SortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={CensusSortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const ListHeaderComponent = () => (
    <View>
      <CensusListHeader division={DIVISION?.label || '-'} organization={ORGANIZATION?.label || '-'} year={YEAR} />
    </View>
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor sensus?'}
      description={'Data sensus akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={selectedCensus != undefined}
      onTouchOutside={() => setSelectedCensus(undefined)}
      title={'Anda yakin ingin menghapus sensus ini?'}
      description={'Menghapus sensus akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const renderItem = ({item, index}: any) => (
    <CensusCard
      isAllowedToOrganizeCensus={isAllowedToOrganizeCensus}
      onPopupDelete={() => setSelectedCensus(item)}
      onPopupEdit={onPopupEdit}
      onTap={() => {
        //@ts-ignore
        navigation.navigate(Routes.CENSUS_DETAIL, {item, parent: {ORGANIZATION, DIVISION, YEAR}})
      }}
      key={index}
      item={item}
    />
  )
  return (
    <SafeAreaView style={styles.root}>
      <Header
        title="Sensus"
        headerRight={
          isAllowedToOrganizeCensus
            ? () => (
                <TouchableOpacity onPress={goToCensusForm}>
                  <Icon name={'add'} size={22} color={theme.colors.black} />
                </TouchableOpacity>
              )
            : undefined
        }
      />
      <ListFilter
        searchValue={query.numberCensus}
        onChangeSearch={handleSearch}
        onPressDownload={() => setModalExport(true)}
        sortOptions={SortOptions}
      />
      <FlatList
        onScrollBeginDrag={Keyboard.dismiss}
        style={styles.list}
        data={docs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        initialNumToRender={limit}
        onEndReachedThreshold={0.5}
        onEndReached={getNextPage}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
          ) : undefined
        }
      />
      <ModalExport />
      <ModalDelete />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus sensus' : 'Sensus berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
    </SafeAreaView>
  )
}

export default CensusList
