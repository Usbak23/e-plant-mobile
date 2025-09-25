import {Button, Header, ListFilter, ModalAsk, Text} from '@components/index'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, StyleSheet, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import DetailInfo from './master-item-detail-info'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {ScrollView} from 'react-native-gesture-handler'
import ItemCard from '../item-list/item-card'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/core'
import Routes from '@app/presentations/navigation/Routes'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import {IItemRow} from '@app/models/eplant/Item'
import {IMasterItemRow} from '@app/models/eplant/MasterItem'
import {filterData} from '@app/presentations/utils/filterData'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {useIsAllowedToOrganizeToolsAndItems} from '@app/domain/states/user/hooks'

const MasterItemDetail = () => {
  const isAllowedToOrganizeToolsAndItems = useIsAllowedToOrganizeToolsAndItems()
  const routes: any = useRoute()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const itemParams = routes.params?.item
  const isFocused = useIsFocused()
  const [selected, setSelected] = useState<IItemRow | undefined>(undefined)
  const [search, setSearch] = useState('')

  const [isModalAskOpen, setModalAskOpen] = useState<boolean>(false)
  const {deleteMasterItemStatus, masterItemDetail} = useSelector((state: RootStateType) => state.masterItem)
  const [item, setItem] = useState(itemParams)
  const relatedList = masterItemDetail?.data?.items || []
  const relatedListFiltered = filterData(relatedList, search)

  const {deleteItemStatus} = useSelector((state: RootStateType) => state.item)

  const onPopupEdit = (item?: IMasterItemRow) => {
    //@ts-ignore
    navigation.navigate(Routes.MASTER_ITEM_FORM, {
      item,
    })
  }

  const onPopupDelete = (item?: IMasterItemRow) => {
    if (item) {
      setModalAskOpen(true)
    }
  }

  const handleDelete = () => {
    dispatch(actions.deleteMasterItem.request({loading: true, data: item?.id}))
    setModalAskOpen(false)
  }

  const handleItemDelete = () => {
    dispatch(actions.deleteItem.request({loading: true, data: selected?.id}))
    setModalAskOpen(false)
  }

  const onItemPopupDelete = (item?: IItemRow) => setSelected(item)

  const goToItemDetail = (item?: IItemRow) => {
    //@ts-ignore
    navigation.navigate(Routes.ITEM_DETAIL, {item})
  }

  useEffect(() => {
    if (masterItemDetail?.data?.id === item.id) {
      setItem(masterItemDetail?.data)
    }
  }, [masterItemDetail?.data])

  useEffect(() => {
    const error = deleteMasterItemStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteMasterItemStatus?.error])

  useEffect(() => {
    const data = deleteMasterItemStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Data berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteMasterItemStatus?.data])

  useEffect(() => {
    setSelected(undefined)
    const error = deleteItemStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteItemStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteItemStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Master Item berhasil dihapus')
    }
    dispatch(actions.getMasterItemDetail.request({loading: true, data: item?.id}))
  }, [deleteItemStatus?.data])

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getMasterItemDetail.request({loading: true, data: item?.id}))
    }
  }, [isFocused])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={isModalAskOpen}
      onTouchOutside={() => setModalAskOpen(false)}
      title={'Anda yakin ingin menghapus Master Item ini?'}
      description={'Menghapus Master Item akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalRelatedDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleItemDelete()}
      isDanger={true}
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus Item ini?'}
      description={'Menghapus Item akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const HeaderView = () => <Header title="Detail Master Item" />

  const RelatedHeaderView = () => (
    <View style={styles.relatedHeaderView}>
      <Text type="bold" size={fs(11)}>
        Item Terkait
      </Text>
      {isAllowedToOrganizeToolsAndItems && (
        <Button
          style={styles.addRelatedButton}
          onPress={() => {
            //@ts-ignore
            navigation.navigate(Routes.ITEM_FORM, {module: item})
          }}>
          <Text size={fs(10)} style={styles.addRelatedButtonText}>
            Tambah Item
          </Text>
        </Button>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView>
        <DetailInfo
          isAllowedToOrganizeToolsAndItems={isAllowedToOrganizeToolsAndItems}
          onPopupEdit={onPopupEdit}
          onPopupDelete={onPopupDelete}
          item={item}
        />
        <View style={{marginBottom: 8}}>
          <RelatedHeaderView />
          <ListFilter searchValue={search} onChangeSearch={text => setSearch(text)} />
        </View>
        {relatedListFiltered?.length > 0 ? (
          relatedListFiltered?.map((e: IItemRow, index: number) => (
            <ItemCard
              isAllowedToOrganizeToolsAndItems={isAllowedToOrganizeToolsAndItems}
              onTap={goToItemDetail}
              onDelete={onItemPopupDelete}
              item={e}
              module={item}
              key={index}
            />
          ))
        ) : (
          <EmptyList />
        )}
      </ScrollView>
      <ModalDelete />
      <ModalRelatedDelete />
    </SafeAreaView>
  )
}

export default MasterItemDetail

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  relatedHeaderView: {
    marginBottom: 6,
    marginHorizontal: 22,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addRelatedButton: {
    backgroundColor: theme.colors.black,
  },
  addRelatedButtonText: {
    fontSize: fs(10),
    color: theme.colors.white,
  },
})
