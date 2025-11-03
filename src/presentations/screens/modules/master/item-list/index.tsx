import React, {useCallback, useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {StyleSheet, FlatList, SafeAreaView, RefreshControl, View, Keyboard} from 'react-native'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import ModalInfo from '@components/ModalInfo'
import Routes from '@app/presentations/navigation/Routes'
import Card from './item-card'
import {IRSItem} from '@domain/states/item/reducer'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {SortOptions} from './sort-options'
import {ListFilterAlt, Loader, SelectInput, SortPopup, Text} from '@components/index'
import {MenuOptions} from 'react-native-popup-menu'
import ModalAsk from '@components/ModalAsk'
import {IItemRow, typeItem} from '@models/eplant/Item'
import {showErrorToast, showInfoToast, showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import {writeFile} from '@app/presentations/utils/writeFile'
import {useIsAllowedToOrganizeToolsAndItems} from '@app/domain/states/user/hooks'
import {REQUEST_TYPE} from '@app/models/eplant/Request'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useWatch} from 'react-hook-form'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let schema = yup.object().shape({
  typeItem: yup.string().required('Isi tipe permintaan terlebih dahulu'),
})
const TYPE_ITEMS: typeItem[] = ['Kendaraan', 'Peralatan', 'Perlengkapan']
const categoryItems = TYPE_ITEMS.map(e => ({label: e, value: e}))

let debounceSearch: NodeJS.Timeout
const ItemList = forwardRef((props, ref) => {
  const isAllowedToOrganizeToolsAndItems = useIsAllowedToOrganizeToolsAndItems()
  const resolver = useYupValidationResolver(schema)
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const limit = 10

  const {
    handleSubmit,
    control,
    setValue,
    formState: {errors, isValid, isDirty},
    reset,
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      typeItem: props?.itemType || 'Kendaraan',
    },
  })
  const [query, setQuery] = useState({
    sort: '',
    search: '',
    typeItem: props?.itemType || 'Kendaraan',
  })
  const [isDownloading, setDownloading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<IItemRow>()
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {itemList, deleteItemStatus, formItemStatus}: IRSItem = useSelector((state: RootStateType) => state?.item || {})
  const {data: lists, loading}: IEffectPayload = itemList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const typeRequestWatcher = useWatch({
    control: control,
    name: 'typeItem',
    defaultValue: control._defaultValues.typeItem || '',
  })

  const getData = useCallback(data => {
    dispatch(
      actions.getItemLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleType = (v: string) => {
    props.handleType && props.handleType(v)
    setQuery({...query, typeItem: v})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, typeItem: v, page: 1, limit})
    }, 400)
  }

  const handleSearch = (name: string) => {
    setQuery({...query, search: name})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search: name, page: 1, limit})
    }, 400)
  }

  const handleDelete = () => {
    dispatch(actions.deleteItem.request({loading: true, data: selectedItem?.id}))
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
    navigation.navigate(Routes.ITEM_FORM)
    // navigation.navigate(Routes.ITEM_DETAIL_TRANSPORTATION)
  }

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      const response = await System.instance.itemService.exportItem()
      const res = await writeFile(response.data.toString(), '_item.csv')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Data Item Alat berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
          path: res,
        })
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
      title={'Anda yakin ingin menghapus Item?'}
      description={'Menghapus Item akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor Item?'}
      description={'Data Item akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  const onTap = (i: IItemRow) => {
    if (i?.typeItem === 'Kendaraan') {
      navigation.navigate(Routes.ITEM_DETAIL_TRANSPORTATION, {item: i})
      return
    }
    showInfoToast('Tipe item ini tidak memiliki halaman detail')
  }

  useEffect(() => {
    const error = deleteItemStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelectedItem(undefined)
  }, [deleteItemStatus?.error])

  useEffect(() => {
    setSelectedItem(undefined)
    const data = deleteItemStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteItemStatus?.data])

  useEffect(() => {
    const data = formItemStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
    }
  }, [formItemStatus?.data])

  useEffect(() => {
    setQuery({...query, typeItem: typeRequestWatcher})
    getData({...query, typeItem: typeRequestWatcher, page: 1, limit})
  }, [typeRequestWatcher])

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
        ListHeaderComponent={
          <View style={{marginHorizontal: 16}}>
            {/* <ListFilterAlt
              disableMargin={true}
              style={styles.filter}
              // searchValue={searchValue}
              onChangeSearch={v => {}}
              onPressFilter={() => {}}
              // alts={AltOptions}
            /> */}
            <SelectInput
              value={query?.typeItem}
              isRequired
              control={control}
              name="typeItem"
              hideLabel={true}
              placeholder="Pilih Tipe Permintaan"
              items={categoryItems}
              onChange={v => handleType(v)}
            />
          </View>
        }
        ListEmptyComponent={EmptyList}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        refreshControl={
          page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
          ) : undefined
        }
        renderItem={props => (
          <Card
            isAllowedToOrganizeToolsAndItems={isAllowedToOrganizeToolsAndItems}
            isShowAll
            onTap={onTap}
            {...props}
            onDelete={item => setSelectedItem(item)}
          />
        )}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus item ini' : 'Item berhasil dihapus'}
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

export default ItemList
