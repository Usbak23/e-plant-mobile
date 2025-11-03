import React, {useCallback, useEffect, useState} from 'react'
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
  SortPopup,
  SelectInput,
  Text,
} from '@app/presentations/_shared-components'
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native'
import moment from 'moment'
import {sortOptions} from './sort-options'
import {MenuOption, MenuOptions} from 'react-native-popup-menu'
import {theme} from '@app/presentations/utils/styles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Card from './bkm-card'
import Routes from '@app/presentations/navigation/Routes'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import System from '@app/domain/services/System'
import {IRSBKM} from '@app/domain/states/bkm/reducer'
import {useDispatch, useSelector} from 'react-redux'
import {IEffectPayload} from '@app/domain/states/types'
import {actions, RootStateType} from '@app/domain/states/store'
import {BkmEmployee2} from '@app/models/eplant/BKM'
import {filterData} from '@app/presentations/utils/filterData'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {useBKMLists} from '@app/domain/states/bkm/hooks'
import downloadFile from '@app/presentations/utils/downloadFile'
import BKMDetailInfo from './bkm-detail-info'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {IRSBKMTakeCare} from '@app/domain/states/bkm-take-care/reducer'
import {useBKMTakeCareLists} from '@app/domain/states/bkm-take-care/hooks'
import {useSubActivityOptions} from '@app/domain/states/subactivity/hooks'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {useWatch} from 'react-hook-form'
import {IBKMTakeCareFormDataCreate} from '@app/models/eplant/BKMTakeCare'
import {useIsAllowedToOrganizeBKMTakeCare} from '@app/domain/states/user/hooks'
import {ScrollView} from 'react-native-gesture-handler'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

const bkmTakecareSchema = yup.object().shape({
  subActivityId: yup.string().required('Pilih sub-aktivitas terlebih dahulu'),
})

