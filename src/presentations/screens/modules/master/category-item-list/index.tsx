import React, {useCallback, useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {StyleSheet, FlatList, SafeAreaView, RefreshControl, Keyboard} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import ModalInfo from '@components/ModalInfo'
import Routes from '@app/presentations/navigation/Routes'
import Card from './category-item-card'
import {IRSCategoryItem} from '@domain/states/category-item/reducer'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {SortOptions} from './sort-options'
import {Loader, SortPopup} from '@components/index'
import {MenuOptions} from 'react-native-popup-menu'
import ModalAsk from '@components/ModalAsk'
import {ICategoryItemRow} from '@models/eplant/CategoryItem'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import {writeFile} from '@app/presentations/utils/writeFile'
import {useIsAllowedToOrganizeToolsAndItems} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout
const CategoryItemList = forwardRef((_, ref) => {
  const isAllowedToOrganizeToolsAndItems = useIsAllowedToOrganizeToolsAndItems()
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const limit = 10
  const [query, setQuery] = useState({
    sort: '',
    name: '',
  })
  const [isDownloading, setDownloading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ICategoryItemRow>()
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {categoryItemList, deleteCategoryItemStatus, formCategoryItemStatus}: IRSCategoryItem = useSelector(
    (state: RootStateType) => state?.categoryItem || {},
  )
  const {data: lists, loading}: IEffectPayload = categoryItemList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const getData = useCallback(data => {
    dispatch(
      actions.getCategoryItemLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleSearch = (name: string) => {
    setQuery({...query, name})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, name, page: 1, limit})
    }, 400)
  }

  const handleDelete = () => {
    dispatch(actions.deleteCategoryItem.request({loading: true, data: selectedItem?.id}))
    setSelectedItem(undefined)
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

  const handleSort = (sort: string) => {
    const newState = {...query, sort}
    setQuery(newState)
    getData({...newState, page: 1, limit})
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
    navigation.navigate(Routes.CATEGORY_ITEM_FORM)
  }

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      const response = await System.instance.categoryItemService.exportCategoryItem()
      const res = await writeFile(response.data.toString(), '_category-item.csv')
      notifications
        .onDisplayNotificationExportFile(
          c.NOTIF_TITLE,
          'Data Kategori Alat berhasil diekspor',
          c.EXPORT_NOTIFICATION_ID,
          {
            path: res,
          },
        )
        .then(res => {})
        .catch(e => {})
      showSuccessToast('Berhasil diekspor di ' + res)
    } catch (error: any) {
      showErrorToast(error?.message || 'Gagal saat mengekspor csv')
    } finally {
      setDownloading(false)
    }
  }

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger
      isOpen={selectedItem != undefined}
      onTouchOutside={() => setSelectedItem(undefined)}
      title={'Anda yakin ingin menghapus Kategori Item?'}
      description={'Menghapus Kategori Item akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor Kategori Item?'}
      description={'Data Kategori Item akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  useEffect(() => {
    const error = deleteCategoryItemStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelectedItem(undefined)
  }, [deleteCategoryItemStatus?.error])

  useEffect(() => {
    setSelectedItem(undefined)
    const data = deleteCategoryItemStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteCategoryItemStatus?.data])

  useEffect(() => {
    const data = formCategoryItemStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
    }
  }, [formCategoryItemStatus?.data])

  useImperativeHandle(ref, () => ({
    showModalExport: () => setModalExport(true),
    handleSearch,
    sortOptions,
    refreshData,
    onAdd,
  }))

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        onScrollBeginDrag={Keyboard.dismiss}
        data={docs}
        style={styles.list}
        keyExtractor={item => item.id}
        initialNumToRender={limit}
        onEndReachedThreshold={0.5}
        onEndReached={getNextPage}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
          ) : undefined
        }
        renderItem={props => (
          <Card
            isAllowedToOrganizeToolsAndItems={isAllowedToOrganizeToolsAndItems}
            {...props}
            onDelete={item => setSelectedItem(item)}
          />
        )}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus kategori item ini' : 'Kategori Item berhasil dihapus'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {marginTop: 0},
  filter: {marginTop: 8},
})

export default CategoryItemList
