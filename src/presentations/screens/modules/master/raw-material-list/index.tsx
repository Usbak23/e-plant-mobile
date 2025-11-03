import System from '@app/domain/services/System'
import {IEffectPayload} from '@app/domain/states/types'
import Routes from '@app/presentations/navigation/Routes'
import {theme} from '@app/presentations/utils/styles'
import {writeFile} from '@app/presentations/utils/writeFile'
import {Header, ListFilter, ModalAsk, ModalInfo, SortPopup} from '@app/presentations/_shared-components'
import EmptyList from '@app/presentations/_shared-components/Empty'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useIsFocused, useNavigation} from '@react-navigation/core'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, Keyboard, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native'
import {MenuOptions} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useDispatch, useSelector} from 'react-redux'
import RawMaterialCard from './raw-material-card'
import {RawMaterialSortOptions} from './sort-options'
import {actions, RootStateType} from '@domain/states/store'
import {IRSRawMaterial} from '@app/domain/states/raw-material/reducer'
import {IRawMaterialRow} from '@app/models/eplant/RawMaterial'
import {
  useIsAllowedToOrganizeMaterial,
  useIsAllowedToOrganizePurchasementMaterial,
  useIsAllowedToSeeMaterial,
} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const RawMaterialList = () => {
  const isAllowedToOrganizePurchasement = useIsAllowedToOrganizePurchasementMaterial()
  const isAllowedToSeeMaterial = useIsAllowedToSeeMaterial()
  const isAllowedToOrganizeMaterial = useIsAllowedToOrganizeMaterial()
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const [modalExport, setModalExport] = useState(false)

  const [selectedRawMaterial, setSelectedRawMaterial] = useState<any | undefined>(undefined)

  const limit = 10
  const [query, setQuery] = useState({
    sort: 'isLessThanStock:desc',
    search: '',
    name: '',
    // code: '',
    // location: '',
  })

  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {rawMaterialList, deleteRawMaterialStatus}: IRSRawMaterial = useSelector(
    (state: RootStateType) => state?.rawMaterial || {},
  )
  const {data: lists, loading}: IEffectPayload = rawMaterialList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const refreshData = useCallback(() => {
    getData({...query, page: 1, limit})
  }, [query])

  const goToRawMaterialDetail = (item: IRawMaterialRow) => {
    navigation.navigate(Routes.RAW_MATERIAL_DETAIL, {item})
  }

  const getData = useCallback(data => {
    dispatch(
      actions.getRawMaterialLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({...query, page: nextPage})
  }

  const handleSearch = (searchQuery: string) => {
    // setQuery({...query, name: searchQuery, code: searchQuery, location: searchQuery})
    setQuery({...query, search: searchQuery})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      // getData({...query, name: searchQuery, code: searchQuery, location: searchQuery, page: 1, limit})
      // getData({...query, search: searchQuery, page: 1, limit})
      getData({...query, search: searchQuery, page: 1, limit})
    }, 400)
  }

  const handleSort = (value: string) => {
    setQuery({...query, sort: value})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, sort: value, page: 1, limit})
    }, 400)
  }

  const handleDelete = async () => {
    if (selectedRawMaterial) {
      dispatch(actions.deleteRawMaterial.request({loading: true, data: selectedRawMaterial.id}))
    }
  }

  const onPopupDelete = (item: IRawMaterialRow) => setSelectedRawMaterial(item)

  const onPopupEdit = (item: IRawMaterialRow) => {
    navigation.navigate(Routes.RAW_MATERIAL_FORM, {item})
  }
  const onPopupAddStock = (item: any) => {
    navigation.navigate(Routes.RAW_MATERIAL_PURCHASEMENT_FORM, {rawMaterial: item})
    // navigation.navigate(Routes.RAW_MATERIAL_FORM)
  }

  const handleExport = async () => {
    try {
      setModalExport(false)
      if (!isAllowedToSeeMaterial) {
        showErrorToast('Anda tidak memiliki hak akses untuk mengekspor data')
        return
      }
      const response = await System.instance.rawMaterialService.exportRawMaterial()
      const res = await writeFile(response.data.toString(), '_raw_material.csv')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Data material berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
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

  const sortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={RawMaterialSortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const goToCreatePage = () => navigation.navigate(Routes.RAW_MATERIAL_FORM)

  useEffect(() => {
    setSelectedRawMaterial(undefined)
    const error = deleteRawMaterialStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
  }, [deleteRawMaterialStatus?.error])

  useEffect(() => {
    setSelectedRawMaterial(undefined)
    const data = deleteRawMaterialStatus?.data?.data
    if (data?.code == '200') {
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
      refreshData()
    }
  }, [deleteRawMaterialStatus?.data])

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor material?'}
      description={'Material akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={selectedRawMaterial != undefined}
      onTouchOutside={() => setSelectedRawMaterial(undefined)}
      title={'Anda yakin ingin menghapus material ini?'}
      description={'Menghapus material akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const HeaderView = () => (
    <Header
      title="Material"
      headerRight={
        isAllowedToOrganizeMaterial
          ? () => (
              <TouchableOpacity onPress={goToCreatePage}>
                <Icon name={'add'} size={22} color={theme.colors.black} />
              </TouchableOpacity>
            )
          : undefined
      }
    />
  )

  const renderItem = ({item, index}: any) => (
    <RawMaterialCard
      isAllowedToOrganizePurchasement={isAllowedToOrganizePurchasement}
      isAllowedToOrganizeMaterial={isAllowedToOrganizeMaterial}
      rawMaterial={item}
      onPopupAddStock={() => onPopupAddStock(item)}
      onPopupDelete={() => onPopupDelete(item)}
      onPopupEdit={() => onPopupEdit(item)}
      onTap={() => goToRawMaterialDetail(item)}
      key={index}
    />
  )
  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ListFilter
        searchValue={query.search}
        onChangeSearch={handleSearch}
        onPressDownload={() => setModalExport(true)}
        sortOptions={sortOptions}
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
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus material' : 'Material berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
    </SafeAreaView>
  )
}

export default RawMaterialList

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    marginTop: 16,
  },
})