const BKMList = () => {
  const isAllowedToOrganizeBKMTakeCare = useIsAllowedToOrganizeBKMTakeCare()
  const resolver = useYupValidationResolver(bkmTakecareSchema)
  const navigation: any = useNavigation()
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const isFocused = useIsFocused()
  const bkmData = route.params?.bkmData
  const organizationName = bkmData?.organization?.label || ''
  const divisionName = bkmData?.division?.name || ''
  const bkmDate = bkmData?.date || ''
  const subActivities = useSubActivityOptions('rawat')
  const [subActivity, setSubActivity] = useState('')

  const __subAct = useSelector((state: RootStateType) => state.subActivity?.subActivityAll?.data || []).find(
    (item: any) => item.id === subActivity,
  )

  const ___BKM__ = useSelector((state: RootStateType) => state.bkmTakeCare?.bkmTakeCareDetailMobile)
  const [query, setQuery] = useState({
    sort: 'name:asc',
    search: '',
  })
  const params = {
    organizationId: bkmData?.organization?.value,
    divisionId: bkmData?.division?.id,
    foremanId: bkmData?.foreman?.id,
    date: bkmData?.date,
  }

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      subActivityId: '',
    },
  })

  const [isDownloading, setDownloading] = useState(false)
  const [modalExport, setModalExport] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const [selected, setSelected] = useState<BkmEmployee2>()

  const withSort = (datas: any) => {
    if (!datas || !datas?.length) {
      return []
    }
    if (query.sort === 'name:asc') {
      return datas.sort((a: any, b: any) => (a.user.name.toLowerCase() > b.user.name.toLowerCase() ? 1 : -1))
    }
    if (query.sort === 'name:desc') {
      return datas.sort((a: any, b: any) => (a.user.name.toLowerCase() < b.user.name.toLowerCase() ? 1 : -1))
    }
    return datas
  }

  const {deleteBKMTakeCareStatus, formBKMTakeCareStatus, bkmTakeCareDetailMobile}: IRSBKMTakeCare = useSelector(
    (state: RootStateType) => state?.bkmTakeCare || {},
  )
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)

  // const {docs, hasOffline} = useBKMTakeCareLists(params, subActivity)
  const hasOffline = false

  const offlinesEmployees = useSelector((state: RootStateType) => state.bkmTakeCare?.bkmTakeCareListTemp || [])
  const v2ListBKMOffline = useSelector((state: RootStateType) => state?.bkmTakeCare?.bkmTakeCareDetailMobile)

  const concatWithOfflineData = (bkmEmployessOnline = []): any => {
    const filteredOfflines = offlinesEmployees.filter((bkmOffline: IBKMTakeCareFormDataCreate) => {
      return (
        bkmOffline?.date == params?.date &&
        bkmOffline?.divisionId == params?.divisionId &&
        bkmOffline?.foremanId == params?.foremanId &&
        bkmOffline?.subActivityId == getValues('subActivityId')
      )
    })

    const offlines = []
    for (let i = 0; i < filteredOfflines.length; i++) {
      let injectFlagIsTemp = filteredOfflines[i].bkmEmployee || []
      injectFlagIsTemp.forEach((item: any) => {
        offlines.push({...item, isTemp: true})
      })
    }

    return offlines.concat(bkmEmployessOnline)
  }

  const docsFiltered = (datas: any = [], q: string = '') => {
    if (q == '') {
      return datas
    }
    return (
      datas.filter((e: any) => {
        return (
          e.user?.name?.toLowerCase().includes(q.toLowerCase()) ||
          e.user?.nip?.toLowerCase().includes(q.toLowerCase()) ||
          e.workStatus?.name?.toLowerCase().includes(q.toLowerCase()) ||
          e.block?.code?.toLowerCase().includes(q.toLowerCase())
        )
      }) || []
    )
  }

  const concated = withSort(
    docsFiltered(concatWithOfflineData(v2ListBKMOffline?.data?.bkmEmployees || []), query.search),
  )

  const getData = useCallback(() => {
    if (subActivity && subActivity != '') {
      const p = {
        ...params,
        subActivityId: subActivity,
      }
      dispatch(actions.getBKMTakeCareMobile.request({loading: true, data: p}))
    }
    // dispatch(actions.getBKMTakeCareMobile.request({loading: true, data: params}))
  }, [params])

  const handleSearch = (search: string) => {
    setQuery({...query, search})
  }

  const handleDelete = () => {
    dispatch(actions.deleteBKMTakeCare.request({loading: true, data: selected}))
    setSelected(undefined)
  }

  const handleSort = (sort: string) => {
    const newState = {...query, sort}
    setQuery(newState)
  }

  const headerTitle = () => {
    return `Daftar BKM Rawat`
  }

  const contentTitle = () => {
    return `${divisionName}  ${bkmData?.foreman?.name} - ${bkmData?.foreman?.nip} - ${bkmData?.foreman?.typeEmployee?.name}`
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
      <MenuOption
        key={0}
        onSelect={() => {
          if (subActivity == '') {
            showErrorToast('Pilih sub aktivitas terlebih dahulu')
            return
          }
          setModalExport(true)
        }}>
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
          // navigation.navigate(Routes.BKM_TAKE_CARE_DETAIL, {bkmData: {...bkmData, bkmEmployees: docs, }})
          navigation.navigate(Routes.BKM_TAKE_CARE_DETAIL, {
            bkmData: {...bkmData, bkmEmployees: concated},
          })
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

  const onSubmit = (formSubActivity: any) => {
    navigation.navigate(Routes.BKM_TAKE_CARE_FORM, {
      bkmData: {...bkmData},
      bkmEmployees: concated,
      subAct: __subAct,
    })
  }

  const handleExport = async () => {
    setModalExport(false)
    setDownloading(true)
    try {
      const fileName = `BKM ${moment(bkmDate).format('DD-MM-YYYY')}.xls`
      const res = await downloadFile(
        System.instance.bkmTakeCareService.exportBKMTakeCareURL({
          ...params,
          subActivityId: subActivity,
        }),
        fileName,
      )
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'BKM Rawat berhasil diekspor', c.EXPORT_NOTIFICATION_ID, {
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
    const error = deleteBKMTakeCareStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteBKMTakeCareStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteBKMTakeCareStatus?.data?.data
    if (data?.code == 200) {
      getData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteBKMTakeCareStatus?.data])

  useEffect(() => {
    const error = formBKMTakeCareStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formBKMTakeCareStatus?.error])

  useEffect(() => {
    if (isFocused) {
      getData()
    }
  }, [isFocused])

  useEffect(() => {
    if (isConnected && offlinesEmployees.length > 0) {
      dispatch(actions.syncBKMTakeCare())
    }
    dispatch(actions.clearFormBKMTakeCareStatus())
  }, [])

  useEffect(() => {
    const data = formBKMTakeCareStatus?.data?.data
    if (data?.code == 200) {
      getData()
    }
  }, [formBKMTakeCareStatus?.data])

  useEffect(() => {
    getData()
  }, [subActivity])

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
    <View style={{marginHorizontal: 18, marginTop: 8, marginBottom: 6}}>
      <BKMDetailInfo bkmData={bkmData} />

      <SelectInput
        isRequired
        placeholder="Pilih Sub-aktivitas"
        hideLabel={true}
        control={control}
        name="subActivityId"
        items={subActivities}
        errorText={errors?.subActivityId?.message}
        onChange={v => {
          setValue('subActivityId', v, {shouldValidate: true})
          setSubActivity(v)
        }}
      />

      {offlinesEmployees.length != 0 ? <OfflineView /> : null}
    </View>
  )

  const OfflineView = () => (
    <TouchableOpacity
      disabled={Boolean(formBKMTakeCareStatus?.loading)}
      onPress={() => {
        if (!isConnected) {
          return showErrorToast('Anda dalam mode offline')
        }
        dispatch(actions.syncBKMTakeCare())
      }}
      style={styles.syncView}>
      <Text style={{flex: 1}} type="semibold" size={12} color={theme.colors.tealDark}>
        {formBKMTakeCareStatus?.loading ? 'Sedang mengunggah data...' : 'Beberapa data tersimpan sebagai draft'}
      </Text>
      <View>
        {!formBKMTakeCareStatus?.loading && (
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
        isAllowedToOrganizeBKMTakeCare={isAllowedToOrganizeBKMTakeCare}
        __subAct={__subAct}
        key={item.id}
        item={item}
        bkmData={bkmData}
        onPopupEdit={() => {
          if (getValues('subActivityId')) {
            navigation.navigate(Routes.BKM_TAKE_CARE_FORM, {bkmData, item, subAct: __subAct})
            return
          }
          showErrorToast('Pilih sub aktivitas terlebih dahulu')
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
          isAllowedToOrganizeBKMTakeCare
            ? () => (
                <TouchableOpacity onPress={handleSubmit(onSubmit)}>
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

      <ScrollView nestedScrollEnabled={true}>
        <ListHeaderComponent />

        <FlatList
          // ListHeaderComponent={ListHeaderComponent}
          // data={getValues('subActivityId') == '' ? [] : filteredData}
          data={getValues('subActivityId') == '' ? [] : concated}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl colors={[theme.colors.primary]} refreshing={false} onRefresh={() => getData()} />
          }
          ListEmptyComponent={EmptyList}
        />
      </ScrollView>

      <ModalDelete />
      <ModalExport />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus Karyawan ini' : 'Karyawan berhasil dihapus'}
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

export default BKMList
