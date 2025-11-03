import React, {useCallback, useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {StyleSheet, FlatList, SafeAreaView, RefreshControl, Keyboard} from 'react-native'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import ModalInfo from '@components/ModalInfo'
import Routes from '@app/presentations/navigation/Routes'
import Card from './master-item-card'
import {IRSMasterItem} from '@domain/states/master-item/reducer'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {SortOptions} from './sort-options'
import {Loader, SortPopup} from '@components/index'
import {MenuOptions} from 'react-native-popup-menu'
import ModalAsk from '@components/ModalAsk'
import {IMasterItemRow} from '@models/eplant/MasterItem'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import {writeFile} from '@app/presentations/utils/writeFile'
import {useIsAllowedToOrganizeToolsAndItems} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout
const MasterItemList = forwardRef((_, ref) => {
  const isAllowedToOrganizeToolsAndItems = useIsAllowedToOrganizeToolsAndItems()
  const navigation: any = useNavigation()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const limit = 10
  const [query, setQuery] = useState({
    sort: '',
    name: '',
  })
  const [isDownloading, setDownloading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<IMasterItemRow>()
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {masterItemList, deleteMasterItemStatus, formMasterItemStatus}: IRSMasterItem = useSelector(
    (state: RootStateType) => state?.masterItem || {},
  )
  const {data: lists, loading}: IEffectPayload = masterItemList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const getData = useCallback(data => {
    dispatch(
      actions.getMasterItemLists.request({
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
    dispatch(actions.deleteMasterItem.request({loading: true, data: selectedItem?.id}))
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
    navigation.navigate(Routes.MASTER_ITEM_FORM)
  }

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      const response = await System.instance.masterItemService.exportMasterItem()
      const res = await writeFile(response.data.toString(), '_master-item.csv')
      notifications
        .onDisplayNotificationExportFile(
          c.NOTIF_TITLE,
          'Data Master alat berhasil diekspor',
          c.EXPORT_NOTIFICATION_ID,
          {
            path: res,
          },
        )
        .then(res => {})
        .catch(e => {})
      showSuccessToast('Success exported at ' + res)
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
      title={'Anda yakin ingin menghapus Master Item?'}
      description={'Menghapus Master Item akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor Master Item?'}
      description={'Data Master Item akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  useEffect(() => {
    const error = deleteMasterItemStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelectedItem(undefined)
  }, [deleteMasterItemStatus?.error])

  useEffect(() => {
    setSelectedItem(undefined)
    const data = deleteMasterItemStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteMasterItemStatus?.data])

  useEffect(() => {
    const data = formMasterItemStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
    }
  }, [formMasterItemStatus?.data])

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
            isShowAll
            onTap={item => navigation.navigate(Routes.MASTER_ITEM_DETAIL, {item})}
            onDelete={item => setSelectedItem(item)}
          />
        )}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus master item ini' : 'Master Item berhasil dihapus'}
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

export default MasterItemList
