import React, { useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native'
import styles from '@app/presentations/screens/modules/attendance/attendance-list/styles'
import {
  Header,
  ListFilterAlt,
  Loader,
  ModalAsk,
  ModalInfo,
  SelectInput,
  SortPopup,
  Text,
} from '@app/presentations/_shared-components'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import moment from 'moment'
import { sortOptions } from './sort-options'
import { MenuOption, MenuOptions } from 'react-native-popup-menu'
import { theme } from '@app/presentations/utils/styles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Card from './bkm-card'
import Routes from '@app/presentations/navigation/Routes'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import System from '@app/domain/services/System'
import { IRSBKM } from '@app/domain/states/bkm/reducer'
import { useDispatch, useSelector } from 'react-redux'
import { IEffectPayload } from '@app/domain/states/types'
import { actions, RootStateType } from '@app/domain/states/store'
import { BkmEmployee2 } from '@app/models/eplant/BKM'
import { filterData } from '@app/presentations/utils/filterData'
import EmptyList from '@app/presentations/_shared-components/Empty'
import { useBKMLists } from '@app/domain/states/bkm/hooks'
import downloadFile from '@app/presentations/utils/downloadFile'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useIsAllowedToOrganizeBKMHarvest } from '@app/domain/states/user/hooks'
import * as c from '@utils/notifications/constantsNotificationt'
import * as notifications from '@utils/notifications/eksportNotification'
import { useSubActivityOptions } from '@app/domain/states/subactivity/hooks'

