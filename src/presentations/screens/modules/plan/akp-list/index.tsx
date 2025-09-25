import React, {useCallback, useEffect, useState} from 'react'
import {StyleSheet, FlatList, SafeAreaView, TouchableOpacity, RefreshControl, View, Keyboard} from 'react-native'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import flux, {actions, RootStateType} from '@domain/states/store'
import Header from '@components/Header'
import ModalInfo from '@components/ModalInfo'
import Routes from '@app/presentations/navigation/Routes'
import Entypo from 'react-native-vector-icons/Entypo'
import Card from './akp-card'
import ListFilter from '@components/ListFilter'
import {IRSAKP} from '@domain/states/akp/reducer'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {SortOptions} from './sort-options'
import {Loader, SortPopup, Text} from '@components/index'
import {MenuOptions} from 'react-native-popup-menu'
import ModalAsk from '@components/ModalAsk'
import {IAKPRow} from '@models/eplant/AKP'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import {writeFile} from '@app/presentations/utils/writeFile'
import {useAKPLists} from '@app/domain/states/akp/hooks'
import {useIsAllowedToOrganizeAKP} from '@app/domain/states/user/hooks'
import AKPListHeader from './akp-list-header'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

export default function AKPList() {
  const routes: any = useRoute()
  const ORGANIZATION = routes?.params?.organization
  const DIVISION = routes?.params?.division
  const DATE = routes?.params?.date
  const isAllowedToOrganizeAKP = useIsAllowedToOrganizeAKP()
  const navigation: any = useNavigation()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const limit = 10
  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    numberAkp: '',
    divisionId: DIVISION?.value,
    date: DATE,
  })
  const [isDownloading, setDownloading] = useState(false)
  const [selected, setSelected] = useState<IAKPRow>()
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {akpList, deleteAKPStatus, formAKPStatus, akpListTemp}: IRSAKP = useSelector(
    (state: RootStateType) => state?.akp || {},
  )
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)
  const {data: lists, loading}: IEffectPayload = akpList || {loading: false}
  const {hasNextPage, nextPage, page} = lists || {page: 1}

  const docs = useAKPLists(DIVISION?.value, DATE)

  const getData = useCallback(data => {
    dispatch(
      actions.getAKPLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleSearch = (numberAkp: string) => {
    setQuery({...query, numberAkp})
    // TODO: PLease move debounce to epics
    clearTimeout(debounceSearch)

    debounceSearch = setTimeout(() => {
      getData({...query, numberAkp, page: 1, limit})
    }, 400)
  }

  const handleDelete = () => {
    dispatch(actions.deleteAKP.request({loading: true, data: selected}))
    setSelected(undefined)
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
    const obj = {
      parent: {
        ORGANIZATION: {...ORGANIZATION},
        DIVISION: {...DIVISION},
        DATE,
      },
    }
    navigation.navigate(Routes.AKP_FORM, {...obj})
  }

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      const response = await System.instance.akpService.exportAKP()
      const res = await writeFile(response.data.toString(), '_akp.csv')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'AKP berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
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
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus AKP?'}
      description={'Menghapus AKP akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor AKP?'}
      description={'Data AKP akan diekspor dalam format .csv'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ListHeaderComponent = () => (
    <View>
      <AKPListHeader date={DATE} organization={ORGANIZATION.label} division={DIVISION.label} />
      {akpListTemp && akpListTemp?.length > 0 ? (
        <TouchableOpacity
          disabled={Boolean(formAKPStatus?.loading)}
          onPress={() => {
            if (!isConnected) {
              return showErrorToast('Anda dalam mode offline')
            }
            dispatch(actions.syncAKP({data: {divisionId: DIVISION?.value, date: DATE}}))
          }}
          style={styles.syncButton}>
          <Text size={10} color="#00B098">
            Beberapa data tersimpan sebagai draft
          </Text>
          <Text size={10} color="#00B098" type="semibold">
            Unggah
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )

  useEffect(() => {
    const error = deleteAKPStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteAKPStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteAKPStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteAKPStatus?.data])

  useEffect(() => {
    const error = formAKPStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formAKPStatus?.error])

  useEffect(() => {
    if (isFocused) {
      refreshData()
    }
  }, [isFocused])

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Angka Kerapatan Panen"
        headerRight={isAllowedToOrganizeAKP ? () => <PlusButton onPress={onAdd} /> : undefined}
      />
      <ListFilter
        style={styles.filter}
        searchValue={query.numberAkp}
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
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
          ) : undefined
        }
        renderItem={props => (
          <Card
            isAllowedToOrganizeAKP={isAllowedToOrganizeAKP}
            {...props}
            onDelete={item => setSelected(item)}
            ORGANIZATION={ORGANIZATION}
            DIVISION={DIVISION}
            DATE={DATE}
          />
        )}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus AKP ini' : 'AKP berhasil dihapus'}
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
  syncButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 176, 152, 0.2)',
    marginHorizontal: 22,
    marginBottom: 6,
  },
})
