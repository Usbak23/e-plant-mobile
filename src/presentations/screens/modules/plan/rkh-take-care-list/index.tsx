import React, {useCallback, useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import ModalInfo from '@components/ModalInfo'
import Routes from '@app/presentations/navigation/Routes'
import Card from './rkh-take-care-card'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {Loader, Text} from '@components/index'
import ModalAsk from '@components/ModalAsk'
import {IRKHTakeCareRow} from '@models/eplant/RKHTakeCare'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import RKHSummary from '@screens/modules/plan/rkh-list/rkh-summary'
import moment from 'moment'
import {useRKHTakeCareAll} from '@app/domain/states/rkh-take-care/hooks'
import {IRSRKHTakeCare} from '@app/domain/states/rkh-take-care/reducer'
import {filterData} from '@app/presentations/utils/filterData'
import RNFS from 'react-native-fs'
import {getToken} from '@app/domain/services/utils/Axios'
import {useIsAllowedToOrganizeRKH} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

interface Props {
  searchValue: string
  sortValue: string
  THE_DOCS: any
}

const RKHTakeCareList = forwardRef((props: Props, ref) => {
  const isAllowedToOrganizeRKH = useIsAllowedToOrganizeRKH()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const item = route.params?.item
  const organizationId = route.params?.organizationId
  const divisionId = route.params?.divisionId
  const rkhGeneralTemp = useSelector((state: RootStateType) => state?.rkh?.rkhListTemp || [])

  const limit = 10
  const [query, setQuery] = useState({
    sort: '',
    block: '',
    organization: organizationId,
    division: divisionId,
    date: moment(item?.dateRkh).format('D'),
  })

  const [isDownloading, setDownloading] = useState(false)
  const [selected, setSelected] = useState<IRKHTakeCareRow>()
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {rkhTakeCareList, deleteRKHTakeCareStatus, formRKHTakeCareStatus, rkhTakeCareListTemp}: IRSRKHTakeCare =
    useSelector((state: RootStateType) => state?.rkhTakeCare || {})
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)
  const {loading}: IEffectPayload = rkhTakeCareList || {loading: false}

  const docs = useRKHTakeCareAll(item?.dateRkh, divisionId)
  // const docs = props.THE_DOCS()

  const constructNaming = () => {
    const title = `RKH - ${moment(route.params?.dateRkh).format('D MMMM YYYY')}`
    const org = route.params?.item?.division?.organization?.name || ''
    const div = route.params?.item?.division?.name || ''
    return `${title} - ${org} - ${div}`
  }

  const withSort = (datas: any) => {
    if (!datas) {
      return []
    }

    if (props.sortValue == 'code:asc') {
      return datas.sort((a: any, b: any) => (a.block?.code > b.block?.code ? 1 : -1))
    } else if (props.sortValue == 'code:desc') {
      return datas.sort((a: any, b: any) => (a.block?.code < b.block?.code ? 1 : -1))
    }
    return datas
  }

  const withFiltering = (_datas: any = [], q?: string) => {
    if (!_datas) {
      return []
    }

    if (q) {
      return _datas.filter((_rkhTakeCare: any) => {
        return (
          _rkhTakeCare.block?.code.toLowerCase().includes(q.toLowerCase()) ||
          _rkhTakeCare.subActivity?.name.toLowerCase().includes(q.toLowerCase())
        )
      })
    }
    return _datas
  }

  // const filteredDocs = withSort(filterData(docs, props.searchValue))
  const filteredDocs = withSort(withFiltering(docs, props.searchValue))

  const getData = useCallback(data => {
    dispatch(
      actions.getRKHTakeCareAll.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleDelete = () => {
    dispatch(actions.deleteRKHTakeCare.request({loading: true, data: selected}))
    setSelected(undefined)
  }

  const onAdd = () => {
    navigation.navigate(Routes.RKH_TAKE_CARE_FORM, {
      ...route.params,
      rkh: item,
      item: undefined,
      docs: [...docs],
    })
  }

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ])
      }
      const dirx = RNFS.DownloadDirectoryPath
      const token = await getToken()
      if (typeof token === 'string') {
        const date = new Date()
        const num = Math.floor(date.getTime() + date.getSeconds() / 2)
        const r = RNFS.downloadFile({
          fromUrl: System.instance.rkhTakeCareService.exportRKHTakeCareURL(route.params?.item?.id || ''),
          headers: {
            Authorization: token,
          },
          toFile: `${dirx}/${num}_rkh_rawat_dan panen.xls`,
        })

        r.promise
          .then(result => {
            notifications
              .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'RKH berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
                path: `${dirx}/${num}_rkh_rawat_dan panen.xls`,
              })
              .then(res => {})
              .catch(e => {})
            showSuccessToast('RKH berhasil diekspor')
          })
          .catch(e => {
            showErrorToast('Gagal saat mengekspor file excel. Periksa internet dan akses penyimpanan')
          })
      }
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
      title={'Anda yakin ingin menghapus RKH?'}
      description={'Menghapus RKH Rawat akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor RKH Rawat?'}
      description={'Data RKH akan diekspor dalam format excel'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ListHeaderComponent = () => (
    <View style={{marginHorizontal: 22, marginBottom: 6}}>
      {isConnected && <RKHSummary />}
      <Text type="semibold">{constructNaming()}</Text>
      {/* <Text size={10}>{rkhTakeCareListTemp.length}</Text> */}

      {rkhTakeCareListTemp && rkhTakeCareListTemp?.length > 0 ? (
        <TouchableOpacity
          disabled={Boolean(formRKHTakeCareStatus?.loading)}
          onPress={() => {
            if (!isConnected) {
              return showErrorToast('Anda dalam mode offline')
            }

            if (rkhGeneralTemp.length > 0) {
              return showErrorToast('Unggah RKH Umum terlebih dahulu')
            }
            dispatch(actions.syncRKHTakeCare())
          }}
          style={styles.syncButton}>
          <View style={{flex: 1}}>
            <Text size={10} color="#00B098">
              Beberapa data tersimpan sebagai draft. Data tidak akan tersimpan hingga disinkronisasi.
            </Text>
          </View>
          <Text size={10} color="#00B098" type="semibold">
            Unggah
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )

  useEffect(() => {
    const error = deleteRKHTakeCareStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteRKHTakeCareStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteRKHTakeCareStatus?.data?.data
    if (data?.code == '200') {
      getData({})
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteRKHTakeCareStatus?.data])

  useEffect(() => {
    const error = formRKHTakeCareStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formRKHTakeCareStatus?.error])

  useEffect(() => {
    if (isFocused) {
      // props.THE_DOCS()
      // docs = useRKHTakeCareAll(item?.dateRkh, divisionId)
      getData({})
    }
  }, [isFocused])

  useEffect(() => {
    const data = formRKHTakeCareStatus?.data?.data
    if (data?.status == 'success') {
      getData({})
    }
  }, [formRKHTakeCareStatus?.data])

  useImperativeHandle(ref, () => ({
    showModalExport: () => setModalExport(true),
    onAdd,
  }))

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredDocs}
        style={styles.list}
        keyExtractor={item => item.id}
        // initialNumToRender={limit}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(filteredDocs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={() => getData({})} />
        }
        renderItem={props => (
          <Card
            isAllowedToOrganizeRKH={isAllowedToOrganizeRKH}
            {...props}
            docs={[...docs]}
            onDelete={item => setSelected(item)}
          />
        )}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus RKH ini' : 'RKH berhasil dihapus'}
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
  syncButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 176, 152, 0.2)',
    marginBottom: 6,
  },
})

export default RKHTakeCareList
