import React, { useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native'
import styles from '@app/presentations/screens/modules/harvest/pma-list/styles'
import {
  Header,
  ListFilterAlt,
  Loader,
  ModalAsk,
  ModalInfo,
  SortPopup,
  Text,
} from '@app/presentations/_shared-components'

import { sortOptions } from './sort-options'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MenuOption, MenuOptions } from 'react-native-popup-menu'
import { theme } from '@app/presentations/utils/styles'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import moment from 'moment'
import PMACard from './pma-card'
import Routes from '@app/presentations/navigation/Routes'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { IPMAEmployee, IPMAEmployeeFormData, IPMAEmployeeMerged, IPMAFormData } from '@app/models/eplant/PMA'
import EmptyList from '@app/presentations/_shared-components/Empty'
import { showErrorToast, showInfoToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import RNFS from 'react-native-fs'
import { useIsConnected } from 'react-native-offline'
import { usePma } from '@app/domain/states/pma/hooks'
import { getToken } from '@app/domain/services/utils/Axios'
import System from '@app/domain/services/System'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useIsAllowedToOrganizePMA } from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

const PMAList = () => {
  const isAllowedToOrganizePMA = useIsAllowedToOrganizePMA()
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const pmaFilterData = route?.params?.pmaFilterData

  const realPma = usePma(pmaFilterData?.division?.id, pmaFilterData?.datePMA, pmaFilterData?.foreman?.id)
  const formPmaStatus = useSelector((state: RootStateType) => state.pma?.formPMAStatus)
  const { deletePMAStatus } = useSelector((state: RootStateType) => state.pma || {})

  const [query, setQuery] = useState({
    sort: 'name:asc',
    name: '',
  })

  const withSort = (datas: IPMAEmployeeMerged[] = []) => {
    if (!datas) {
      return []
    }
    if (query.sort == 'name:asc') {
      return datas.sort((a: IPMAEmployeeMerged, b: IPMAEmployeeMerged) => (a?.user?.name > b?.user?.name ? 1 : -1))
    } else if (query.sort == 'name:desc') {
      return datas.sort((a: IPMAEmployeeMerged, b: IPMAEmployeeMerged) => (a?.user?.name < b?.user?.name ? 1 : -1))
    } else if (query.sort == 'nip:asc') {
      return datas.sort((a: IPMAEmployeeMerged, b: IPMAEmployeeMerged) => (a?.user?.nip > b?.user?.nip ? 1 : -1))
    } else if (query.sort == 'nip:desc') {
      return datas.sort((a: IPMAEmployeeMerged, b: IPMAEmployeeMerged) => (a?.user?.nip < b?.user?.nip ? 1 : -1))
    }
    return datas
  }

  const docsFiltered = (datas: IPMAEmployeeMerged[] = [], q: string = '') => {
    return (
      datas.filter((e: IPMAEmployeeMerged) => {
        return (
          e.user?.name?.toLowerCase().includes(q.toLowerCase()) ||
          e.block?.code?.toLowerCase().includes(q.toLowerCase()) ||
          e.user?.nip?.toLowerCase().includes(q.toLowerCase())
        )
      }) || []
    )
  }

  const docs = withSort(docsFiltered(realPma?.employee || [], query.name))

  const params = {
    divisionId: pmaFilterData?.division?.id,
    foremanId: pmaFilterData?.foreman?.id,
    date: pmaFilterData?.datePMA,
  }

  const handleSearch = (q: string) => setQuery({ ...query, name: q })

  const handleSort = (sort: string) => setQuery({ ...query, sort })

  const [selected, setSelected] = useState<IPMAEmployeeMerged | undefined>()
  const [isDownloading, setDownloading] = useState(false)
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; isDanger: boolean; message: string }>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const headerTitle = () => {
    const org = pmaFilterData?.organization?.label || ''
    const division = pmaFilterData?.division?.name || ''
    const foreman = `${pmaFilterData?.foreman?.name || ''} ${pmaFilterData?.foreman?.nip || ''} ${pmaFilterData?.foreman?.role?.name || ''
      }`
    return `${org} - ${division} - ${foreman}`
  }

  const getData = useCallback(() => {
    dispatch(actions.getPMAMobile.request({ loading: true, data: params }))
  }, [])

  const goToEditPmaForm = (item: IPMAEmployee) => {
    navigation.navigate(Routes.PMA_FORM, {
      pmaFilterData: { ...pmaFilterData },
      pma: realPma,
      item,
    })
  }

  const handleDelete = () => {
    if (selected) {
      dispatch(actions.deletePMA.request({ loading: true, data: selected }))
      setSelected(undefined)
    }
  }

  useEffect(() => {
    if (isFocused) {
      getData()
    }
  }, [isFocused])

  useEffect(() => {
    const error = deletePMAStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deletePMAStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deletePMAStatus?.data?.data
    if (data?.code == 200) {
      getData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deletePMAStatus?.data])

  useEffect(() => {
    const error = formPmaStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formPmaStatus?.error])

  useEffect(() => {
    const data = formPmaStatus?.data
    if (data?.status == 'success') {
      showSuccessToast('Berhasil disimpan')
    }
  }, [formPmaStatus?.data])

  useEffect(() => {
    const data = formPmaStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Berhasil diperbarui')
    }
  }, [formPmaStatus?.data?.data])

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
            Ekspor excel
          </Text>
        </View>
      </MenuOption>
      <MenuOption
        key={1}
        onSelect={() => {
          navigation.navigate(Routes.PMA_PREVIEW, {
            pmaFilterData: { ...pmaFilterData },
            pmaParent: realPma,
            employeeList: docs,
          })
        }}>
        <View style={styles.popupLabel}>
          <AntDesign name="eyeo" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Lihat PMA
          </Text>
        </View>
      </MenuOption>
    </MenuOptions>
  )

  const ListHeaderComponent = () => (
    <View style={{ marginHorizontal: 18, marginTop: 16 }}>
      {docs?.find((data: IPMAEmployeeMerged) => data?.isDraft == true) != undefined && <OfflineView />}

      <Text type="semibold">{headerTitle()}</Text>
    </View>
  )

  const renderItem = ({ item, index }: any) => {
    return (
      <PMACard
        isAllowedToOrganizePMA={isAllowedToOrganizePMA}
        key={index}
        onTap={() => {
          navigation.navigate(Routes.PMA_DETAIL, {
            pmaFilterData: { ...pmaFilterData },
            pmaParent: realPma,
            item,
          })
        }}
        onDelete={() => setSelected(item)}
        onEdit={() => goToEditPmaForm(item)}
        foremanName={`${item?.user?.nip || ''} - ${item?.user?.name || ''}` || '-'}
        item={item}
        pmaFilterData={pmaFilterData}
        isDraft={Boolean(item?.isDraft)}
      />
    )
  }

  const OfflineView = () => (
    <View style={styles.syncView}>
      <Text style={{ flex: 1 }} type="semibold" size={12} color={theme.colors.tealDark}>
        Beberapa data tersimpan sebagai draft {query.name}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (isConnected) {
            dispatch(actions.syncPMA())
            return
          }
          showInfoToast('Periksa kembali internet anda')
        }}>
        <Text color={theme.colors.tealDark} type="semibold" size={12}>
          Unggah
        </Text>
      </TouchableOpacity>
    </View>
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus Karyawan di PMA ini?'}
      description={'Menghapus Karyawan di PMA ini akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

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
        const exportParams = {
          date: pmaFilterData?.datePMA,
          foremanId: pmaFilterData?.foreman?.id,
          divisionId: pmaFilterData?.division?.id,
        }
        const date = new Date()
        const num = Math.floor(date.getTime() + date.getSeconds() / 2)
        const r = RNFS.downloadFile({
          fromUrl: System.instance.pmaService.exportPMA(exportParams),
          headers: {
            Authorization: token,
          },
          toFile: `${dirx}/${num}_pma.xls`,
        })

        r.promise
          .then(result => {
            if (result.statusCode == 200) {
              notifications
                .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'PMA berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
                  path: `${dirx}/${num}_pma.xls`,
                })
                .then(res => { })
                .catch(e => { })
              showSuccessToast('PMA berhasil diekspor')
            } else {
              showErrorToast('PMA tidak dapat diekspor. Pastikan anda memiliki data')
            }
          })
          .catch(e => {
            showErrorToast('Gagal saat mengekspor file excel. Periksa internet dan akses penyimpanan')
          })
      }
    } catch (error) {
      showErrorToast('Gagal saat mengekspor excel file. Periksa internet dan akses penyimpanan.')
    } finally {
      setDownloading(false)
    }
  }

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor PMA?'}
      description={'Data PMA akan diekspor dalam format excel'}
      positiveButtonText={'Ekspor'}
    />
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title={`PMA - ${moment(pmaFilterData?.datePMA).format('D MMMM YYYY')}`}
        headerRight={
          isAllowedToOrganizePMA
            ? () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Routes.PMA_FORM, {
                    pmaFilterData: { ...pmaFilterData },
                    pma: realPma,
                  })
                }}>
                <MaterialIcon name="add" size={22} color={theme.colors.black} />
              </TouchableOpacity>
            )
            : undefined
        }
      />

      <ListFilterAlt
        style={styles.filter}
        searchValue={query.name}
        onChangeSearch={handleSearch}
        onPressDownload={() => { }}
        sortOptions={SortOptions}
        alts={AltOptions}
      />

      <FlatList
        ListEmptyComponent={EmptyList}
        ListHeaderComponent={ListHeaderComponent}
        data={docs}
        refreshControl={
          <RefreshControl colors={[theme.colors.primary]} refreshing={false} onRefresh={() => getData()} />
        }
        renderItem={renderItem}
      />
      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus PMA ini' : 'PMA berhasil dihapus'}
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

export default PMAList
