import System from '@app/domain/services/System'
import {actions, RootStateType} from '@app/domain/states/store'
import {IRSTaxation} from '@app/domain/states/taxation/reducer'
import {IEffectPayload} from '@app/domain/states/types'
import {ITaxationRow} from '@app/models/eplant/Taxation'
import Routes from '@app/presentations/navigation/Routes'
import {theme} from '@app/presentations/utils/styles'
import {Header, ListFilter, ModalAsk, ModalInfo, SortPopup} from '@app/presentations/_shared-components'
import EmptyList from '@app/presentations/_shared-components/Empty'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
// import {useIsFocused, useNavigation} from '@react-navigation/core'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, Keyboard, RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native'
import {MenuOptions} from 'react-native-popup-menu'
import {useDispatch, useSelector} from 'react-redux'
import {TaxationSortOptions} from './sort-options'
import TaxationCard from './taxation-card'
import {writeFile} from '@app/presentations/utils/writeFile'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useIsAllowedToOrganizeTaxation} from '@app/domain/states/user/hooks'
import TaxationListHeader from './taxation-list-header'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const limit = 10

const TaxationList = () => {
  const routes: any = useRoute()
  const isAllowedToOrganizeTaxation = useIsAllowedToOrganizeTaxation()
  const ORGANIZATION = routes?.params?.organization || ''
  const DIVISION = routes?.params?.division || ''
  const DATE = routes?.params?.date

  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const [modalExport, setModalExport] = useState(false)
  const [selectedTaxation, setSelectedTaxation] = useState<ITaxationRow | undefined>(undefined)

  const {taxationPaginated, deleteTaxationStatus}: IRSTaxation = useSelector(
    (state: RootStateType) => state?.taxation || {},
  )
  const {data: lists, loading}: IEffectPayload = taxationPaginated || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    numberTaxation: '',
    numberAkp: '',
    divisionId: DIVISION.value || '',
    date: DATE || '',
  })

  const getData = useCallback(data => {
    dispatch(
      actions.getTaxationPaginated.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleDelete = async () => {
    if (selectedTaxation) {
      dispatch(actions.deleteTaxation.request({loading: true, data: selectedTaxation?.taxation?.id}))
    }
  }

  useEffect(() => {
    setSelectedTaxation(undefined)
    const error = deleteTaxationStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
  }, [deleteTaxationStatus?.error])

  useEffect(() => {
    setSelectedTaxation(undefined)
    const data = deleteTaxationStatus?.data?.data
    if (data?.code == '200') {
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
      refreshData()
    }
  }, [deleteTaxationStatus?.data])

  const handleExport = async () => {
    try {
      setModalExport(false)
      const response = await System.instance.taxationService.exportTaxation()
      const res = await writeFile(response.data.toString(), '_taxation.csv')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Taksasi berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
          path: res,
        })
        .then(res => {})
        .catch(e => {})
      showSuccessToast('Success exported at ' + res)
    } catch (error: any) {
      showErrorToast(error?.message || 'Gagal saat mengekspor csv')
    }
  }

  const handleSort = (value: string) => {
    setQuery({...query, sort: value})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, sort: value, page: 1, limit})
    }, 400)
  }

  const handleSearch = (search: string) => {
    setQuery({...query, numberTaxation: search, numberAkp: search})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, numberTaxation: search, numberAkp: search, page: 1, limit})
    }, 400)
  }

  const refreshData = useCallback(() => {
    getData({...query, page: 1, limit})
  }, [query])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({...query, page: nextPage})
  }

  const goToTaxationForm = (item: ITaxationRow) => {
    //@ts-ignore
    navigation.navigate(Routes.TAXATION_FORM, {item})
  }

  const goToDetail = (item: ITaxationRow) => {
    //@ts-ignore
    navigation.navigate(Routes.TAXATION_DETAIL, {item})
  }

  useEffect(() => {
    if (isFocused) {
      refreshData()
    }
  }, [isFocused])

  const ListHeaderComponent = () => (
    <View>
      <TaxationListHeader date={DATE} organization={ORGANIZATION.label || '-'} division={DIVISION.label || '-'} />
    </View>
  )

  const SortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={TaxationSortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor taksasi?'}
      description={'Data taksasi akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={selectedTaxation != undefined}
      onTouchOutside={() => setSelectedTaxation(undefined)}
      title={'Anda yakin ingin menghapus taksasi ini?'}
      description={'Menghapus taksasi akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const renderItem = ({item, index}: any) => (
    <TaxationCard
      isAllowedToOrganizeTaxation={isAllowedToOrganizeTaxation}
      onPopupDelete={() => setSelectedTaxation(item)}
      onPopupEdit={goToTaxationForm}
      onCompleteTaxation={goToTaxationForm}
      onTap={goToDetail}
      key={index}
      item={item}
    />
  )
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Taksasi" />
      <ListFilter
        searchValue={query.numberTaxation}
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
        ListHeaderComponent={ListHeaderComponent}
        initialNumToRender={limit}
        onEndReachedThreshold={0.5}
        onEndReached={getNextPage}
        ListFooterComponent={() => <FlatListFooter loading={false} />}
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
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus taksasi' : 'Taksasi berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
    </SafeAreaView>
  )
}

export default TaxationList

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    marginTop: 16,
  },
})
