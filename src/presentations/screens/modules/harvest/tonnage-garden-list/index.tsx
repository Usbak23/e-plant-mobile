import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import {
  DatePicker,
  Header,
  ListFilterAlt,
  Loader,
  ModalAsk,
  ModalInfo,
  SelectInput,
  SortPopup,
  Text,
} from '@app/presentations/_shared-components'
import { TonnagegardenSortOptions } from '@app/presentations/screens/modules/harvest/tonnage-garden-list/sort-options'
import { MenuOption, MenuOptions } from 'react-native-popup-menu'
import EmptyList from '@app/presentations/_shared-components/Empty'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/tonnage-garden-list-validation'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useForm } from 'react-hook-form'
import TonnageGardenCard from './tonnage-garden-card'
import Routes from '@app/presentations/navigation/Routes'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { IEffectPayload } from '@domain/states/types'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import { useOrganizationOptions } from '@app/domain/states/organization/hooks'
import { ITonnageGardenRow } from '@app/models/eplant/TonnageGarden'
import downloadFile from '@app/presentations/utils/downloadFile'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import System from '@app/domain/services/System'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useIsAllowedToOrganizeTonnageGarden, useIsAllowedToSeeTonnageGarden } from '@app/domain/states/user/hooks'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const TonnageGardenList = () => {
  const isAllowedToOrganizeTonnageGarden = useIsAllowedToOrganizeTonnageGarden()
  const isAllowedToSeeTonnageGarden = useIsAllowedToSeeTonnageGarden()
  const isFocused = useIsFocused()
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(schema.tonnageGardenListValidationSchema)
  const limit = 10

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      organizationId: '',
      date: '',
    },
  })

  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    search: '',
    organizationId: '',
    date: '',
  })

  const [isDownloading, setDownloading] = useState(false)
  const [modalExport, setModalExport] = useState(false)

  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; isDanger: boolean; message: string }>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const getData = useCallback(data => {
    dispatch(
      actions.getTonnageGardenPaginated.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleSearch = (search: string) => {
    setQuery({ ...query, search: search })
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({ ...query, page: 1, limit, search: search })
    }, 500)
  }

  const handleDelete = () => {
    if (selected) {
      dispatch(actions.deleteTonnageGarden.request({ loading: true, data: selected.id }))
      setSelected(undefined)
    }
  }

  const handleSort = (sort: string) => {
    const newState = { ...query, sort }
    setQuery(newState)
    getData({ ...newState, page: 1, limit })
  }

  const handleExport = async () => {
    setModalExport(false)
    if (!isAllowedToSeeTonnageGarden) {
      showErrorToast('Anda tidak memiliki izin untuk mengekspor data')
      return
    }

    setDownloading(true)
    try {
      const fileName = `Tonase Kebun ${query.date}.xls`
      const res = await downloadFile(
        System.instance.tonnageGarderService.exportTonnageGardenURL({
          organizationId: query.organizationId,
          date: query.date,
        }),
        fileName,
      )
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Tonase kebun berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
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

  const handleUpload = () => {
    if (!query.date && !query.organizationId) {
      showErrorToast('Pilih Organisasi dan Tanggal terlebih dahulu!')
      return
    }
    navigation.navigate(Routes.TONNAGE_GARDEN_UPLOAD_FILE, { query })
  }

  const handleDownloadTemplate = async () => {
    const fileName = `Template Tonase Kebun.xls`
    const res = await downloadFile(System.instance.tonnageGarderService.downloadTemplateURL(), fileName)
    notifications
      .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Template Tonase Kebun berhasil diunduh', c.EXPORT_NOTIFICATION_ID, {
        path: res,
      })
      .then(res => { })
      .catch(e => { })
    showSuccessToast('Template berhasil disimpan di' + res)
  }

  const { tonnageGardenList, deleteTonnageGardenStatus } = useSelector((state: RootStateType) => state.tonnageGarden)
  const { data: lists, loading }: IEffectPayload = tonnageGardenList || { loading: false }
  const { docs, hasNextPage, nextPage, page } = lists || { docs: [], page: 1 }
  const [selected, setSelected] = useState<ITonnageGardenRow>()

  const organizations = useOrganizationOptions()

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
    const error = deleteTonnageGardenStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteTonnageGardenStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteTonnageGardenStatus?.data?.data
    if (data?.code == 200) {
      refreshData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteTonnageGardenStatus?.data])

  useEffect(() => {
    dispatch(actions.getOrganizationAll.request({ loading: true }))
  }, [])

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

  const SortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={TonnagegardenSortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus Tonase Kebun ini?'}
      description={'Menghapus Tonase Kebun ini akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalExport = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleExport()}
      isOpen={modalExport}
      onTouchOutside={() => setModalExport(false)}
      title={'Anda yakin ingin mengekspor Tonase Kebun?'}
      description={'Data Tonase Kebun akan diekspor dalam format excel'}
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
      {isAllowedToOrganizeTonnageGarden && (
        <MenuOption key={0} onSelect={handleUpload}>
          <View style={styles.popupLabel}>
            <AntDesign name="upload" size={15} color={theme.colors.textThinBlack} />
            <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
              Unggah File .xls
            </Text>
          </View>
        </MenuOption>
      )}

      <MenuOption
        key={1}
        onSelect={() => {
          setModalExport(true)
        }}>
        <View style={styles.popupLabel}>
          <AntDesign name="upload" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Ekspor .xls
          </Text>
        </View>
      </MenuOption>


      <MenuOption
        key={2}
        onSelect={handleDownloadTemplate}>
        <View style={styles.popupLabel}>
          <AntDesign name="download" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Unduh Template
          </Text>
        </View>
      </MenuOption>
    </MenuOptions>
  )

  const renderItem = ({ item, index }: any) => (
    <TonnageGardenCard
      isAllowedToOrganizeTonnageGarden={isAllowedToOrganizeTonnageGarden}
      item={item}
      onTap={() => {
        navigation.navigate(Routes.TONNAGE_GARDEN_DETAIL, { item })
      }}
      onDelete={() => setSelected(item)}
      key={index.toString()}
      onEdit={() => {
        navigation.navigate(Routes.TONNAGE_GARDEN_FORM, { item: item })
      }}
    />
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title="Tonase Kebun"
        headerRight={
          isAllowedToOrganizeTonnageGarden
            ? () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Routes.TONNAGE_GARDEN_FORM)
                }}>
                <MaterialIcon name="add" size={22} color={theme.colors.black} />
              </TouchableOpacity>
            )
            : undefined
        }
      />

      <ListFilterAlt
        alts={AltOptions}
        searchValue={query.search}
        onChangeSearch={handleSearch}
        onPressDownload={() => { }}
        sortOptions={SortOptions}
      />
      <FilterView />

      <FlatList
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs?.length > 0 && loading)} />}
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

      <ModalExport />
      <ModalDelete />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus tonase kebun ini' : 'Tonase kebun berhasil dihapus'}
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

export default TonnageGardenList

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
