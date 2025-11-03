import {Button, Header, ListFilter, ModalAsk, Text} from '@components/index'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, StyleSheet, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import DetailInfo from './category-item-detail-info'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {ScrollView} from 'react-native-gesture-handler'
import MasterItemCard from '../master-item-list/master-item-card'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/core'
import Routes from '@app/presentations/navigation/Routes'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import {ICategoryItemRow} from '@app/models/eplant/CategoryItem'
import {IMasterItemRow} from '@app/models/eplant/MasterItem'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {filterData} from '@app/presentations/utils/filterData'
import {useIsAllowedToOrganizeToolsAndItems} from '@app/domain/states/user/hooks'

const CategoryItemDetail = () => {
  const isAllowedToOrganizeToolsAndItems = useIsAllowedToOrganizeToolsAndItems()
  const routes: any = useRoute()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const itemParams = routes.params?.item
  const isFocused = useIsFocused()
  const [selected, setSelected] = useState<IMasterItemRow | undefined>(undefined)
  const [search, setSearch] = useState('')

  const [isModalAskOpen, setModalAskOpen] = useState<boolean>(false)
  const {deleteCategoryItemStatus, categoryItemDetail} = useSelector((state: RootStateType) => state.categoryItem)
  const [item, setItem] = useState(itemParams)
  const relatedList = categoryItemDetail?.data?.masterItems || []
  const relatedListFiltered = filterData(relatedList, search)

  const {deleteMasterItemStatus} = useSelector((state: RootStateType) => state.masterItem)

  const onPopupEdit = (item?: ICategoryItemRow) => {
    //@ts-ignore
    navigation.navigate(Routes.CATEGORY_ITEM_FORM, {
      item,
    })
  }

  const onPopupDelete = (item?: ICategoryItemRow) => {
    if (item) {
      setModalAskOpen(true)
    }
  }

  const handleDelete = () => {
    dispatch(actions.deleteCategoryItem.request({loading: true, data: item?.id}))
    setModalAskOpen(false)
  }

  const handleMasterItemDelete = () => {
    dispatch(actions.deleteMasterItem.request({loading: true, data: selected?.id}))
    setModalAskOpen(false)
  }

  const onMasterItemPopupDelete = (item?: IMasterItemRow) => setSelected(item)

  const goToMasterItemDetail = (item?: IMasterItemRow) => {
    //@ts-ignore
    navigation.navigate(Routes.MASTER_ITEM_DETAIL, {item})
  }

  useEffect(() => {
    if (categoryItemDetail?.data?.id === item.id) {
      setItem(categoryItemDetail?.data)
    }
  }, [categoryItemDetail?.data])

  useEffect(() => {
    const error = deleteCategoryItemStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteCategoryItemStatus?.error])

  useEffect(() => {
    const data = deleteCategoryItemStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Data berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteCategoryItemStatus?.data])

  useEffect(() => {
    setSelected(undefined)
    const error = deleteMasterItemStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteMasterItemStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteMasterItemStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Master Item berhasil dihapus')
      dispatch(actions.getCategoryItemDetail.request({loading: true, data: item?.id}))
    }
  }, [deleteMasterItemStatus?.data])

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getCategoryItemDetail.request({loading: true, data: item?.id}))
    }
  }, [isFocused])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={isModalAskOpen}
      onTouchOutside={() => setModalAskOpen(false)}
      title={'Anda yakin ingin menghapus Category Item ini?'}
      description={'Menghapus Category Item akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalRelatedDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleMasterItemDelete()}
      isDanger={true}
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus Master Item ini?'}
      description={'Menghapus Master Item akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const HeaderView = () => <Header title="Detail Item Kategori" />

  const RelatedHeaderView = () => (
    <View style={styles.relatedHeaderView}>
      <Text type="bold" size={fs(11)}>
        Master Item Terkait
      </Text>
      {isAllowedToOrganizeToolsAndItems && (
        <Button
          style={styles.addRelatedButton}
          onPress={() => {
            //@ts-ignore
            navigation.navigate(Routes.MASTER_ITEM_FORM, {module: item})
          }}>
          <Text size={fs(10)} style={styles.addRelatedButtonText}>
            Tambah Master Item
          </Text>
        </Button>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <HeaderView />
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
          relatedListFiltered?.map((e: IMasterItemRow, index: number) => (
            <MasterItemCard
              isAllowedToOrganizeToolsAndItems={isAllowedToOrganizeToolsAndItems}
              onTap={goToMasterItemDetail}
              onDelete={onMasterItemPopupDelete}
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

export default CategoryItemDetail

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
