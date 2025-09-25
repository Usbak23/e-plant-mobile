import {theme} from '@app/presentations/utils/styles'
import {Header, ListFilter, ModalAsk, ModalInfo, SortPopup} from '@app/presentations/_shared-components'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, Keyboard, RefreshControl, SafeAreaView, StyleSheet} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DivisionCard from './division-card'
import {MenuOptions} from 'react-native-popup-menu'
import {useNavigation} from '@react-navigation/core'
import Routes from '@app/presentations/navigation/Routes'
import {useIsFocused} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {IRSDivision} from '@app/domain/states/division/reducer'
import {actions, RootStateType} from '@domain/states/store'
import {IEffectPayload} from '@app/domain/states/types'
import {SortOptions} from './sort-options'
import {Division} from '@app/models/eplant/Division'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import EmptyList from '@app/presentations/_shared-components/Empty'
import System from '@app/domain/services/System'
import {writeFile} from '@app/presentations/utils/writeFile'
import {
  useCurrentUserInfo,
  useIsAllowedToOrganizeDivision,
  useIsAllowedToSeeDivision,
  useManagedDivisions,
} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const DivisionList = () => {
  const user = useCurrentUserInfo()
  const managedDivisions = useManagedDivisions()
  const [workingDivisions, setWorkingDivisions] = useState(managedDivisions)
  const isAllowedToOrganizeDivision = useIsAllowedToOrganizeDivision()
  const isAllowedToSeeDivision = useIsAllowedToSeeDivision()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const [selectedDivision, setSelectedDivision] = useState<Division | undefined>(undefined)

  const limit = 10
  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    search: '',
    name: '',
  })

  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const [modalExport, setModalExport] = useState(false)
  const {divisionList}: IRSDivision = useSelector((state: RootStateType) => state?.division || {})
  const {deleteDivisionStatus} = useSelector((state: RootStateType) => state.division)

  const {data: lists, loading}: IEffectPayload = divisionList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const getData = useCallback(data => {
    dispatch(
      actions.getDivisionLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleSort = (value: string) => {
    setQuery({...query, sort: value})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, sort: value, page: 1, limit})
    }, 400)
  }

  const handleSearch = (search: string) => {
    setQuery({...query, name: search})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, name: search, page: 1, limit})
    }, 400)
  }

  const handleDelete = async () => {
    if (selectedDivision) {
      dispatch(actions.deleteDivision.request({loading: true, data: selectedDivision.id}))
    }
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

  const onPopupEdit = (division?: Division) => {
    if (division) {
      //@ts-ignore
      navigation.navigate(Routes.DIVISION_FORM, {
        item: division,
      })
    }
  }

  const onPopupDelete = (division?: Division) => {
    setSelectedDivision(division)
  }

  useEffect(() => {
    if (isFocused) {
      refreshData()
      dispatch(actions.getCurrentUser.request({loading: true}))
    }
  }, [isFocused])

  useEffect(() => {
    if (user) {
      const workings = user?.userDivisions || []
      const managedDivisions: {id: string; name: string}[] = []
      workings.forEach((w: any) => {
        const isExists = managedDivisions.find(d => d.id == w.division?.id)
        if (!isExists) {
          managedDivisions.push({id: w.division?.id, name: w.division?.name})
        }
      })
      setWorkingDivisions(managedDivisions)
    }
  }, [user?.userDivisions])

  useEffect(() => {
    const error = deleteDivisionStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelectedDivision(undefined)
  }, [deleteDivisionStatus?.error])

  useEffect(() => {
    setSelectedDivision(undefined)
    const data = deleteDivisionStatus?.data?.data
    if (data?.code == '200') {
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
      refreshData()
    }
  }, [deleteDivisionStatus?.data])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={selectedDivision != undefined}
      onTouchOutside={() => setSelectedDivision(undefined)}
      title={'Anda yakin ingin menghapus divisi ini?'}
      description={'Menghapus divisi akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const handleExport = async () => {
    try {
      setModalExport(false)
      if (!isAllowedToSeeDivision) {
        showErrorToast('Anda tidak memiliki hak akses untuk mengekspor data')
        return
      }
      const response = await System.instance.divisionService.exportDivision()
      const res = await writeFile(response.data.toString(), '_division.csv')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Data divisi berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
          path: res,
        })
        .then(res => {})
        .catch(e => {})
      showSuccessToast('Berhasi diekspor. Lihat di ' + res)
    } catch (error: any) {
      showErrorToast(error?.message || 'Gagal saat mengekspor csv')
    }
  }

  const HeaderView = () => (
    <Header
      title={'Divisi'}
      headerRight={
        isAllowedToOrganizeDivision
          ? () => (
              <TouchableOpacity onPress={() => goToDivisionCreate()}>
                <Icon name={'add'} size={22} color={theme.colors.black} />
              </TouchableOpacity>
            )
          : undefined
      }
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor divisi?'}
      description={'Data divisi akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  const renderItem = ({item, index}: any) => {
    return (
      <DivisionCard
        isAllowedToOrganizeDivision={
          isAllowedToOrganizeDivision && workingDivisions.find(div => div.id == item.id) != undefined
        }
        onPopupDelete={onPopupDelete}
        onPopupEdit={onPopupEdit}
        onTap={() => goToDivisionDetail(item)}
        key={index}
        division={item}
      />
    )
  }

  const goToDivisionDetail = (item: Division) => {
    //@ts-ignore
    navigation.navigate(Routes.DIVISION_DETAIL, {
      division: item,
    })
  }

  const goToDivisionCreate = () => {
    //@ts-ignore
    navigation.navigate(Routes.DIVISION_FORM)
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
  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ListFilter
        searchValue={query.name}
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
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus divisi' : 'Divisi berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
    </SafeAreaView>
  )
}

export default DivisionList

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    marginTop: 16,
  },
})
