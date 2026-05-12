import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View} from 'react-native'
import styles from '@app/presentations/screens/modules/attendance/attendance-list/styles'
import {
  Header,
  ListFilterAlt,
  Loader,
  ModalAsk,
  ModalInfo,
  SortPopup,
  Text,
} from '@app/presentations/_shared-components'
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native'
import moment from 'moment'
import {sortOptions} from './sort-options'
import {MenuOption, MenuOptions} from 'react-native-popup-menu'
import {theme} from '@app/presentations/utils/styles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Card from './bpbks-card'
import Routes from '@app/presentations/navigation/Routes'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {writeFile} from '@app/presentations/utils/writeFile'
import System from '@app/domain/services/System'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {Doc} from '@app/models/eplant/BPBKS'
import {filterData} from '@app/presentations/utils/filterData'
import EmptyList from '@app/presentations/_shared-components/Empty'
import DetailInfo from './bpbks-detail-info'
import {IRSBPBKS} from '@app/domain/states/bpbks/reducer'
import {useBPBKSLists} from '@app/domain/states/bpbks/hooks'
import downloadFile from '@app/presentations/utils/downloadFile'
import {useIsAllowedToOrganizeBPBKS} from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

const BPBKSList = () => {
  const isAllowedToOrganizeBPBKS = useIsAllowedToOrganizeBPBKS()
  const navigation: any = useNavigation()
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const isFocused = useIsFocused()
  const bpbksData = route.params?.bpbksData
  const divisionName = bpbksData?.division?.name || ''

  const [query, setQuery] = useState({
    sort: '',
    search: '',
  })
  const params = {
    organizationId: bpbksData?.organization?.value,
    divisionId: bpbksData?.division?.id,
    foremanId: bpbksData?.foreman?.id,
    date: bpbksData?.date,
  }

  const [isDownloading, setDownloading] = useState(false)
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const [selected, setSelected] = useState<Doc>()

  const withSort = (datas: any) => {
    if (!datas || !datas?.length) {
      return []
    }
    if (query.sort === 'name:asc') {
      return datas.sort((a: any, b: any) =>
        a?.harvester?.name.toLowerCase() > b?.harvester?.name.toLowerCase() ? 1 : -1,
      )
    }
    if (query.sort === 'name:desc') {
      return datas.sort((a: any, b: any) =>
        a?.harvester?.name.toLowerCase() < b?.harvester?.name.toLowerCase() ? 1 : -1,
      )
    }
    return datas
  }

  const {deleteBPBKSStatus, formBPBKSStatus, bpbksAll}: IRSBPBKS = useSelector(
    (state: RootStateType) => state?.bpbks || {},
  )
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)

  const {docs, hasOffline} = useBPBKSLists(params)

  const withFilter = (d: any[] = [], option = '', sortBy = '') => {
    const filtered = d.filter(item => {
      const cutNumber = item?.cutNumber != undefined ? item?.cutNumber.toString() : ''
      return (
        cutNumber.includes(option.toLowerCase()) ||
        Object.keys(item).some(
          key =>
            typeof item[key] === 'string' &&
            item[key].toString().toLowerCase().includes(option.toString().toLowerCase()),
        )
      )
    })
    return filtered
  }

  const filteredData = withSort(withFilter(docs, query.search))

  const getData = useCallback(() => {
    // Clear state lama sebelum fetch data baru
    dispatch(actions.clearBPBKSAll())
    dispatch(actions.getBPBKSAll.request({loading: true, data: params}))
  }, [params.organizationId, params.divisionId, params.foremanId, params.date])

  const handleSearch = (search: string) => {
    setQuery({...query, search})
  }

  const handleDelete = () => {
    dispatch(actions.deleteBPBKS.request({loading: true, data: selected}))
    setSelected(undefined)
  }

  const handleSort = (sort: string) => {
    const newState = {...query, sort}
    setQuery(newState)
  }

  const headerTitle = () => {
    return `PMB`
  }

  const contentTitle = () => {
    return `${divisionName}  ${bpbksData?.foreman?.name} - ${bpbksData?.foreman?.nip} - ${bpbksData?.foreman?.typeEmployee?.name}`
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
      {isAllowedToOrganizeBPBKS && (
        <MenuOption
          key={2}
          onSelect={() => {
            navigation.navigate(Routes.BPBKS_FORM, {bpbksData, tphs: docs})
          }}>
          <View style={styles.popupLabel}>
            <AntDesign name="plus" size={15} color={theme.colors.textThinBlack} />
            <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
              Tambah PMB
            </Text>
          </View>
        </MenuOption>
      )}
    </MenuOptions>
  )

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      const fileName = `PMB ${bpbksData?.organization?.label} ${moment(params?.date).format(
        'DD-MM-YYYY',
      )} ${contentTitle()}.xls`
      const res = await downloadFile(System.instance.bpbksService.exportBPBKSURL(params), fileName)
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'PMB berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
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

  useEffect(() => {
    const error = deleteBPBKSStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteBPBKSStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteBPBKSStatus?.data?.data
    if (data?.code == 200) {
      getData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteBPBKSStatus?.data])

  useEffect(() => {
    const error = formBPBKSStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formBPBKSStatus?.error])

  useEffect(() => {
    if (isFocused) {
      getData()
    }
  }, [isFocused])

  useEffect(() => {
    if (isConnected && hasOffline) {
      dispatch(actions.syncBPBKS())
    }
    dispatch(actions.clearFormBPBKSStatus())
  }, [])

  useEffect(() => {
    const data = formBPBKSStatus?.data?.data
    if (data?.code == 200) {
      getData()
    }
  }, [formBPBKSStatus?.data])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus Pemanen di PMB ini?'}
      description={'Menghapus Pemanen di PMB ini akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor BPBKS?'}
      description={'Data BPBKS akan diekspor dalam format excel'}
      positiveButtonText={'Ekspor'}
    />
  )

  const ListHeaderComponent = () => (
    <View style={{marginHorizontal: 18, marginTop: 16, marginBottom: 6}}>
      <DetailInfo 
        bpbksData={{
          ...bpbksData, 
          totalLength: bpbksAll?.data?.bpbks?.totalLength,
          gardenTonnage: bpbksAll?.data?.bpbks?.gardenTonnage
        }} 
      />
      {hasOffline ? <OfflineView /> : null}
    </View>
  )

  const OfflineView = () => (
    <TouchableOpacity
      disabled={Boolean(formBPBKSStatus?.loading)}
      onPress={() => {
        if (!isConnected) {
          return showErrorToast('Anda dalam mode offline')
        }
        dispatch(actions.syncBPBKS())
      }}
      style={styles.syncView}>
      <Text style={{flex: 1}} type="semibold" size={12} color={theme.colors.tealDark}>
        {formBPBKSStatus?.loading ? 'Sedang mengunggah data...' : 'Beberapa data tersimpan sebagai draft'}
      </Text>
      <View>
        {!formBPBKSStatus?.loading && (
          <Text color={theme.colors.tealDark} type="semibold" size={12}>
            Unggah
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )

  const renderItem = ({item}: any) => {
    return (
      <Card
        isAllowedToOrganizeBPBKS={isAllowedToOrganizeBPBKS}
        key={item.id}
        item={item}
        bpbksData={bpbksData}
        onPopupEdit={() => navigation.navigate(Routes.BPBKS_FORM, {bpbksData, item})}
        onPopupDelete={() => setSelected(item)}
        onTap={() => navigation.navigate(Routes.BPBKS_EMPLOYEE_DETAIL, {bpbksData, item, tphs: docs})}
      />
    )
  }
  return (
    <SafeAreaView style={styles.root}>
      <Header title={headerTitle()} />
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
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus Pemanen ini' : 'Pemanen berhasil dihapus'}
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

export default BPBKSList
