import {theme} from '@app/presentations/utils/styles'
import {Header, ListFilter, ModalAsk, ModalInfo, SortPopup} from '@app/presentations/_shared-components'
import {useIsFocused, useNavigation} from '@react-navigation/core'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, Keyboard, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native'
import {MenuOptions} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/MaterialIcons'
import BlockCard from './block-card'
import Routes from '@app/presentations/navigation/Routes'
import {BlockSortOptions} from './sort-options'
import {actions, RootStateType} from '@domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {IBlockRow} from '@app/models/eplant/Block'
import {IRSBlock} from '@app/domain/states/block/reducer'
import {IEffectPayload} from '@app/domain/states/types'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import System from '@app/domain/services/System'
import {writeFile} from '@app/presentations/utils/writeFile'
import {useIsAllowedToOrganizeBlock, useIsAllowedToSeeBlock} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

interface IBlockListProps {}

const BlockList: React.FC<IBlockListProps> = props => {
  const isAllowedToOrganizeBlock = useIsAllowedToOrganizeBlock()
  const isAllowedToSeeBlock = useIsAllowedToSeeBlock()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const [selectedBlock, setSelectedBlock] = useState<IBlockRow | undefined>(undefined)

  const limit = 10
  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    search: '',
  })

  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const getData = useCallback(data => {
    dispatch(
      actions.getBlocksList.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const [modalExport, setModalExport] = useState(false)
  const {blockList}: IRSBlock = useSelector((state: RootStateType) => state?.block || {})
  const {deleteBlockStatus} = useSelector((state: RootStateType) => state.block)

  const {data: lists, loading}: IEffectPayload = blockList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const handleSort = (value: string) => {
    setQuery({...query, sort: value})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, sort: value, page: 1, limit})
    }, 400)
  }

  const handleSearch = (search: string) => {
    setQuery({...query, search: search})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search, page: 1, limit})
    }, 400)
  }

  const handleDelete = async () => {
    if (selectedBlock) {
      dispatch(actions.deleteBlock.request({loading: true, data: selectedBlock.id}))
    }
  }

  //@ts-ignore
  const goToBlockDetail = item => navigation.navigate(Routes.BLOCK_DETAIL, {item})
  //@ts-ignore
  const goToBlockCreate = () => navigation.navigate(Routes.BLOCK_FORM)

  const refreshData = useCallback(() => {
    getData({...query, page: 1, limit})
  }, [query])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({...query, page: nextPage})
  }

  const onPopupEdit = (item?: IBlockRow) => {
    if (item) {
      //@ts-ignore
      navigation.navigate(Routes.BLOCK_FORM, {
        item: item,
      })
    }
  }

  const onPopupDelete = (item?: IBlockRow) => setSelectedBlock(item)

  const handleExport = async () => {
    try {
      setModalExport(false)
      if (!isAllowedToSeeBlock) {
        showErrorToast('Anda tidak memiliki hak akses untuk mengekspor data')
        return
      }
      const response = await System.instance.blockService.exportBlock()
      const res = await writeFile(response.data.toString(), '_block.csv')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Data blok berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
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
    const error = deleteBlockStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelectedBlock(undefined)
  }, [deleteBlockStatus?.error])

  useEffect(() => {
    setSelectedBlock(undefined)
    const data = deleteBlockStatus?.data?.data
    if (data?.code == '200') {
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
      refreshData()
    }
  }, [deleteBlockStatus?.data])

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor blok?'}
      description={'Data divisi akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={selectedBlock != undefined}
      onTouchOutside={() => setSelectedBlock(undefined)}
      title={'Anda yakin ingin menghapus blok ini?'}
      description={'Menghapus blok akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const HeaderView = () => (
    <Header
      title="Blok"
      headerRight={
        isAllowedToOrganizeBlock
          ? () => (
              <TouchableOpacity onPress={goToBlockCreate}>
                <Icon name={'add'} size={22} color={theme.colors.black} />
              </TouchableOpacity>
            )
          : undefined
      }
    />
  )

  const sortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={BlockSortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const renderItem = ({item, index}: any) => (
    <BlockCard
      isAllowedToOrganizeBlock={isAllowedToOrganizeBlock}
      onPopupDelete={onPopupDelete}
      onPopupEdit={onPopupEdit}
      onTap={() => goToBlockDetail(item)}
      key={index}
      item={item}
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
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
          ) : undefined
        }
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus blok' : 'Blok berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
    </SafeAreaView>
  )
}

export default BlockList

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    marginTop: 16,
  },
})