const BKMList = () => {
  const isAllowedToOrganizeBKMHarvest = useIsAllowedToOrganizeBKMHarvest()
  const navigation: any = useNavigation()
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const isFocused = useIsFocused()
  const bkmData = route.params?.bkmData
  const organizationName = bkmData?.organization?.label || ''
  const divisionName = bkmData?.division?.name || ''
  const bkmDate = bkmData?.date || ''

  const [query, setQuery] = useState({
    sort: '',
    search: '',
  })
  const params = {
    organizationId: bkmData?.organization?.value,
    divisionId: bkmData?.division?.id,
    foremanId: bkmData?.foreman?.id,
    date: bkmData?.date,
    subActivityId: bkmData?.subActivity?.value
  }

  const [isDownloading, setDownloading] = useState(false)
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; isDanger: boolean; message: string }>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const [selected, setSelected] = useState<BkmEmployee2>()

  const withSort = (datas: any) => {
    if (!datas || !datas?.length) {
      return []
    }
    if (query.sort === 'nip:asc') {
      return datas.sort((a: any, b: any) => (a.user.nip.toLowerCase() > b.user.nip.toLowerCase() ? 1 : -1))
    }
    if (query.sort === 'nip:desc') {
      return datas.sort((a: any, b: any) => (a.user.nip.toLowerCase() < b.user.nip.toLowerCase() ? 1 : -1))
    }
    return datas
  }

  const { deleteBKMStatus, formBKMStatus }: IRSBKM = useSelector((state: RootStateType) => state?.bkm || {})
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)

  const { docs, hasOffline } = useBKMLists(params)

  const filteredData = withSort(filterData(docs, query.search))


  const getData = useCallback(() => {
    dispatch(actions.getBKMMobile.request({ loading: true, data: params }))
  }, [params])

  const handleSearch = (search: string) => {
    setQuery({ ...query, search })
  }

  const handleDelete = () => {
    dispatch(actions.deleteBKM.request({ loading: true, data: selected }))
    setSelected(undefined)
  }

  const handleSort = (sort: string) => {
    const newState = { ...query, sort }
    setQuery(newState)
  }

  const headerTitle = () => {
    return `BKM ${organizationName} ${moment(bkmDate).format('DD/MM/YYYY')}`
  }

  const contentTitle = () => {
    return `${divisionName} - ${bkmData?.foreman?.name}  (${bkmData?.foreman?.nip}) - ${bkmData?.subActivity?.label}`
  }

  const SortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={sortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const AltOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <MenuOption key={0} onSelect={() => setModalExport(true)}>
        <View style={styles.popupLabel}>
          <AntDesign name="download" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Ekspor .xls
          </Text>
        </View>
      </MenuOption>
      <MenuOption
        key={1}
        onSelect={() => {
          navigation.navigate(Routes.BKM_DETAIL, { bkmData: { ...bkmData, bkmEmployees: docs } })
        }}>
        <View style={styles.popupLabel}>
          <AntDesign name="eyeo" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Lihat BKM
          </Text>
        </View>
      </MenuOption>
    </MenuOptions>
  )

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      let fileName = `BKM ${organizationName} ${moment(bkmDate).format('DD-MM-YYYY')} ${contentTitle()}.xls`
      fileName = fileName.replace('/', '')
      const res = await downloadFile(System.instance.bkmService.exportBKMURL(params), fileName)
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, c.NOTIF_BODY(fileName), c.EXPORT_NOTIFICATION_ID, {
          path: res,
        })
        .then(res => { })
        .catch(e => { })
      showSuccessToast('Success exported at ' + res)
    } catch (error: any) {
      showErrorToast(error?.message || 'Gagal saat mengekspor csv')
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    const error = deleteBKMStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteBKMStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteBKMStatus?.data?.data
    if (data?.code == 200) {
      getData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteBKMStatus?.data])

  useEffect(() => {
    const error = formBKMStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formBKMStatus?.error])

  useEffect(() => {
    if (isFocused) {
      getData()
    }
  }, [isFocused])

  useEffect(() => {
    if (isConnected && hasOffline) {
      dispatch(actions.syncBKM())
    }
    dispatch(actions.clearFormBKMStatus())
  }, [])

  useEffect(() => {
    const data = formBKMStatus?.data?.data
    if (data?.code == 200) {
      getData()
    }
  }, [formBKMStatus?.data])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus Karyawan di bkm ini?'}
      description={'Menghapus Karyawan di bkm ini akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor BKM?'}
      description={'Data BKM akan diekspor dalam format excel'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ListHeaderComponent = () => (
    <View style={{ marginHorizontal: 18 }}>
      {hasOffline ? <OfflineView /> : null}
      <Text style={{ alignSelf: 'center', textAlign: 'center' }} size={11.8} type="semibold">{contentTitle()}</Text>
    </View>
  )

  const OfflineView = () => (
    <TouchableOpacity
      disabled={Boolean(formBKMStatus?.loading)}
      onPress={() => {
        if (!isConnected) {
          return showErrorToast('Anda dalam mode offline')
        }
        dispatch(actions.syncBKM())
      }}
      style={styles.syncView}>
      <Text style={{ flex: 1 }} type="semibold" size={12} color={theme.colors.tealDark}>
        {formBKMStatus?.loading ? 'Sedang mengunggah data...' : 'Beberapa data tersimpan sebagai draft'}
      </Text>
      <View>
        {!formBKMStatus?.loading && (
          <Text color={theme.colors.tealDark} type="semibold" size={12}>
            Unggah
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )

  const renderItem = ({ item }: any) => {
    return (
      <Card
        isAllowedToOrganizeBKMHarvest={isAllowedToOrganizeBKMHarvest}
        key={item.id}
        item={item}
        bkmData={bkmData}
        onPopupEdit={() => {
          navigation.navigate(Routes.BKM_FORM, { bkmData, item })
        }}
        onPopupDelete={() => setSelected(item)}
      />
    )
  }
  return (
    <SafeAreaView style={styles.root}>
      <Header
        title={headerTitle()}
        headerRight={
          isAllowedToOrganizeBKMHarvest
            ? () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Routes.BKM_FORM, { bkmData: { ...bkmData }, bkmEmployees: docs })
                }}>
                <MaterialIcon name="add" size={22} color={theme.colors.black} />
              </TouchableOpacity>
            )
            : undefined
        }
      />
      <ListFilterAlt
        style={styles.filter}
        searchValue={query.search}
        onChangeSearch={handleSearch}
        sortOptions={SortOptions}
        alts={AltOptions}
      />

      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={filteredData}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl colors={[theme.colors.primary]} refreshing={false} onRefresh={() => getData()} />
        }
        ListEmptyComponent={EmptyList}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus Karyawan ini' : 'Karyawan berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({ ...modalInfo, isOpen: false })}
        onPositiveButtonTap={() => setModalInfo({ ...modalInfo, isOpen: false })}
      />
      <Loader loading={isDownloading} />
    </SafeAreaView>
  )
}

export default BKMList
