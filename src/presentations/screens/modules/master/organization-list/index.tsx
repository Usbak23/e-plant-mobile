import React, {useCallback, useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  PermissionsAndroid,
  Platform,
  Keyboard,
} from 'react-native'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import Header from '@components/Header'
import ModalInfo from '@components/ModalInfo'
import Routes from '@app/presentations/navigation/Routes'
import Entypo from 'react-native-vector-icons/Entypo'
import Card from './organization-card'
import ListFilter from '@components/ListFilter'
import {IRSOrganization} from '@domain/states/organization/reducer'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {SortOptions} from './sort-options'
import {Loader, SortPopup} from '@components/index'
import {MenuOptions} from 'react-native-popup-menu'
import ModalAsk from '@components/ModalAsk'
import {IOrganizationRow} from '@models/eplant/Organization'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import RNFS from 'react-native-fs'
import {writeFile} from '@app/presentations/utils/writeFile'
import {
  useIsAllowedToOrganizationOrganization,
  useIsAllowedToSeeOrganization,
  useManagedOrganizations,
} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

export default function OrganizationList() {
  const managedOrganizations = useManagedOrganizations()
  const isAllowedToOrganizeOrganization = useIsAllowedToOrganizationOrganization()
  const isAllowedToSeeOrganization = useIsAllowedToSeeOrganization()
  const navigation: any = useNavigation()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const limit = 10
  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    search: '',
  })
  const [isDownloading, setDownloading] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<IOrganizationRow>()
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {organizationList, deleteOrganizationStatus, formOrganizationStatus}: IRSOrganization = useSelector(
    (state: RootStateType) => state?.organization || {},
  )
  const {data: lists, loading}: IEffectPayload = organizationList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const getData = useCallback(data => {
    dispatch(
      actions.getOrganizationLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleSearch = (search: string) => {
    setQuery({...query, search})
    // TODO: PLease move debounce to epics
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search, page: 1, limit})
    }, 400)
  }

  const handleDelete = () => {
    dispatch(actions.deleteOrganization.request({loading: true, data: selectedOrganization?.id}))
    setSelectedOrganization(undefined)
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
    navigation.navigate(Routes.ORGANIZATION_FORM)
  }

  const handleExport = async () => {
    setModalExport(false)
    if (!isAllowedToSeeOrganization) {
      showErrorToast('Anda tidak memiliki hak akses untuk mengekpor data')
      return
    }
    setDownloading(true)
    try {
      const response = await System.instance.organizationService.exportOrganization()
      const res = await writeFile(response.data.toString(), '_organization.csv')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Data organisasi berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
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
      isOpen={selectedOrganization != undefined}
      onTouchOutside={() => setSelectedOrganization(undefined)}
      title={'Anda yakin ingin menghapus Organisasi?'}
      description={'Menghapus organisasi akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor Organisasi?'}
      description={'Data Organisasi akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  useEffect(() => {
    const error = deleteOrganizationStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelectedOrganization(undefined)
  }, [deleteOrganizationStatus?.error])

  useEffect(() => {
    setSelectedOrganization(undefined)
    const data = deleteOrganizationStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteOrganizationStatus?.data])

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        refreshData()
      }, 400)
    }
  }, [isFocused])

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Organisasi"
        headerRight={isAllowedToOrganizeOrganization ? () => <PlusButton onPress={onAdd} /> : undefined}
      />
      <ListFilter
        style={styles.filter}
        searchValue={query.search}
        onChangeSearch={handleSearch}
        onPressDownload={() => setModalExport(true)}
        sortOptions={sortOptions}
      />
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
            isAllowedToOrganizeOrganization={
              isAllowedToOrganizeOrganization
              // isAllowedToOrganizeOrganization && managedOrganizations.find(o => o.id === props.item.id) != undefined
            }
            {...props}
            onDelete={item => setSelectedOrganization(item)}
          />
        )}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus organisasi ini' : 'Organisasi berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
      <Loader loading={isDownloading} />
    </SafeAreaView>
  )
}

const PlusButton = ({onPress}: any) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Entypo name="plus" size={20} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {marginTop: 16},
  filter: {marginTop: 8},
})
