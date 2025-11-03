import { Button, Header, ModalAsk, ModalInfo, Text } from '@app/presentations/_shared-components'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Keyboard, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import DivisionDetailInfo from './division-detail-info'
import { RFValue as fs } from 'react-native-responsive-fontsize'
import { ScrollView } from 'react-native-gesture-handler'
import BlockCard from '../block-list/block-card'
import { Division } from '@app/models/eplant/Division'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/core'
import Routes from '@app/presentations/navigation/Routes'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@domain/states/store'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useBlocksByDivisionFull } from '@app/domain/states/block/hooks'
import { IBlockRow } from '@app/models/eplant/Block'
import {
  useIsAllowedToOrganizeBlock,
  useIsAllowedToOrganizeDivision,
  useIsAllowedToSeeBlock,
  useIsAllowedToSeeOrganization,
  useManagedDivisions,
} from '@app/domain/states/user/hooks'
import { IRSBlock } from '@app/domain/states/block/reducer'
import { IEffectPayload } from '@app/domain/states/types'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import EmptyList from '@app/presentations/_shared-components/Empty'

let debounceSearch: NodeJS.Timeout


const DivisionDetail = () => {
  const managedDivisions = useManagedDivisions()
  const isAllowedToOrganizeBlock = useIsAllowedToOrganizeBlock()
  const isAllowedToSeeBlock = useIsAllowedToSeeBlock()
  const isAllowedToOrganizeDivision = useIsAllowedToOrganizeDivision()
  const routes: any = useRoute()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const division = routes.params?.division
  const isFocused = useIsFocused()
  const [selectedBlock, setSelectedBlock] = useState<IBlockRow | undefined>(undefined)

  const [isModalAskOpen, setModalAskOpen] = useState<boolean>(false)
  const [modalInfoBlock, setModalInfoBlock] = useState<{ isOpen: boolean; isDanger: boolean; message: string }>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const limit = 10
  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    search: '',
    division: division?.id
  })

  const getData = useCallback(data => {
    dispatch(
      actions.getBlocksList.request({
        loading: true,
        data,
      }),
    )
  }, [])
  const { deleteDivisionStatus } = useSelector((state: RootStateType) => state.division)
  const [item, setItem] = useState(division)
  const divisionDetail = useSelector((state: RootStateType) => state.division.divisionDetail)

  const { deleteBlockStatus } = useSelector((state: RootStateType) => state.block)

  const { blockList }: IRSBlock = useSelector((state: RootStateType) => state?.block || {})
  const { data: lists, loading }: IEffectPayload = blockList || { loading: false }
  const { docs, hasNextPage, nextPage, page } = lists || { docs: [], page: 1 }

  const onPopupEdit = (division?: Division) => {
    //@ts-ignore
    navigation.navigate(Routes.DIVISION_FORM, {
      item: division,
    })
  }

  const onPopupDelete = (division?: Division) => {
    if (division) {
      setModalAskOpen(true)
    }
  }

  const handleDelete = () => {
    dispatch(actions.deleteDivision.request({ loading: true, data: item?.id }))
    setModalAskOpen(false)
  }

  const handleBlockDelete = () => {
    dispatch(actions.deleteBlock.request({ loading: true, data: selectedBlock?.id }))
    setModalAskOpen(false)
  }

  const handleSearch = (search: string) => {
    setQuery({ ...query, search: search })
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({ ...query, search, page: 1, limit })
    }, 400)
  }

  const refreshData = useCallback(() => {
    getData({ ...query, page: 1, limit })
  }, [query])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({ ...query, page: nextPage, limit })
  }

  const onBlockPopupEdit = (item?: IBlockRow) => {
    if (item) {
      //@ts-ignore
      navigation.navigate(Routes.BLOCK_FORM, {
        item: item,
        withDivision: division,
      })
    }
  }

  const onBlockPopupDelete = (item?: IBlockRow) => setSelectedBlock(item)

  const goToBlockDetail = (item?: IBlockRow) => {
    //@ts-ignore
    navigation.navigate(Routes.BLOCK_DETAIL, {
      item: item,
    })
  }

  const getAllBlock = () =>
    dispatch(
      actions.getAllBlock.request({
        loading: true,
        data: {
          division: item.id,
        },
      }),
    )

  useEffect(() => {
    if (divisionDetail?.data?.id === item.id) {
      setItem(divisionDetail?.data)
    }
  }, [divisionDetail?.data])

  useEffect(() => {
    const error = deleteDivisionStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteDivisionStatus?.error])

  useEffect(() => {
    const data = deleteDivisionStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Data berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteDivisionStatus?.data])

  useEffect(() => {
    setSelectedBlock(undefined)
    const error = deleteBlockStatus?.error
    if (error) {
      setModalInfoBlock({
        ...modalInfoBlock,
        isDanger: true,
        isOpen: true,
        message: error?.message || 'Tidak dapat menghapus blok',
      })
      // showErrorToast(error.message)
    }
  }, [deleteBlockStatus?.error])

  useEffect(() => {
    setSelectedBlock(undefined)
    const data = deleteBlockStatus?.data?.data
    if (data?.code == '200') {
      setModalInfoBlock({
        ...modalInfoBlock,
        isDanger: false,
        isOpen: true,
        message: '',
      })
      // showSuccessToast('Blok berhasil dihapus')
    }
    getAllBlock()
  }, [deleteBlockStatus?.data])

  useEffect(() => {
    if (isFocused) {
      refreshData()
      getAllBlock()
      dispatch(actions.detailDivision.request({ loading: true, data: item?.id }))
    }
  }, [isFocused])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={isModalAskOpen}
      onTouchOutside={() => setModalAskOpen(false)}
      title={'Anda yakin ingin menghapus divisi ini?'}
      description={'Menghapus divisi akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalBlockDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleBlockDelete()}
      isDanger={true}
      isOpen={selectedBlock != undefined}
      onTouchOutside={() => setSelectedBlock(undefined)}
      title={'Anda yakin ingin menghapus blok ini?'}
      description={'Menghapus blok akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const HeaderView = () => <Header title="Detail Divisi" />

  const BlockHeaderView = () => (
    <View style={styles.blockHeaderView}>
      {isAllowedToSeeBlock ? (
        <Text type="bold" size={fs(11)}>
          Blok Terkait
        </Text>
      ) : (
        <View />
      )}

      {isAllowedToOrganizeBlock && managedDivisions.find(div => div.id == item?.id) != undefined ? (
        <Button
          style={styles.addBlockButton}
          onPress={() => {
            //@ts-ignore
            navigation.navigate(Routes.BLOCK_FORM, {
              // item: item,
              withDivision: division,
            })
          }}>
          <Text size={fs(10)} style={styles.addBlockButtonText}>
            Tambah blok
          </Text>
        </Button>
      ) : (
        <View />
      )}
    </View>
  )

  const renderItem = ({ item, index }: any) => {
    return (
      <BlockCard
        isAllowedToOrganizeBlock={isAllowedToOrganizeBlock}
        onTap={goToBlockDetail}
        onPopupDelete={onBlockPopupDelete}
        onPopupEdit={onBlockPopupEdit}
        item={item}
        key={index}
      />
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <FlatList
        ListHeaderComponent={<View style={{ flex: 1 }}>
          <DivisionDetailInfo
            isAllowedToOrganizeDivision={
              isAllowedToOrganizeDivision && managedDivisions.find(div => div.id == item?.id) != undefined
            }
            onPopupEdit={onPopupEdit}
            onPopupDelete={onPopupDelete}
            division={item}
          />
          <BlockHeaderView />
        </View>}
        onScrollBeginDrag={Keyboard.dismiss}
        data={docs?.length > 0 && isAllowedToSeeBlock ? docs : []}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        initialNumToRender={1}
        onEndReachedThreshold={0.1}
        onEndReached={getNextPage}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={{ paddingBottom: 50, }}

      />
      <ModalDelete />
      <ModalBlockDelete />
      <ModalInfo
        title={modalInfoBlock.isDanger ? 'Anda tidak dapat menghapus blok ini' : 'Blok berhasil dihapus'}
        description={modalInfoBlock.isDanger ? modalInfoBlock.message : undefined}
        isDanger={modalInfoBlock.isDanger}
        isOpen={modalInfoBlock.isOpen}
        onTouchOutside={() => setModalInfoBlock({ ...modalInfoBlock, isOpen: false })}
        onPositiveButtonTap={() => setModalInfoBlock({ ...modalInfoBlock, isOpen: false })}
      />
    </SafeAreaView>
  )
}

export default DivisionDetail

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  blockHeaderView: {
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addBlockButton: {
    backgroundColor: theme.colors.black,
  },
  addBlockButtonText: {
    fontSize: fs(10),
    color: theme.colors.white,
  },
})
