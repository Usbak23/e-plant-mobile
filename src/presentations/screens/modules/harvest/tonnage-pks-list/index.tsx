import React, { useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import {
  DatePicker,
  Header,
  ListFilterAlt,
  ModalAsk,
  ModalInfo,
  SelectInput,
  SortPopup,
  Text,
} from '@app/presentations/_shared-components'
import { MenuOption, MenuOptions } from 'react-native-popup-menu'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import { TonnagePKSSortOptions } from './sort-option'
import { useForm } from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/tonnage-pks-list-validation'
import EmptyList from '@app/presentations/_shared-components/Empty'
import TonnagePKSCard from './tonnage-pks-card'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { IEffectPayload } from '@app/domain/states/types'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import { useOrganizationOptions } from '@app/domain/states/organization/hooks'
import { ITonnagePKSRow } from '@app/models/eplant/TonnagePKS'
import System from '@app/domain/services/System'
import RNFS from 'react-native-fs'
import { getToken } from '@app/domain/services/utils/Axios'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useIsAllowedToSeeTonnagePKS, useIsAllowedToOrganizeTonnagePKS } from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const TonnagePKSList = () => {
  const isAllowedToOrganizeTonnagePKS = useIsAllowedToOrganizeTonnagePKS()
  const isAllowedToSeeTonnagePKS = useIsAllowedToSeeTonnagePKS()
  const isFocused = useIsFocused()
  const limit = 10
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(schema.tonnagePKSListValidationSchema)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      organizationId: '',
      date: '',
    },
  })

  const [modalExport, setModalExport] = useState(false)
  const [isDownloading, setDownloading] = useState(false)
  const { tonnagePKSList, deleteTonnagePKSStatus } = useSelector((state: RootStateType) => state.tonnagePKS)
  const { data: lists, loading }: IEffectPayload = tonnagePKSList || { loading: false }
  const { docs, hasNextPage, nextPage, page } = lists || { docs: [], page: 1 }
  const organizations = useOrganizationOptions()
  const [selected, setSelected] = useState<ITonnagePKSRow | undefined>()

  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    search: '',
    organizationId: '',
    date: '',
  })

  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; isDanger: boolean; message: string }>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const handleExport = async () => {
    setModalExport(false)
    if (!isAllowedToSeeTonnagePKS) {
      showErrorToast('Anda tidak memiliki hak akses untuk melakukan export data')
      return
    }
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
          organizationId: getValues('organizationId'),
          date: getValues('date'),
        }
        const date = new Date()
        const num = Math.floor(date.getTime() + date.getSeconds() / 2)
        const r = RNFS.downloadFile({
          fromUrl: System.instance.tonnagePKSService.exportTonnagePKSURL(exportParams),
          headers: {
            Authorization: token,
          },
          toFile: `${dirx}/${num}_tonase_pks.xls`,
        })

        r.promise
          .then(result => {
            if (result.statusCode == 200) {
              notifications
                .onDisplayNotificationExportFile(
                  c.NOTIF_TITLE,
                  'Tonase PKS berhasil diekspor',
                  c.EXPORT_NOTIFICATION_ID,
                  {
                    path: `${dirx}/${num}_tonase_pks.xls`,
                  },
                )
                .then(res => { })
                .catch(e => { })
              showSuccessToast('Success exported')
            } else {
              showErrorToast('Tidak dapat mengekspor tonase pks. Pastikan anda memiliki data di dalamnya')
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

  const handleSearch = (search: string) => {
    setQuery({ ...query, search: search })
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({ ...query, search: search, page: 1, limit })
    }, 400)
  }

  const handleDelete = () => {
    if (selected) {
      dispatch(actions.deleteTonnagePKS.request({ loading: true, data: selected.id }))
      setSelected(undefined)
    }
  }

  const handleSort = (sort: string) => {
    const newState = { ...query, sort }
    setQuery(newState)
    getData({ ...newState, page: 1, limit })
  }

  const getData = useCallback(data => {
    dispatch(
      actions.getTonnagePKSPaginated.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const refreshData = useCallback(() => {
    getData({ ...query, page: 1, limit })
  }, [query])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({ ...query, page: nextPage })
  }

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        refreshData()
      }, 400)
    }
  }, [isFocused])

  useEffect(() => {
    dispatch(actions.getOrganizationAll.request({ loading: true }))
  }, [])

  useEffect(() => {
    const error = deleteTonnagePKSStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteTonnagePKSStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteTonnagePKSStatus?.data
    if (data?.code == 200) {
      refreshData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteTonnagePKSStatus?.data])

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={handleExport}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor Tonase PKS?'}
      description={'Data Tonase PKS akan diekspor dalam format excel'}
      positiveButtonText={'Ekspor'}
    />
  )

  const AltOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      {isAllowedToSeeTonnagePKS && (
        <MenuOption
          key={1}
          onSelect={() => {
            if (getValues('organizationId') == '' || getValues('date') == '') {
              showErrorToast('Pilih organisasi dan tanggal terlebih dahulu')
              return
            }
            setModalExport(true)
          }}>
          <View style={styles.popupLabel}>
            <AntDesign name="upload" size={15} color={theme.colors.textThinBlack} />
            <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
              Ekspor .xls
            </Text>
          </View>
        </MenuOption>
      )}

      {isAllowedToOrganizeTonnagePKS && (
        <MenuOption
          key={2}
          onSelect={() => {
            navigation.navigate(Routes.TONNAGE_PKS_FORM)
          }}>
          <View style={styles.popupLabel}>
            <AntDesign name="plus" size={15} color={theme.colors.textThinBlack} />
            <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
              Tambah Tonase PKS
            </Text>
          </View>
        </MenuOption>
      )}
    </MenuOptions>
  )

  const SortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={TonnagePKSSortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const FilterView = () => {
    return (
      <View style={styles.filterView}>
        <View style={styles.filterContainer}>
          <View style={{ marginTop: 8, flex: 1 }}>
            <SelectInput
              isRequired
              hideLabel={true}
              control={control}
              name="organizationId"
              items={organizations}
              onChange={v => {
                setQuery({ ...query, organizationId: v })
                getData({ ...query, organizationId: v })
              }}
            />
          </View>
        </View>
        <View style={styles.filterContainer}>
          <ScrollView scrollEnabled={false} style={{ flex: 1 }}>
            <DatePicker
              name="date"
              control={control}
              hideLabel={true}
              label=""
              placeholder="Pilih Tanggal"
              errorText={errors?.date?.message}
              isRequired={true}
              onChangeText={value => {
                setValue('date', value, {
                  shouldValidate: true,
                })
                setQuery({ ...query, date: value })
                getData({ ...query, date: value })
              }}
            />
          </ScrollView>
        </View>
      </View>
    )
  }

  const renderItem = ({ item, index }: any) => (
    <TonnagePKSCard
      isAllowedToOrganizeTonnagePKS={isAllowedToOrganizeTonnagePKS}
      item={item}
      onDelete={() => setSelected(item)}
      onEdit={() => {
        navigation.navigate(Routes.TONNAGE_PKS_FORM, { item })
      }}
      onTap={() => {
        navigation.navigate(Routes.TONNAGE_PKS_DETAIL, { item })
      }}
      key={index.toString()}
    />
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus Tonase PKS ini?'}
      description={'Menghapus Tonase PKS ini akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Tonase PKS" />
      <ListFilterAlt
        alts={AltOptions}
        searchValue={query.search}
        onChangeSearch={handleSearch}
        onPressDownload={() => { }}
        sortOptions={SortOptions}
      />
      <FilterView />

      <FlatList
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        data={query.organizationId != '' && query.date != '' ? docs : []}
        initialNumToRender={limit}
        onEndReachedThreshold={0.5}
        onEndReached={getNextPage}
        renderItem={renderItem}
        refreshControl={
          page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
          ) : undefined
        }
      />

      <ModalDelete />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus tonase pks ini' : 'Tonase PKS berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({ ...modalInfo, isOpen: false })}
        onPositiveButtonTap={() => setModalInfo({ ...modalInfo, isOpen: false })}
      />
      <ModalExport />
    </SafeAreaView>
  )
}

export default TonnagePKSList

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  filterView: {
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    // flex: 1,
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 6,
  },

  popupLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    padding: 8,
  },
})
